import { UserModel } from '../models/user.model';
import { DatabaseUser, DomainExistingUser } from '../types/user';

export class UserMapper {
    toDatabase(user: DomainExistingUser) {
        const dbUser = { ...user };
        delete dbUser.id;
        return dbUser;
    }

    toDomain(user: UserModel): DomainExistingUser {
        const domainUser = user.toJSON() as DatabaseUser;
        delete domainUser.isDeleted;
        return domainUser;
    }
}
