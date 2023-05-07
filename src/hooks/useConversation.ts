import { useParams } from 'next/navigation'; 
import { useMemo } from 'react';

const useConversation = () => {
   const params = useParams(); 


   const conversationId = useMemo(() => {
    if(!params?.conversationId) {
        return ''; 
    }

    return params.conversationId as string; 

   }, [params?.conversationId]); 

    // double exclamation turn a string to boolean
   const isOpen = useMemo(() => !!conversationId, [conversationId]); 

   return useMemo(() => ({
    isOpen,
    conversationId,

   }), [isOpen, conversationId])
 

}

export default useConversation; 