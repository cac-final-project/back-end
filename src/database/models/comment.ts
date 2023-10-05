import { Sequelize, DataTypes, Model } from 'sequelize';
import { UserModel } from './user';
import { PostModel } from './post';

declare global {
    interface Comments extends TimeStampModel {
        id: number;
        post_id: number;
        user_id: number;
        username: string;
        content: string;
        profile_img: string | null;
        voteCount: number;
    }

    type CommentsCreateInterface = Omit<
        Comments,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'voteCount'
    >;
}

export class CommentModel
    extends Model<Comments, CommentsCreateInterface>
    implements Comments
{
    public id!: number;
    public post_id!: number;
    public user_id!: number;
    public username!: string;
    public content!: string;
    public profile_img!: string | null;
    public voteCount!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const CommentGenerator = (
    sequelize: Sequelize,
    User: typeof UserModel,
    Post: typeof PostModel,
): typeof CommentModel => {
    CommentModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            post_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Post,
                    key: 'id',
                },
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: User,
                    key: 'id',
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: User,
                    key: 'username',
                },
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            profile_img: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            voteCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0, // Default voteCount is 0
            },
        },
        {
            sequelize,
            tableName: 'comments', // Updated to "comments" to reflect the new naming
            timestamps: true,
            paranoid: true,
        },
    );

    // Relationships
    CommentModel.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'userCommenter',
    });

    CommentModel.belongsTo(Post, {
        foreignKey: 'post_id',
        as: 'commentedPost',
    });

    return CommentModel;
};
