// const config = require("../config/auth.config");
const db = require("../models");
const Produit = db.produit;

exports.createProduit = (req, res) => {
  var prod = {
    nom: req.body.nom,
    prix: req.body.prix,
    category: req.body.category,
  };
  if (req.body.description) prod.description = req.body.description;
  const newProd = new Produit(prod);
  newProd
    .save()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getAllProduits = (req, res) => {
  //   const nom = req.query.nom;
  Produit.find({ isDelete: false })
    .populate("category")
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getAllProduitsFromCategory = (req, res) => {
  //   const nom = req.query.nom;
  Produit.find({ isDelete: false, category: req.params.cid })
    .populate("category")
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getProduit = (req, res) => {
  //   const nom = req.query.nom;
  Produit.findOne({ isDelete: false, _id: req.params.id })
    .populate("category")
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.updateProduit = (req, res) => {
  var update = {};

  if (req.body.prix) update.prix = req.body.prix;
  if (req.body.category) update.category = req.body.category;
  if (req.body.nom) update.nom = req.body.nom;
  if (req.body.description) update.description = req.body.description;
  Produit.findByIdAndUpdate({ _id: req.params.id }, update)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.archiveProduit = (req, res) => {
  Produit.findByIdAndUpdate({ _id: req.params.id }, { isDelete: true })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
