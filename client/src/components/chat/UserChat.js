import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";

const UserChat = ({chat, user}) => {
    const { recipienUser } = useFetchRecipientUser(chat, user);

    return ( <>UserChat</>)
}

export default UserChat;