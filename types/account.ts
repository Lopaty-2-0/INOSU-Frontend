interface AccountData {
    id: string;
    name: string;
    surname: string;
    abbreviation: string | null;
    email: string;
    role: string;
    profilePicture: string;
    idClass: number | null;
    createdAt: Date;
}

interface AccountLink {
    href: string,
    text: string;
}

type AccountTheme = "light" | "dark" | "system";

export type {
    AccountData,
    AccountLink,
    AccountTheme
}
