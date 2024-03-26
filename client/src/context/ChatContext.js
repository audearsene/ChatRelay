import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [ userChats, setUserChats] = useState(null);
    const [ isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [ userChatsError, setUserChatsError] = useState(null);
    const [ potentialChats, setPotentialChats ] = useState([]);
    const [ currentChat, setCurrentChat ] = useState(null);
    const [ messages, setMessages ] = useState(null);
    const [ isMessagesLoading, setIsMessagesLoading ] = useState(false);
    const [ messagesError, setMessagesError ] = useState(null);
    const [ socket, setSocket ] = useState(null);
    const [ onlineUsers, setOnlineUsers ] = useState([]);

    console.log("onlineUsers", onlineUsers);

    useEffect(() => {
        const newSocket = io("http://localhost:3003");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    useEffect(() => {
        if(socket === null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) =>{
            setOnlineUsers(res);
        });
        
        return () => {
            socket.off("getOnlineUsers");
        }
    }, [socket]);
    
    useEffect(() => {

        const getUsers = async() => {
            if(user && user._id){

                const response = await getRequest(`${baseUrl}/users`);

                if(response.error){
                    return console.log("Erreur de récupérations des utilisateurs...", response);
                }

                const pChats = response.filter((u) => {
                    let isChatCreated = false;
                    if(user._id === u._id){
                        return false;
                    };

                    if(userChats){
                        isChatCreated = userChats?.some((chat) => {
                            return chat.members[0] === u._id || chat.members[1] === u._id;
                        })
                    };

                    return!isChatCreated;

                });

                setPotentialChats(pChats);
            }
        };

        getUsers();

    }, [user]);

    useEffect(() => {

        const getMessages = async() => {

                setIsMessagesLoading(true);
                setMessagesError(null);

                const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

                setIsMessagesLoading(false);

                if(response.error){
                    return setMessagesError(response);
                }

                setMessages(response);
        }

        getMessages();

    }, [currentChat]);

    useEffect(() => {
        const getUserChats = async() => {
            if(user?._id){

                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

                setIsUserChatsLoading(false);

                if(response.error){
                    return setUserChatsError(response);
                }

                setUserChats(response);
            }
        };

        getUserChats();
    }, [user]);

    const updateCurrentChat = useCallback(async(chat) => {
        setCurrentChat(chat);

    }, []);

    const createChat = useCallback(async(firstId, secondId) => {
        const response = await getRequest(`${baseUrl}/chats/${user._id}`, JSON.stringify({firstId, secondId}));

        if(response.error){
            return console.log("erreur dans la création du chat", response)
        }

        setUserChats((prev) => [...prev, response]);
    }, []);

    return <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats, 
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError, 
        onlineUsers
    }}>{children}</ChatContext.Provider>
}