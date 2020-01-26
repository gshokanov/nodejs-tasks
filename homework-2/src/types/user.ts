interface User {
    age: number;
    login: string;
    password: string;
}

export type DomainNewUser = User;

export interface DomainExistingUser extends User {
    id: string;
}

export interface DatabaseUser extends User {
    id: string;
    isDeleted: boolean;
}
