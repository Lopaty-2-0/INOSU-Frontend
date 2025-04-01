interface AccountData {
    id: string;
    name: string;
    surname: string;
    abbreviation: string;
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

type AccountTheme = "light" | "dark";

export type {
    AccountData,
    AccountLink,
    AccountTheme
}
