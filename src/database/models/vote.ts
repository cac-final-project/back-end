import { Sequelize, DataTypes, Model } from 'sequelize';
import { UserModel } from './user';
import { PostModel } from './post';

declare global {
    interface Vote extends TimeStampModel {
        id: number;
        userId: number; // Reference to the User model's id
        postId: number; // Reference to the Post model's id
        direction: 'up' | 'down'; // The vote direction
    }

    type VoteCreateInterface = Omit<
        Vote,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >;
}

export class VoteModel
    extends Model<Vote, VoteCreateInterface>
    implements Vote
{
    public id!: number;
    public userId!: number;
    public postId!: number;
    public direction!: 'up' | 'down';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const VoteGenerator = (
    sequelize: Sequelize,
    User: typeof UserModel,
    Post: typeof PostModel,
): typeof VoteModel => {
    VoteModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: User,
                    key: 'id',
                },
            },
            postId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Post,
                    key: 'id',
                },
            },
            direction: {
                type: DataTypes.ENUM('up', 'down'),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'vote',
            timestamps: true,
            paranoid: true,
        },
    );

    // Associating Vote with User and Post
    VoteModel.belongsTo(User, {
        foreignKey: 'userId',
        as: 'voter', // if you want to retrieve the user when querying Vote
    });

    VoteModel.belongsTo(Post, {
        foreignKey: 'postId',
        as: 'votedPost', // if you want to retrieve the post when querying Vote
    });

    return VoteModel;
};
