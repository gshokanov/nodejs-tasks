import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { UserGroupModel } from './user-group.model';

@Table({
    modelName: 'user',
    timestamps: false
})
export class UserModel extends Model<UserModel> {
    @Column
    login!: string;

    @Column
    password!: string;

    @Column(DataType.INTEGER)
    age!: number;

    @Column
    isDeleted!: boolean;
}

UserModel.beforeDestroy(async (user) => {
    const result = await UserGroupModel.findAll({
        where: {
            userId: (user as UserModel).id
        }
    });
    return Promise.all(result.map(record => record.destroy())) as any as Promise<void>;
});
