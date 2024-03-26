const express = require("express");
const { createChat, findUserChats, findChat, deleteChat } = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:fistId/:secondId", findChat);
router.post( "/delete", deleteChat);

module.exports = router;