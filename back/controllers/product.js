// Importation du module UUID pour la génération d'identifiants uniques
const uuid = require('uuid/v1');
const Product = require('../models/Product');

// Contrôleur pour obtenir tout les produits
exports.getAllProducts = (req, res, next) => {
  // Recherche de tous les produits dans la base de données
  Product.find().then(
    (products) => {
      // Mappage des produits pour ajouter l'URL de l'image complète
      const mappedProducts = products.map((product) => {
        product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
        return product;
      });
      // Envoi des produits mappés en tant que réponse
      res.status(200).json(mappedProducts);
    }
  ).catch(
    () => {
      // En cas d'erreur de la base de données, envoi d'une erreur 500
      res.status(500).send(new Error('Database error!'));
    }
  );
};

// Contrôleur pour obtenir un produit spécifique
exports.getOneProduct = (req, res, next) => {
  // Recherche d'un produit par son ID dans la base de données
  Product.findById(req.params.id).then(
    (product) => {
      // Si le produit n'est pas trouvé, envoi d'une erreur 404
      if (!product) {
        return res.status(404).send(new Error('Product not found!'));
      }
      // Ajout de l'URL de l'image complète au produit et envoi du produit en tant que réponse
      product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
      res.status(200).json(product);
    }
  ).catch(
    () => {
      // En cas d'erreur de la base de données, envoi d'une erreur 500
      res.status(500).send(new Error('Database error!'));
    }
  );
};

// Contrôleur pour passer une commande de produits
exports.orderProducts = (req, res, next) => {
  // Vérification de la présence de données de contact et de produits dans la requête
  if (!req.body.contact ||
      !req.body.contact.firstName ||
      !req.body.contact.lastName ||
      !req.body.contact.address ||
      !req.body.contact.city ||
      !req.body.contact.email ||
      !req.body.products) {
    // Si des données manquent, envoi d'une erreur 400
    return res.status(400).send(new Error('Bad request!'));
  }
  // Création d'une liste de promesses pour chaque produit dans la commande
  let queries = [];
  for (let productId of req.body.products) {
    const queryPromise = new Promise((resolve, reject) => {
      // Recherche du produit par son ID dans la base de données
      Product.findById(productId).then(
        (product) => {
          // Si le produit n'est pas trouvé, rejet de la promesse avec une erreur
          if (!product) {
            reject('Product not found: ' + productId);
          }
          // Ajout de l'URL de l'image complète au produit et résolution de la promesse avec le produit
          product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
          resolve(product);
        }
      ).catch(
        () => {
          // En cas d'erreur de la base de données, rejet de la promesse avec une erreur
          reject('Database error!');
        }
      )
    });
    queries.push(queryPromise);
  }
  // Attente de la résolution de toutes les promesses
  Promise.all(queries).then(
    (products) => {
      // Génération d'un identifiant de commande unique
      const orderId = uuid();
      // Envoi de la réponse avec les données de contact, les produits et l'ID de commande
      return res.status(201).json({
        contact: req.body.contact,
        products: products,
        orderId: orderId
      })
    }
  ).catch(
    (error) => {
      // En cas d'erreur lors du traitement des produits, envoi d'une erreur 500
      return res.status(500).json(new Error(error));
    }
  );
};


