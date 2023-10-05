import { Sequelize, DataTypes, Model } from 'sequelize';
import { UserModel } from './user';

declare global {
    interface Post extends TimeStampModel {
        id: number;
        type: 'tip' | 'campaign';
        author: string; // This will be the username from the User model
        profile_img?: string | null;
        img_url?: string[] | [];
        title: string;
        content: string;
        voteCount: number;
        isVoted?: 'up' | 'down' | null;
        lat?: number; // Optional latitude
        lon?: number; // Optional longitude
        tags?: string[];
        addressName?: string;
    }

    type PostCreateInterface = Omit<
        Post,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'voteCount'
    >;
}

export class PostModel
    extends Model<Post, PostCreateInterface>
    implements Post
{
    public id!: number;
    public type!: 'tip' | 'campaign';
    public author!: string;
    public profile_img?: string | null;
    public title!: string;
    public content!: string;
    public voteCount!: number;
    public isVoted?: 'up' | 'down' | null;
    public lat?: number;
    public lon?: number;
    public address?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const PostGenerator = (
    sequelize: Sequelize,
    User: typeof UserModel,
): typeof PostModel => {
    PostModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM('tip', 'campaign'),
                allowNull: false,
            },
            author: {
                type: DataTypes.STRING, // Matches the username in User model
                allowNull: false,
                references: {
                    model: User, // Referencing the User model
                    key: 'username',
                },
            },
            title: {
                type: DataTypes.STRING(255), // Limiting the length to 255 characters
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT, // No length limit
                allowNull: false,
            },
            voteCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0, // Default voteCount is 0
            },
            lat: {
                type: DataTypes.FLOAT,
                allowNull: true, // Making it optional
            },
            lon: {
                type: DataTypes.FLOAT,
                allowNull: true, // Making it optional
            },
            addressName: {
                type: DataTypes.STRING(255), // Limiting the length to 255 characters
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'post',
            timestamps: true,
            paranoid: true,
        },
    );

    // Associating Post with User
    PostModel.belongsTo(User, {
        foreignKey: 'author',
        as: 'user', // if you want to retrieve the user when querying Post
    });

    return PostModel;
};
