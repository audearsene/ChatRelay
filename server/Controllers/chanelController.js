const chanelModel = require ("../Models/chanelModel");

const createChanel = async (req, res) => {
    try{
        const {name} = req.body;

        let chanel = await chanelModel.findOne({name});

        if(chanel) return res.status(400).json("Ce canal exist déjà...");

        if(!name) return res.status(400).json("Il faut un nom pour ce canal..");

        chanel = new chanelModel({name});

        await chanel.save();

        res.status(200).json({_id: chanel._id, name});

    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getChanels = async (req, res) => {
    try {
        const chanels = await chanelModel.find();

        res.status(200).json(chanels);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {createChanel, getChanels};