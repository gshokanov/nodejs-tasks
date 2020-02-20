import { GroupModel } from '../models/group.model';
import { GroupMapper } from '../data-access/group.mapper';
import { Group } from '../types/group';

export class GroupService {
    constructor(
        private model: typeof GroupModel,
        private mapper: GroupMapper
    ) {}

    async findAll() {
        const result = await this.model.findAll();
        return result.map(group => this.mapper.toDomain(group));
    }

    async findById(id: number): Promise<Group | null> {
        const group = await this.model.findByPk(id);
        if (group) {
            return this.mapper.toDomain(group)
        }
        return null;
    }

    async create(group: Group): Promise<number> {
        const createdGroup = await this.model.create(group);
        return createdGroup.id;
    }

    async update(id: number, updatedGroup: Group): Promise<void> {
        await this.model.update(updatedGroup, {
            where: {
                id
            }
        });
    }

    async delete(id: number) {
        return this.model.destroy({
            where: {
                id
            },
            force: true
        });
    }
}
