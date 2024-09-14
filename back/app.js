const express = require('express');
const path = require('path');
const productRoutes = require('./routes/product');
const app = express();


// Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  // Autorise l'accès à l'API depuis n'importe quelle origine (*)
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Définit les en-têtes autorisés dans la requête
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Définit les méthodes HTTP autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware pour servir les fichiers d'images statiques
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

// Middleware pour parser les données de requête URL encodées et JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Middleware pour utiliser les routes des produits
app.use('/api/products', productRoutes);

// Exportation de l'application Express pour une utilisation dans d'autres fichiers
module.exports = app;