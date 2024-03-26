const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlenght: 3, maxlength: 50},
    password: {type: String, required: true, minlenght: 3, maxlength: 1024}
},
{
    timestamps: true,
}
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;