import { GroupModel } from '../models/group.model';
import { Group } from '../types/group';

export class GroupMapper {
    toDatabase(group: Group): Group {
        const databaseGroup = { ...group };
        delete databaseGroup.id;
        return group;
    }

    toDomain(group: GroupModel): Group {
        return group.toJSON() as Group;
    }
}
