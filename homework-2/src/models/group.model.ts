import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { Permissions, permissions } from '../types/permission';

@Table({
    modelName: 'group',
    timestamps: false
})
export class GroupModel extends Model<GroupModel> {
    @Column
    name!: string;

    @Column(DataType.ARRAY(DataType.ENUM(...permissions)))
    permissions!: Permissions;
}
