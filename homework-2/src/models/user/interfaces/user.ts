export interface BaseUser {
    login: string;
    password: string;
    age: number;
}

export interface ClientUser extends BaseUser {
    id: string;
}

export interface StoredUser extends ClientUser {
    isDeleted: boolean;
}
