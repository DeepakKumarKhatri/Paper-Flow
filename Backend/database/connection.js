const mongoose = require("mongoose");

module.exports.connectMongoDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("MongoDb connected successfully"));
};
