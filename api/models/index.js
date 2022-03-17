const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.role = require("./Role");
db.code = require("./ResetCode");
db.categorie = require("./Categorie");
db.produit = require("./Produit");
db.epargne = require("./Epargne");
db.versement = require("./Versement");

db.ROLES = ["client", "admin"];

module.exports = db;
