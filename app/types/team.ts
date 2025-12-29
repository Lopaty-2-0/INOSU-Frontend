interface TaskTeam {
    idTeam: number;
    idTask: number;
    name: string | null;
    status: string,
    review: string | null;
    points: number | null;
    users?: number[];
    isTeam: boolean;
}

export type {
    TaskTeam
}