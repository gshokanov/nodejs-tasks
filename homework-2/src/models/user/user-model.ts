import * as uuid from 'uuid/v1';
import { BaseUser, ClientUser, StoredUser } from './interfaces/user';


export class UserModel {
    private collection: Map<string, StoredUser> = new Map();

    private stripMetadata(user: StoredUser): ClientUser {
        // Copy user object to prevent accidental modification and omit unnecessary data
        return (Object.keys(user) as Array<keyof StoredUser>).reduce<ClientUser>((acc, key) => {
            if (key !== 'isDeleted') {
                // TS cannot determine that keys on the left and right side of assignment are
                // always the same. Typecast to any gets around this
                (acc as any)[key] = user[key];
            }
            return acc;
        }, {} as ClientUser);
    }

    getById(id: string): ClientUser | null {
        const user = this.collection.get(id);
        if (!user || user.isDeleted) {
            return null;
        }
        return this.stripMetadata(user);
    }

    getAutoSuggestedUsers(loginSubstring: string, limit: number): Array<ClientUser> {
        return [...this.collection.values()]
            .reduce((acc, user) => {
                if (!user.isDeleted && user.login.startsWith(loginSubstring)) {
                    const safeUser = this.stripMetadata(user);
                    acc.push(safeUser);
                }
                return acc;
            }, [] as Array<ClientUser>)
            .sort((a, b) => a.login.localeCompare(b.login))
            .slice(0, limit);
    }

    create(user: BaseUser): string {
        const id = uuid();
        const storedUser: StoredUser = {
            ...user,
            id,
            isDeleted: false
        };
        this.collection.set(id, storedUser);
        return id;
    }

    update(id: string, user: ClientUser): boolean {
        const savedUser = this.collection.get(id);
        if (!savedUser || savedUser.isDeleted) {
            return false;
        }
        Object.assign(savedUser, user);
        return true;
    }

    delete(id: string): boolean {
        const user = this.collection.get(id);
        if (user && !user.isDeleted) {
            user.isDeleted = true;
            return true;
        }
        return false;
    }
}
