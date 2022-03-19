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

    docs: [
      {
        imageURL: { type: String, required: false },
        type: {
          type: String,
          enum: ["cni", "passport"],
          default: "cni",
          required: true,
        },
        verified: { type: Boolean, default: false, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("utilisateur", userSchema);
