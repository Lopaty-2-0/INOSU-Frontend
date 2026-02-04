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

export type {
    MaturitaData,
    TopicData
}