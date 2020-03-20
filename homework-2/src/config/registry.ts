import { GroupModel } from '../models/group.model';
import { UserModel } from '../models/user.model';
import { UserGroupModel } from '../models/user-group.model';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';
import { GroupMapper } from '../data-access/group.mapper';
import { UserMapper } from '../data-access/user.mapper';

interface Constructable<T> {
    new(...args: Array<any>): T;
    name: string;
}

export class RegistryError extends Error {}

export class Registry {
    private map = new Map();

    provide<T>(ctor: Constructable<T>, instance: T): void {
        this.map.set(ctor, instance);
    }

    resolve<T>(ctor: Constructable<T>): T {
        const resolved = this.map.get(ctor);
        if (typeof resolved === 'undefined') {
            throw new RegistryError(`Could not resolve instance for ${ctor.name}`);
        }
        return resolved;
    }
}

export const globalRegistry = new Registry();
globalRegistry.provide(UserService, new UserService(UserModel, new UserMapper()));
globalRegistry.provide(GroupService, new GroupService(GroupModel, new GroupMapper(), UserGroupModel));
