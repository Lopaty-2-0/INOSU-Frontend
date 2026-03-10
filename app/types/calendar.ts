import type {AccountData} from "~/types/account";

interface CalendarData {
    idEvent?: number | null;
    user: AccountData;
    maker: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: CalendarEventType;
}

interface CalendarDotsData {
    endDate: Date;
    type: CalendarEventType;
}

type CalendarEventType = "own" | "task" | "byOther" | "maturita";

export type {
    CalendarData,
    CalendarDotsData,
    CalendarEventType,
}