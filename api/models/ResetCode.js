const mongoose = require("mongoose");

const ResetCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      minlength: 4,
    },

    validity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("resetpasswords", ResetCodeSchema);
