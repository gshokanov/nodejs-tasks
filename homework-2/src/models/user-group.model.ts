import { Table, Column, ForeignKey, Model, DataType } from 'sequelize-typescript';
import * as uuid from 'uuid/v4';
import { UserModel } from './user.model';
import { GroupModel } from './group.model';

@Table({
    modelName: 'userGroup',
    timestamps: false
})
export class UserGroupModel extends Model<UserGroupModel> {
    @Column({
        type: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid
    })
    id!: string;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.UUIDV4
    })
    userId!: string;

    @ForeignKey(() => GroupModel)
    @Column({
        type: DataType.UUIDV4
    })
    groupId!: string;
}
