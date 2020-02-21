import { Table, Column, ForeignKey, Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { GroupModel } from './group.model';

@Table({
    modelName: 'userGroup',
    timestamps: false
})
export class UserGroupModel extends Model<UserGroupModel> {
    @ForeignKey(() => UserModel)
    @Column
    userId!: number;

    @ForeignKey(() => GroupModel)
    @Column
    groupId!: string;
}
