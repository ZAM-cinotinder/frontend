import { Message } from "../types/Message";

export interface Chat {
    lastMessage: Message;
    isSeen: boolean;
    otherDogId: string;
    otherUserId: string;
}

export type Chats = Record<string, Chat>;


export interface ChatScreenProps {
    chatId: string;
    otherUserId: string;
}
