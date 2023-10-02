import { Sequelize, DataTypes, Model } from 'sequelize';
import { UserModel } from './user'; // Assuming the user model is in the same directory

declare global {
    interface Profile extends TimeStampModel {
        id: number;
        user_id: number; // This is the foreign key to associate Profile with User
        profile_img: string | null;
        bio: string | null;
        username?: string;
    }

    type ProfileCreateInterface = Omit<
        Profile,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >;
}

export class ProfileModel
    extends Model<Profile, ProfileCreateInterface>
    implements Profile
{
    public id!: number;
    public user_id!: number;
    public profile_img!: string | null;
    public bio!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const ProfileGenerator = (sequelize: Sequelize): typeof ProfileModel => {
    ProfileModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    // This establishes a foreign key reference to the User model
                    model: 'user', // name of the referenced table
                    key: 'id',
                },
                onDelete: 'CASCADE', // If a user is deleted, the associated profile should also be deleted
            },
            profile_img: {
                type: DataTypes.STRING,
                allowNull: true, // Assuming profile images are optional
            },
            bio: {
                type: DataTypes.STRING(512), // Limiting the bio length to 512 characters
                allowNull: true, // Assuming bios are optional
            },
        },
        {
            sequelize,
            tableName: 'profile',
            timestamps: true,
            paranoid: true,
        },
    );

    // Establishing the relationships
    UserModel.hasOne(ProfileModel, {
        foreignKey: 'user_id',
        as: 'profile',
    });
    ProfileModel.belongsTo(UserModel, {
        foreignKey: 'user_id',
        as: 'user',
    });

    return ProfileModel;
};
