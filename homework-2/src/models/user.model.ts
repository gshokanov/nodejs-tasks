import { Model, Table, Column, DataType } from 'sequelize-typescript';

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
