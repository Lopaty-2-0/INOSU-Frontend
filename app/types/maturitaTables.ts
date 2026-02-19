import type {AccountData} from "~/types/account";
import type {TopicData} from "~/types/maturita";

interface MaturitaTableData {
    user: AccountData;
    topic: TopicData;
    variant: string;
    task: string;
    guarantor: AccountData | null;
    objector: AccountData | null;
}

export type {
    MaturitaTableData,
}