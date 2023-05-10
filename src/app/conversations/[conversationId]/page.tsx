import getConversationById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages";
import EmptyState from "@/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
    conversationId?: string; 
}

const ConversationPage = async ({params}: {params: IParams}) => {
    const { conversationId } = params; 

    const conversation = await getConversationById(conversationId as string)
  
    const messages = await getMessages(conversationId as string)
   

    if(!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />

                </div>

            </div>
        )
    }
    return(
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />

            </div>

        </div>
    )
}

export default ConversationPage; 