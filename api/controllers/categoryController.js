// const config = require("../config/auth.config");
const db = require("../models");
const Category = db.categorie;

exports.createCategory = (req, res) => {
  var cat = {
    nom: req.body.nom,
  };
  if (req.body.description) cat.description = req.body.description;
  const newCat = new Category(cat);
  newCat
    .save()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getAllCategories = (req, res) => {
  //   const nom = req.query.nom;
  Category.find({ isDelete: false })
    .exec()
    .then((result) => {
      return res.status(200).json({
        count: result.length,
        result,
      });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getCategory = (req, res) => {
  //   const nom = req.query.nom;
  Category.findOne({ isDelete: false, _id: req.params.id })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.updateCategory = (req, res) => {
  var update = {};
  if (req.body.nom) update.nom = req.body.nom;
  if (req.body.description) update.description = req.body.description;
  Category.findByIdAndUpdate({ _id: req.params.id }, update)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.archiveCategory = (req, res) => {
  Category.findByIdAndUpdate({ _id: req.params.id }, { isDelete: true })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
