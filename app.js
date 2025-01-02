// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

app.use(express.json());

const trackingMiddleware = require('./middleware/trackingMiddleware');
app.use(trackingMiddleware);

// Rota para ouvir o webhook
app.post('/webhook', async (req, res) => {
  try {
    console.log("webhook chamado")
    const webhookUrl = 'https://n8n.hocketzap.com/webhook-test/b62c58e0-e5ca-43b8-9063-d8994a8beb66';

    // Dados recebidos no webhook
    const data = req.body;

    // Chamar o webhook fornecido
    const response = await axios.post(webhookUrl, data);

    console.log(`Dados enviados para o webhook: ${webhookUrl}`);
    console.log('Resposta do webhook:', response.data);

    // Responder ao webhook original
    res.status(200).send('Webhook recebido e redirecionado com sucesso!');
  } catch (error) {
    console.error('Erro ao chamar o webhook:', error.message);

    // Responder com erro
    res.status(500).send('Erro ao processar o webhook.');
  }
});


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/withdraw', require('./routes/withdraw'));
app.use('/api/activities', require('./routes/activity'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 2020;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));