const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
//const { use } = require("../Routes/userRoute");

const users = [];

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({_id}, jwtkey);
}

const registerUser = async (req, res) => {

    try{ 
        //res.send("Register");
        const {name, password} = req.body;

        let user = await userModel.findOne({name});

        if (user) return res.status(400).json("Cet utilisateur existe déjà...");

        if (!name || !password) {return res.status(400).json("Veuillez remplir tous les champs")};

        //if(!validator.isEmail(email)) return res.status(400).json("Email is invalid...");

        if(!(validator.isStrongPassword(password))){ return res.status(400).json("Il faut un mot de passe solide(1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial)...")};

        user = new userModel({name, password})

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password,salt);
        await user.save();
        
        const token = createToken(user._id);

        users.push(user);

        res.status(200).json({_id: user._id, name, token});

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const loginUser = async(req, res) => {
    const {name, password} = req.body;

    try {
        let user = await userModel.findOne({name});

        if(!user) return res.status(400).json("Nom ou mot de passe invalide");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).json("Nom ou mot de passe invalide");

        const token = createToken(user._id);

        res.status(200).json({_id: user._id, name, token});

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

const findUser = async(req, res) => {
    const userId = req.params.userId;

    try{
        const user = await userModel.findById(userId);

        res.status(200).json(user);

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

const getUsers = async(req, res) => {

    try{
        const users = await userModel.find();

        res.status(200).json(users);

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.chanelname === room);
}

module.exports = { registerUser, loginUser, findUser, getUsers, userLeave, getRoomUsers };