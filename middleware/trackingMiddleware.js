// middleware/trackingMiddleware.js
const Transaction = require('../models/Transaction');

const trackingMiddleware = async (req, res, next) => {
  try {
    // Captura os parâmetros UTM da query string
    const utmParams = {
      utm_source: req.query.utm_source,
      utm_medium: req.query.utm_medium,
      utm_campaign: req.query.utm_campaign,
      utm_content: req.query.utm_content,
      utm_term: req.query.utm_term,
      src: req.query.src,
      sck: req.query.sck
    };

    // Armazena os parâmetros UTM na requisição para uso posterior
    req.trackingParams = utmParams;
    
    next();
  } catch (error) {
    console.error('Erro no middleware de tracking:', error);
    next();
  }
};

module.exports = trackingMiddleware;