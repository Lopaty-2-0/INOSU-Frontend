interface TaskTeam {
    idTeam: number;
    idTask: number;
    name: string | null;
    status: "",
    review: string | null;
    points: number | null;
    users?: number[];
}

export type {
    TaskTeam
}