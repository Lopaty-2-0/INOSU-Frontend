interface MaturitaData {
    id: number;
    grade: string;
    maxPoints: number;
    startDate: Date;
    endDate: Date;
    evaluators: number[];
}

export type {
    MaturitaData
}