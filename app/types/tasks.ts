import type {AccountData} from "~/types/account";

interface TaskData {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    deadline?: Date | null;
    task: string | null;
    guarantor: AccountData;
    type: "maturita" | "task";
    points: number | null;
}

interface Task_Team_Solo_Table {
    idTeam: number;
    points: number | null;
    name: string | null;
    status: string;
    elaboration: string | null;
    review: string | null;
    userData: AccountData;
    isTeam: boolean;
    teamUpdatedAt: Date | null;
    reviewUpdatedAt: Date | null;
    elaborationUpdatedAt: Date | null;
}

export type {
    TaskData,
    Task_Team_Solo_Table,
}