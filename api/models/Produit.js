const mongoose = require("mongoose");

const ProduitSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },
    prix: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },

    description: {
      type: String,
      required: false,
    },
    img: [{ type: String, required: false }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("produits", ProduitSchema);
