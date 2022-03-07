const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      max: 255,
    },

    prenom: {
      type: String,
      required: true,
      max: 255,
    },

    role: {
      type: String,
      enum: ["client", "admin"],
      required: true,
      default: "client",
    },

    adresse: {
      type: String,
      required: true,
    },

    numero: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 20,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    imageURL: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("utilisateur", userSchema);
