require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  aiApiUrl: process.env.AI_API_URL || null,
  wsUrl: process.env.WS_URL || null,
  aiApiKey: process.env.AI_API_KEY || null,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || null,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || null,
  twilioPhoneNumberSid: process.env.TWILIO_PHONE_NUMBER_SID || null,
};

module.exports = config;
