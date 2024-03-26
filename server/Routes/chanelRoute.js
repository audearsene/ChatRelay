const express = require("express");

const { createChanel, deleteChat, joinChanel, quitChanel, renameChanel } = require("../Controllers/chatController");

const router = express.Router();

router.post("/create", createChanel);
router.post("/delete", deleteChat);
router.get("/join/:chanelId", joinChanel);
router.get("/quit/:userId/:name", quitChanel);
router.post( "/rename", renameChanel);

module.exports = router;