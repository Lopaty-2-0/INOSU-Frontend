interface TaskData {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    task: string;
    guarantor: number;
    approve: boolean;
}

interface User_Task {
    idUser: number;
    idTask: number;
    elaboration: string;
    review: string;
    status: "pending" | "approved" | "rejected" | "waiting";
}

interface Task_Class {
    idTask: number;
    idClass: number;
}

export type {
    TaskData,
    User_Task,
    Task_Class
}