const request = require('supertest');
const app = require('./server');

describe('API de Pontos', () => {
  test('Deve responder com 200', async () => {
    // Verificação de segurança
    if (typeof app.listen !== 'function') {
      console.error("ERRO: O objeto exportado não é uma aplicação Express válida.");
    }
    
    const response = await request(app).get('/api/pontos');
    expect(response.statusCode).toBe(200);
  });
});