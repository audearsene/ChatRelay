import React, {useContext, useEffect, useState} from 'react';
import './chat.css';
import { AuthContext } from "../context/AuthContext";
import io from 'socket.io-client';
import { ChatContext } from '../context/ChatContext';
import UserChat from '../components/chat/UserChat';
import ChatBox from '../components/chat/ChatBox';
import moment from 'moment';
import { useFetchRecipientUser } from "../hooks/useFetchRecipient";

const Chat = () => {
    const {user} = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const socket = io('http://localhost:3003');
    const { userChats, isUserChatsLoading, userChatsError} = useContext(ChatContext); //new

    console.log("messageInput", messageInput);
    console.log("messages", messages)

    useEffect(() => {
        // Écouter l'événement 'chat message' du serveur
        const handleChatMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };

        // Ajouter l'écouteur pour 'chat message'
        socket.on('chat message', handleChatMessage);

        // Nettoyer les écouteurs lors du démontage du composant
        return () => {
            socket.off('chat message', handleChatMessage);
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        console.log('SendMessage function called');
        socket.emit('chat message', messageInput);
        setMessageInput('');
    };

    return (
        <>
            <div className="chat-container">
                <header className="chat-header">
                    <h1><i className="fas fa-smile"></i> Serveur de Discussion</h1>
                    <a id="leave-btn" className="btn">Quitter le serveur</a>
                </header>
                <main className="chat-main">
                    <div className="chat-sidebar">
                        <h3><i className="fas fa-comments"></i> Discussion</h3>
                        {userChats && userChats.length > 0 && (<ul id="room-name">{userChats.map((chat, index) => {
                            <li key={index}>{chat.recipientUser?.name}
                            </li>
                        })}</ul>)} 
                        <h3><i className="fas fa-users"></i> Utilisateurs</h3>
                        <ul id="users"></ul>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} gap={1}
                                 style={{padding: "10px", backgroundColor: "#C0BCBCFF", marginBottom: "3px"}}>
                                <div>
                                    De la part de {user.name}
                                </div>
                                <span>{msg}</span>
                                <span className="message-footer" >{moment(msg.createdAt).format('h:mm a')}</span>
                            </div>
                        ))}
                    </div>  
                </main>
                <div className="chat-form-container" id="messages">
                    <form id="chat-form" onSubmit={sendMessage}>
                        <input
                            id="msg"
                            className="message-input"
                            type="text"
                            placeholder="Veuillez saisir un message"
                            autoComplete="off"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button
                            className="btn btn-wide"
                            style={{backgroundColor: "#C0BCBCFF", color: 'black'}}
                            type="submit"
                        >
                            <i className="fas fa-paper-plane"></i> Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chat;
