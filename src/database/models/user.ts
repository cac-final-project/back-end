import { Sequelize, DataTypes, Model } from 'sequelize';

declare global {
    interface User extends TimeStampModel {
        id: number;
        username: string; // login userId
        nickname: string;
        password: string;
        phone_no: string;
        type: 'neighbor' | 'volunteer';
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
    public nickname!: string;
    public password!: string;
    public phone_no!: string;
    public type!: 'neighbor' | 'volunteer';

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
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false,
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
                type: DataTypes.ENUM('neighbor', 'volunteer'),
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
