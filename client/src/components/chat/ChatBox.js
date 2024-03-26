import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { ChatContext } from "../../context/ChatContext";
import useFetchRecipientUser from "../../hooks/useFetchRecipient";
import moment from "moment";

const ChatBox = () => {
    const {user} = useContext(AuthContext);
    const {currentChat, messages, isMessagesLoading} = useContext(ChatContext);
    const {recipientUser} = useFetchRecipientUser(currentChat, user);

    if(!recipientUser) return (
        <p style={{textAlign: "center", width: "100%"}}>Vous n'avez pas encore sélectionner de conversations...</p>
    )

    if(isMessagesLoading) return (
        <p style={{textAlign: "center", width: "100%"}}>Récupération des messages...</p>
    )

    return (<div className="messages">
        {messages && messages.map((msg, index) => (
            <div key={index} 
                style={{padding: "10px", backgroundColor: "#C0BCBCFF", marginBottom: "3px"}}>
                <div>
                    De la part de {user.name}
                </div>
                <span>{msg.text}</span>
                <span className="message-footer">{moment(msg.createdAt).calendar()}</span>
            </div>
        ))}
    </div>
    );
};

export default ChatBox;