const config = require('../config');
const twilio = require('twilio');

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

async function updateTwilioWebhook() {
    try {
        const number = await client.incomingPhoneNumbers(config.twilioPhoneNumberSid)
            .update({
                voiceUrl: `https://${config.wsUrl}/voice`, // Aquí concatenas tu ruta
                voiceMethod: 'POST'             // O 'GET' según necesites
            });

        console.log(`✅ Twilio actualizado! El número ${number.phoneNumber} ahora apunta a: ${number.voiceUrl}`);
    } catch (error) {
        console.error('❌ Error actualizando Twilio:', error);
    }
}

module.exports = updateTwilioWebhook;