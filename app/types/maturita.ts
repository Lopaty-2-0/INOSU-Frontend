import type {AccountData} from "~/types/account";

interface MaturitaData {
    id: number;
    grade: string;
    maxPoints: number;
    startDate: Date;
    endDate: Date;
    evaluators: number[];
}

interface TopicData {
    id: number;
    name: string;
}

interface MaturitaTaskData {
    id: number;
    idTeam: number;
    name: string;
    startDate: Date;
    endDate: Date;
    deadline: Date;
    points: number;
    maxPoints: number;
    task: string;
    topic: string;
    objector: AccountData;
    userData: AccountData | null;
    guarantor: AccountData | null;
    status: "pending" | "approved" | "rejected";
}

export type {
    MaturitaData,
    TopicData,
    MaturitaTaskData,
}