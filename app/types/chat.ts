import type {AccountData} from "~/types/account";

interface ConversationData {
    idConversation: number;
    user?: AccountData | null;
    task?: {
        id: number;
        name: string,
        startDate: Date,
        endDate: Date,
        task: string,
        deadline: Date,
        guarantor: AccountData,
    } | null;
    isArchived: boolean;
}

interface ConversationMessageData {
    idMessage: number;
    message: string;
    createdAt: string;
    replyToMessage?: ConversationMessageData;
    sender: AccountData;
}

export type {
    ConversationData,
    ConversationMessageData,
}
