type AccountData = {
    id: string;
    name: string;
    surname: string;
    abbreviation: string | null;
    email: string;
    role: string;
    profilePicture: string;
    idClass: number[];
    createdAt: Date;
    updatedAt: Date;
}

type AccountLink = {
    href: string,
    text: string;
}

type AccountTheme = "light" | "dark" | "system";
type LocalAccountData = Omit<AccountData, "id" | "role">;

export type {
    AccountData,
    LocalAccountData,
    AccountLink,
    AccountTheme
}
