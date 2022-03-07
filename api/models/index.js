const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.role = require("./Role");
db.code = require("./ResetCode");

db.ROLES = ["client", "admin"];

module.exports = db;
