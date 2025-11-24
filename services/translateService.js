const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config(); // Asumiendo que usas variables de entorno

class AiService {
  
  constructor() {
    // Inicializamos la configuración UNA sola vez
    this.baseUrl = process.env.AI_API_URL || 'https://api-de-tu-ia.com';
    //this.apiKey = process.env.AI_API_KEY; // Si la necesitas
    
    // Configuración base de Axios para no repetirla
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000, // 10 segundos máximo de espera
    });
  }

  /**
   * Envía un archivo de audio a la API externa
   * @param {string} filePath - Ruta del archivo .wav
   * @returns {Promise<Object>} Respuesta de la API
   */
  async enviarAudio(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      // Si necesitas enviar metadatos adicionales
      form.append('context', 'emergencia_911');

      console.log(`🚀 [AiService] Enviando: ${filePath}`);

      // Usamos la instancia pre-configurada de axios
      // Nota: getHeaders() es necesario cuando usas form-data manual en Node
      const response = await this.client.post('/trans', form, {
        headers: {
          ...form.getHeaders() 
        }
      });

      console.log('🤖 [AiService] Respuesta:', response.data);
      return response.data;

    } catch (error) {
      // Manejo de errores robusto
      if (error.response) {
        console.error(`❌ Error API (${error.response.status}):`, error.response.data);
      } else {
        console.error(`❌ Error de conexión:`, error.message);
      }
      // Opcional: Podrías guardar el error en un log o base de datos
      return null;
    }
  }
}

// --- TRUCO PRO ---
// Exportamos "new AiService()" para que actúe como Singleton.
// Así, todos los archivos que hagan require de esto compartirán la misma instancia.
module.exports = new AiService();