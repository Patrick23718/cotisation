const mongoose = require("mongoose");

const EpargneSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Types.ObjectId,
      ref: "utilisateur",
      required: true,
    },

    produit: {
      type: mongoose.Types.ObjectId,
      ref: "produits",
      required: true,
    },

    echeance: {
      type: Date,
      required: true,
    },

    montant: {
      type: Number,
      required: false,
    },

    status: {
      type: String,
      enum: ["progress", "finished", "pay"],
      default: "progress",
      required: true,
    },

    frequence: {
      type: String,
      enum: ["jour", "semaine", "mois"],
      default: "jour",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("epargnes", EpargneSchema);
