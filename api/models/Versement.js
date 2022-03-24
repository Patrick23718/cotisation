const mongoose = require("mongoose");
const Epargne = require("./Epargne");

const VersementSchema = new mongoose.Schema(
  {
    epargne: {
      type: mongoose.Types.ObjectId,
      ref: "epargnes",
      required: true,
    },

    montant: {
      type: Number,
      required: true,
    },

    mode: {
      type: String,
      enum: ["agence", "mobile"],
      required: true,
      default: "mobile",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("versements", VersementSchema);
