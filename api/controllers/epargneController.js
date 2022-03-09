// const config = require("../config/auth.config");
const db = require("../models");
const Epargne = db.epargne;

exports.createEpargne = (req, res) => {
  const epargne = {
    client: req.body.client,
    produit: req.body.produit,
    tranche: req.body.tranche,
    frequence: req.body.frequence,
  };
  const newEpargne = new Epargne(epargne);
  newEpargne
    .save()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getAllEpargnes = (req, res) => {
  // const id = req.userId;
  Epargne.find()
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
