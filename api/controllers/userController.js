const db = require("../models");
const User = db.user;
const Code = db.code;
const Role = db.role;
const axios = require("axios");

const ROLES = db.ROLES;
const mongoose = require("mongoose");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { param } = require("express/lib/request");

exports.signup = (req, res) => {
  if (req.body.password != req.body.confirmation_password) {
    res
      .status(400)
      .send({ message: "The confirmation password doesn't match" });
  }

  const user = new User({
    nom: req.body.nom,
    prenom: req.body.prenom,
    adresse: req.body.adresse,
    role: req.body.role || "client",
    numero: req.body.numero,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    user.save(async (err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      return res.send({ message: "User was registered successfully!" });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    numero: req.body.numero,
  })
    // .populate("role", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res
          .status(404)
          .send({ message: "Nom d'utilisateur ou mot de passe incorrect." });
      }

      // if (!user.status) {
      //   return res.status(400).send({
      //     message: "Votre compte n'a pas encore été.",
      //   });
      // }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(400).send({
          accessToken: null,
          message: "Nom d'utilisateur ou mot de passe incorrect.",
        });
      }
      var token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.SECRET,
        {
          expiresIn: 86400, //86400 24 hours
        }
      );

      res.status(200).send({
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        numero: user.numero,
        role: user.role,
        imageURL: user.imageURL,
        accessToken: token,
      });
    });
};

exports.logout = (req, res) => {
  return res.status(200).send({ message: "logout sucess" });
};

exports.getCurrentUser = (req, res) => {
  User.findById(req.userId)
    .select("_id nom prenom imageURL role adresse numero docs")
    // .populate("role", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      } else {
        res.status(200).send(user);
      }
    });
};

exports.getUser = (req, res) => {
  User.findById(req.params.uid)
    .select("_id nom prenom imageURL role adresse numero docs")
    // .populate("role", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      } else {
        res.status(200).send(user);
      }
    });
};

exports.changePassword = (req, res) => {
  User.findById(req.userId)
    .exec()
    .then((user) => {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(400).send({
          message: "Ancien mot de passe incorrect.",
        });
      }
      let userData = {};
      userData.password = bcrypt.hashSync(req.body.newpassword, 8);
      console.log(req.userId);
      User.updateOne({ _id: req.userId }, { $set: userData })
        .exec()
        .then((resultat) => {
          if (!resultat)
            return res.status(404).json({
              message: "Oups!! aucune information pour l'identifiant fourni",
            });
          res.status(200).json({
            message: "Mise à jour reussie",
            doc: resultat,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            message: "Oups!! une erreur est survenue",
            error: err,
          });
        });
    });
};

exports.updateUser = (req, res) => {
  let userData = {};

  if (req.body.nom) userData.nom = req.body.nom;
  if (req.body.prenom) userData.prenom = req.body.prenom;
  if (req.body.adresse) userData.adresse = req.body.adresse;

  //   if (req.body._id !== req.userId) {
  //     return res.status(400).json({
  //       message: "Vous n'avez pas le droit de modifier un autre utilisateur",
  //     });
  //   }
  User.update({ _id: req.userId }, { $set: userData })
    .exec()
    .then((resultat) => {
      if (!resultat)
        return res.status(404).json({
          message: "Oups!! aucune information pour l'identifiant fourni",
        });
      res.status(200).json({
        message: "Mise à jour reussie",
        doc: resultat,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Oups!! une erreur est survenue",
        error: err,
      });
    });
};

exports.updateUserImage = (req, res) => {
  let userData = {};

  userData.imageURL = req.file.path;

  User.update({ _id: req.userId }, { $set: userData })
    .exec()
    .then((resultat) => {
      if (!resultat)
        return res.status(404).json({
          message: "Oups!! aucune information pour l'identifiant fourni",
        });
      res.status(200).json({
        message: "Mise à jour reussie",
        doc: resultat,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Oups!! une erreur est survenue sur le serveur",
        error: err,
      });
    });
};

exports.updateUserCNIImage = (req, res) => {
  let userData = {
    imageURL: req.file.path,
    type: req.body.type || "cni",
    verified: false,
  };

  User.update({ _id: req.userId }, { $push: { docs: userData } })
    .exec()
    .then((resultat) => {
      if (!resultat)
        return res.status(404).json({
          message: "Oups!! aucune information pour l'identifiant fourni",
        });
      res.status(200).json({
        message: "Mise à jour reussie",
        doc: resultat,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Oups!! une erreur est survenue sur le serveur",
        error: err,
      });
    });
};

