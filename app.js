// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const rateLimiter = require('./middleware/rateLimiter');
const { trackingMiddleware, trackingRoutes } = require('./middleware/trackingMiddleware');

const app = express();

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

// Adicionar rotas de tracking antes das outras rotas
app.post('/api/tracking/save-utms', trackingRoutes.saveUTMs);
app.get('/api/tracking/get-utms', trackingRoutes.getUTMs);

// Adicionar middleware de tracking
app.use(trackingMiddleware);

// Webhook route
app.post('/webhook', async (req, res) => {
  try {
    console.log("webhook chamado")
    const webhookUrl = 'https://n8n.hocketzap.com/webhook-test/b62c58e0-e5ca-43b8-9063-d8994a8beb66';
    const data = req.body;
    const response = await axios.post(webhookUrl, data);
    
    console.log(`Dados enviados para o webhook: ${webhookUrl}`);
    console.log('Resposta do webhook:', response.data);
    
    res.status(200).send('Webhook recebido e redirecionado com sucesso!');
  } catch (error) {
    console.error('Erro ao chamar o webhook:', error.message);
    res.status(500).send('Erro ao processar o webhook.');
  }
});

// Routes existentes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/withdraw', require('./routes/withdraw'));
app.use('/api/activities', require('./routes/activity'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));