const mongoose = require("mongoose");

const CategorieSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categories", CategorieSchema);
