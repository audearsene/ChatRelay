const chatModel = require("../Models/chatModel");

//createChat
const createChat = async(req, res) => {
    const { firstId, secondId} = req.body;

    try{
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
        });

        if(chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId]
        });

        const response = await newChat.save();

        res.status(200).json(response);

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

//createChanel
const createChanel = async(req, res) => {
    const { name,firstId, secondId, thirdId} = req.body;

    try {
        const chanel = await chanelModel.findOne({ chanelname });

        if(chanel) return res.status(200).json("Ce canal existe déjà...");

        const newChanel = new chatModel({
            chanelname : name,
            members: [firstId, secondId, thirdId]
        });

        const response = await newChanel.save();

        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

//renameChanel
const renameChanel = async(req, res) => {
    const { oldName, newName } = req.body;
    
    try {
        const chanel = await chatModel.findOne({ chanelname:oldName });

        if(!chanel) return res.status(200).json("Ce canal n'existe pas...");

        chanel.chanelname.update({chanelname : oldName}, {$set: { chanelname: newName}});

        const response = await chanel.save();

        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

//joinChanel
const joinChanel = async(req, res) => {
    const { name, userId } = req.params;

    try {
        const chanel = await chatModel.findOne({
            chanelname : name,
            members: {$in: [userId]}
        });

        if(chanel) return res.status(200).json("Vous faites déjà partie de ce canal...");

        const chanel2join = await chatModel.findOne({ chanelname });

        chanel2join.members.push(userId);

        const response = await chanel2join.save();

        res.status(200).json(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

//quitChanel
const quitChanel = async(req, res) => {
    const { name, userId } = req.params;

    try {
        const chanel = await chatModel.findOne({
            chanelname : name,
            members: {$in: [userId]}
        });

        if(!chanel) return res.status(200).json("Vous ne faites déjà plus partie de ce canal...");

        chanel.members.pull(userId);

        const response = await chanel.save();

        res.status(200).json(response);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

//getUsersChats
const findUserChats = async(req, res) => {
    const userId = req.params.userId;

    try{
        const chats = await chatModel.find({
            members: {$in: [userId]}
        });

        res.status(200).json(chats);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

//findChat
const findChat = async(req, res) => {
    const {firstId, secondId} = req.params;

    try{
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
        });

        res.status(200).json(chat);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

//deleteChat
const deleteChat = async(req, res) => {
    const chatName = req.body;

    try{
        chatModel.deleteOne(chatName);

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createChat, findUserChats, findChat, deleteChat, createChanel, joinChanel, quitChanel, renameChanel };
