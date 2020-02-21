import { Table, Model, Column, DataType } from 'sequelize-typescript';
import * as uuid from 'uuid/v4';
import { UserGroupModel } from './user-group.model';
import { Permissions, permissions } from '../types/permission';

@Table({
    modelName: 'group',
    timestamps: false
})
export class GroupModel extends Model<GroupModel> {
    @Column({
        type: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid
    })
    id!: string;

    @Column
    name!: string;

    @Column(DataType.ARRAY(DataType.ENUM(...permissions)))
    permissions!: Permissions;
}

GroupModel.beforeDestroy(async (group) => {
    const result = await UserGroupModel.findAll({
        where: {
            groupId: (group as GroupModel).id
        }
    });
    return Promise.all(result.map(record => record.destroy())) as any as Promise<void>;
});
