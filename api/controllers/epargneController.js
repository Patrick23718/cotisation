// const config = require("../config/auth.config");
const db = require("../models");
const Epargne = db.epargne;

exports.createEpargne = (req, res) => {
  var epargne = {
    client: req.userId,
    produit: req.body.produit,
    echeance: req.body.echeance,
    frequence: req.body.frequence || "jour",
  };
  if (req.role == "admin") epargne.client = req.body.client;

  const newEpargne = new Epargne(epargne);
  newEpargne
    .save()
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getAllEpargnes = (req, res) => {
  // const id = req.userId;
  Epargne.find()
    .populate("client produit")
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

exports.getAllUserEpargnes = (req, res) => {
  const id = req.userId;
  Epargne.find({ client: id })
    .populate("client produit")
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

exports.getEpargne = (req, res) => {
  //   const nom = req.query.nom;
  Epargne.findOne({ _id: req.params.id })
    .populate("client produit")
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getUserEpargne = (req, res) => {
  //   const nom = req.query.nom;
  const id = req.userId;
  Epargne.findOne({ _id: req.params.id, client: id })
    .populate("client produit")
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.updateEpargne = (req, res) => {
  const id = req.userId;
  var update = {};
  if (req.body.tranche) update.tranche = req.body.tranche;
  if (req.body.frequence) update.frequence = req.body.frequence;
  Epargne.findByIdAndUpdate({ _id: req.params.id, client: id }, update)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.archiveEpargne = (req, res) => {
  Epargne.findByIdAndUpdate({ _id: req.params.id }, { isDelete: true })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
