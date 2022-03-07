const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  nom: {
    type: String,
    default: "client",
    required: true,
  },
});

module.exports = mongoose.model("roles", RoleSchema);