exports.updateUserRemoveCNIImage = (req, res) => {
  User.update(
    { _id: req.userId },
    { $pull: { docs: { _id: req.params.id, verified: false } } }
  )
    .exec()
    .then((resultat) => {
      if (!resultat)
        return res.status(404).json({
          message: "Oups!! aucune information pour l'identifiant fourni",
        });
      res.status(200).json({
        message: "Mise à jour reussie",
        doc: resultat,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Oups!! une erreur est survenue sur le serveur",
        error: err,
      });
    });
};

exports.updateStatus = (req, res) => {
  const status = req.body.status;
  let userData = {};

  userData.status = status;

  User.update({ _id: req.params.uid }, { $set: userData })
    .exec()
    .then((resultat) => {
      if (!resultat)
        return res.status(404).json({
          message: "Oups!! aucune information pour l'identifiant fourni",
        });
      res.status(200).json({
        message: "Mise à jour reussie",
        doc: resultat,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Oups!! une erreur est survenue sur le serveur",
        error: err,
      });
    });
};

exports.resetPassword = (req, res) => {
  Code.findOne({ code: req.body.code })
    // .populate("user")
    .exec()
    .then((result) => {
      if (result) {
        const date = new Date(result.createdAt).getTime();
        const futureDate = new Date(
          date + result.validity * 60000
        ).toUTCString();
        const todayDate = new Date().toUTCString();
        if (todayDate < futureDate) {
          User.findOneAndUpdate(
            { _id: result.user },
            { password: bcrypt.hashSync(req.body.password, 8) }
          )
            .then(() => {
              Code.remove({ _id: result._id }).then(() => {
                return res
                  .status(200)
                  .send({ message: "Mot de passe mis a jour" });
              });
            })
            .catch((err) => {
              return res.status(500).send({
                message: "Erreur lors de la mise a jour du mot de passe",
                error: err,
              });
            });
        } else {
          Code.remove({ _id: result._id }).then((test) => {
            return res.status(200).send("Sup");
          });
        }
      } else {
        res
          .status(400)
          .send({ message: "Impossible de trouver le code demandé" });
      }
    });
};

exports.initPasswordReset = (req, res) => {
  User.findOne({
    numero: req.body.numero,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // const code = codegenerator();

    // const newCode = new Code({

    //   code: code,
    // });

    // newCode.save();
    if (user) {
      const codevalue = codegenerator();
      const newCode = new Code({
        user: user._id,
        code: codevalue,
      });
      newCode
        .save()
        .then((result) => {
          const msg = `Cher(e) ${user.prenom} ${user.nom}\nvotre code est: ${result.code}`;
          const baseURL = `${process.env.SMS_API_HOST}?login=${process.env.SMS_API_LOGIN}&password=${process.env.SMS_API_PASSWORD}&sender_id=${process.env.SMS_API_SENDER_ID}&destinataire=${user.numero}&message=${msg}
      `;
          axios.get(baseURL);
          // .then((rest) => {
          //   console.log(rest);
          // })
          // .catch((error) => {
          //   console.log({
          //     message: "Opps",
          //     error: error,
          //   });
          //   // res.status(400).send(error);
          // });
          res.status(201).json({
            message: "Vous allez recevoir un message avec votre code",
            result,
          });
        })
        .catch((err) => {
          //   console.log(err);
          res.status(500).json({
            error: "cool",
          });
        });
      console.log(user);
    } else {
      return res.status(500).send({ message: "faux" });
    }
  });
};

function codegenerator() {
  var code = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 4; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  console.log(test(code));
  for (var i = 0; test(code); i++) return code;
}

function test(code) {
  return Code.findOne({ code });
}

exports.getAllUsers = (req, res) => {
  User.find({
    $or: [
      { nom: { $regex: new RegExp(req.query.s, "i") } },
      { prenom: { $regex: new RegExp(req.query.s, "i") } },
      { adresse: { $regex: new RegExp(req.query.s, "i") } },
      { numero: { $regex: new RegExp(req.query.s, "i") } },
    ],
  })
    .select("nom prenom role adresse numero imageURL createdAt")
    .sort({ createdAt: 1 })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    });
};
