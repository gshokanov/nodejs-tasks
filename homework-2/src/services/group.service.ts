import { Sequelize } from 'sequelize-typescript';
import { GroupModel } from '../models/group.model';
import { UserGroupModel } from '../models/user-group.model';
import { GroupMapper } from '../data-access/group.mapper';
import { Group } from '../types/group';

export class GroupService {
    constructor(
        private model: typeof GroupModel,
        private mapper: GroupMapper,
        private userGroupModel: typeof UserGroupModel
    ) {}

    async findAll() {
        const result = await this.model.findAll();
        return result.map(group => this.mapper.toDomain(group));
    }

    async findById(id: string): Promise<Group | null> {
        const group = await this.model.findByPk(id);
        if (group) {
            return this.mapper.toDomain(group)
        }
        return null;
    }

    async create(group: Group): Promise<string> {
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

    async delete(id: string) {
        return this.model.destroy({
            where: {
                id
            },
            force: true
        });
    }

    async addUsersToGroup(groupId: string, userIds: Array<string>): Promise<void> {
        const { sequelize } = this.model;
        const transaction = await sequelize?.transaction();
        if (!transaction) {
            throw new Error('Transaction could not be created');
        }
        try {
            await Promise.all(
                userIds.map(
                    userId => this.userGroupModel.create({
                        userId,
                        groupId
                    }, { transaction })
                )
            );
            await transaction.commit();
        } catch(err) {
            await transaction.rollback();
            throw err;
        }
    }
}
