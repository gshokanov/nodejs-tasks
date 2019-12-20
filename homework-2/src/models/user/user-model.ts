import * as uuid from 'uuid/v1';
import { User } from './interfaces/user';


export class UserModel {
    private collection: Map<string, User> = new Map();

    private stripMetadata(user: User): User {
        // Leaking isDeleted to client is useless
        return {
            ...user,
            isDeleted: undefined
        } as unknown as User;
    }

    getById(id: string): User | null {
        const user = this.collection.get(id);
        if (!user || user.isDeleted) {
            return null;
        }
        return this.stripMetadata(user);
    }

    getAutoSuggestedUsers(loginSubstring: string, limit: number): Array<User> {
        return [...this.collection.values()]
            .reduce((acc, user) => {
                if (!user.isDeleted && user.login.startsWith(loginSubstring)) {
                    const safeUser = this.stripMetadata(user);
                    acc.push(safeUser);
                }
                return acc;
            }, [] as Array<User>)
            .sort((a, b) => a.login.localeCompare(b.login))
            .slice(0, limit);
    }

    create(user: User): string {
        const id = uuid();
        user.id = id;
        user.isDeleted = false;
        this.collection.set(id, user);
        return id;
    }

    update(id: string, user: Partial<User>): boolean {
        const savedUser = this.getById(id);
        if (!savedUser || savedUser.isDeleted) {
            return false;
        }
        Object.assign(savedUser, user);
        return true;
    }

    delete(id: string): boolean {
        const user = this.getById(id);
        if (user && !user.isDeleted) {
            user.isDeleted = true;
            return true;
        } else {
            return false;
        }
    }
}
