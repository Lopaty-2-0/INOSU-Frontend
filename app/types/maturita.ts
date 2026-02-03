import type {AccountData} from "~/types/account";

interface MaturitaData {
    id: number;
    grade: string;
    maxPoints: number;
    startDate: Date;
    endDate: Date;
    evaluators: AccountData[];
}

export type {
    MaturitaData
}