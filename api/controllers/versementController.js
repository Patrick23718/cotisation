const { versement } = require("../models");
const db = require("../models");
const Versement = db.versement;
const Epargne = db.epargne;

exports.createVersement = (req, res) => {
  console.log(req.body.epargne);
  Epargne.findById(req.body.epargne)
    .populate("produit")
    .exec()
    .then(async (result) => {
      if (!result || result == null) {
        return res.status(404).json({ message: "L'epargne n'existe pas" });
      }
      const uid = req.role === "admin" ? result.client : req.userId;

      if (result.status !== "progress")
        return res.status(400).json({ message: "L'epargne est complete" });

      // if (result.produit.prix value.montant + ) return;

      if (result.client != uid)
        return res.status(400).json({ message: "Utilisateur invalide" });

      // console.log(result.produit.prix);
      var value = await Versement.aggregate([
        { $match: { epargne: result._id } },
        { $group: { _id: null, montant: { $sum: "$montant" } } },
      ]);
      var reste = result.produit.prix;

      if (value.length > 0) {
        value = value[0];
        console.log(value);
        reste = result.produit.prix - value.montant;
      }

      // console.log(reste);

      if (reste <= req.body.montant) {
        req.body.montant = reste;
        await Epargne.findByIdAndUpdate(
          { _id: result._id },
          { status: "finished" }
        );
      }

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

exports.getUserVersement = (req, res) => {
  Epargne.findOne({
    _id: req.params.Eid,
    client: req.role === "admin" ? req.query.userId : req.userId,
  })
    .populate("produit")
    .exec()
    .then((result) => {
      if (result) {
        Versement.find({ epargne: result._id })
          .sort({ createdAt: -1 })
          .exec()
          .then((docs) => {
            mont = 0;
            for (i = 0; i < docs.length; i++) {
              mont += docs[i].montant;
            }
            return res
              .status(200)
              .send({ versements: docs, payer: mont, epargne: result });
          });
      } else {
        return res.status(404).json({ message: "Aucune epargne trouvée" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Erreur de serveur", error: err });
    });
};
