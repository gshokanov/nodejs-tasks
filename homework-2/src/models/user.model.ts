import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { UserGroupModel } from './user-group.model';
import * as uuid from 'uuid/v4';

@Table({
    modelName: 'user',
    timestamps: false
})
export class UserModel extends Model<UserModel> {
    @Column({
        type: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid
    })
    id!: string;

    @Column({
        type: DataType.STRING(50),
    })
    login!: string;

    @Column({
        type: DataType.STRING(50)
    })
    password!: string;

    @Column(DataType.INTEGER)
    age!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
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
