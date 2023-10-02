import { Sequelize, DataTypes, Model } from 'sequelize';

declare global {
    interface User extends TimeStampModel {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        password: string;
        phone_no: string;
        type: 'user' | 'volunteer';
    }

    type UserCreateInterface = Omit<
        User,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >;

    type UserGetInterface = Omit<User, 'password'>; // Omit password for get operations for security reasons
}

export class UserModel
    extends Model<User, UserCreateInterface>
    implements User
{
    public id!: number;
    public username!: string;
    public first_name!: string;
    public last_name!: string;
    public password!: string;
    public phone_no!: string;
    public type!: 'user' | 'volunteer';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const UserGenerator = (sequelize: Sequelize): typeof UserModel => {
    UserModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone_no: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // Assuming phone numbers should be unique
            },
            type: {
                // Added type property to the schema
                type: DataTypes.ENUM('user', 'volunteer'),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'user',
            timestamps: true,
            paranoid: true,
        },
    );
    return UserModel;
};
