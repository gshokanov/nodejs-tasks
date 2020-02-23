import { Op } from 'sequelize';
import { UserModel } from '../models/user.model';
import { UserMapper } from '../data-access/user.mapper';
import { log } from '../decorators/log';
import { DomainExistingUser } from '../types/user';

export class UserService {
    constructor(
        private model: typeof UserModel,
        private mapper: UserMapper
    ) {}

    private async findByIdWithoutMapping(id: string): Promise<UserModel | null> {
        const user = await this.model.findByPk(id);
        if (!user || user.isDeleted) {
            return null;
        }
        return user;
    }

    @log()
    async autosuggestUsers(loginSubstring: string, limit: number): Promise<Array<DomainExistingUser>> {
        const result = await this.model.findAll({
            limit,
            where: {
                login: {
                    [Op.like]: `${loginSubstring}%`
                }
            },
            order: [
                ['login', 'ASC']
            ]
        });
        return result.map(this.mapper.toDomain);
    }

    @log()
    async findById(id: string) {
        const user = await this.findByIdWithoutMapping(id);
        if (!user) {
            return null;
        }
        return this.mapper.toDomain(user);
    }

    @log()
    async create(user: any): Promise<string> {
        const createdUser = await this.model.create(user);
        return createdUser.id;
    }

    @log()
    async update(id: string, updatedUser: DomainExistingUser): Promise<boolean> {
        const user = await this.findByIdWithoutMapping(id);
        if (!user) {
            return false;
        }
        const transformedUser = this.mapper.toDatabase(updatedUser);
        for (const key of Object.keys(transformedUser)) {
            (<any>user)[key] = (<any>transformedUser)[key];
        }
        await user.save();
        return true;
    }

    @log()
    async delete(id: string): Promise<boolean> {
        const user = await this.findByIdWithoutMapping(id);
        if (!user) {
            return false;
        }
        user.isDeleted = true;
        await user.save();
        return true;
    }
}
