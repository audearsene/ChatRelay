const mongoose = require("mongoose");

const chanelSchema = new mongoose.Schema ({
    name: {type: String, required: true, minlenght: 3, maxlength: 50, unique: true},
    creator: {type: String}

})
const chanelModel = mongoose.model("Chanel", chanelSchema);

module.exports = chanelModel;