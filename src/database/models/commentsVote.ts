import { Sequelize, DataTypes, Model } from 'sequelize';
import { UserModel } from './user';
import { CommentModel } from './comment'; // Assuming your comment model is named comments.ts

declare global {
    interface CommentsVote extends TimeStampModel {
        id: number;
        userId: number; // Reference to the User model's id
        commentId: number; // Reference to the Comment model's id
        direction: 'up' | 'down'; // The vote direction
    }

    type CommentsVoteCreateInterface = Omit<
        CommentsVote,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >;
}

export class CommentsVoteModel
    extends Model<CommentsVote, CommentsVoteCreateInterface>
    implements CommentsVote
{
    public id!: number;
    public userId!: number;
    public commentId!: number;
    public direction!: 'up' | 'down';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const CommentsVoteGenerator = (
    sequelize: Sequelize,
    User: typeof UserModel,
    Comment: typeof CommentModel,
): typeof CommentsVoteModel => {
    CommentsVoteModel.init(
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
            commentId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Comment,
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
            tableName: 'commentsVote',
            timestamps: true,
            paranoid: true,
        },
    );

    // Associating CommentsVote with User and Comment
    CommentsVoteModel.belongsTo(User, {
        foreignKey: 'userId',
        as: 'voter', // if you want to retrieve the user when querying CommentsVote
    });

    CommentsVoteModel.belongsTo(Comment, {
        foreignKey: 'commentId',
        as: 'votedComment', // if you want to retrieve the comment when querying CommentsVote
    });

    return CommentsVoteModel;
};
