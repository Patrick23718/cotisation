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
    tranche: {
      type: Number,
      required: true,
    },
    frequence: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("epargnes", EpargneSchema);
