const mongoose = require("mongoose");

const userRequestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
    },
    requestMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserRequest = mongoose.model("UserRequest", userRequestSchema);
module.exports = UserRequest;
