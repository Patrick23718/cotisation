const { versement } = require("../models");
const db = require("../models");
const Versement = db.versement;
const Epargne = db.epargne;

exports.createVersement = (req, res) => {
  Epargne.findById(req.body.epargne)
    .exec()
    .then((result) => {
      if (!result || result == null)
        return res.status(404).json({ message: "L'epargne n'existe pas" });

      var uid = req.userId;

      if (req.role === "admin") uid = result.client;

      if (result.status !== "progress")
        return res.status(400).json({ message: "L'epargne est complete" });

      if (result.client != uid)
        return res.status(400).json({ message: "Utilisateur invalide" });

      const vers = new Versement({
        epargne: req.body.epargne,
        montant: req.body.montant,
        mode: req.body.mode,
      });

      vers
        .save()
        .then((newvers) => {
          res.status(201).json(newvers);
        })
        .catch((err) => {
          res.status(500).json({ message: "Erreur de serveur", error: err });
        });
    });
};
