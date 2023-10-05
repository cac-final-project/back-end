import { Sequelize, DataTypes, Model } from 'sequelize';
import { PostModel } from './post';

declare global {
    interface PostImage extends TimeStampModel {
        id: number;
        img_url: string;
        post_id: number;
    }

    type PostImageCreateInterface = Omit<
        PostImage,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >;
}

export class PostImageModel
    extends Model<PostImage, PostImageCreateInterface>
    implements PostImage
{
    public id!: number;
    public img_url!: string;
    public post_id!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const PostImageGenerator = (
    sequelize: Sequelize,
    Post: typeof PostModel,
): typeof PostImageModel => {
    PostImageModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            img_url: {
                type: DataTypes.STRING(512), // Assuming the URL will be less than 512 characters. Adjust as necessary.
                allowNull: false,
            },
            post_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Post, // Referencing the Post model
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'post_image',
            timestamps: true,
            paranoid: true,
        },
    );

    // Associating PostImage with Post
    PostImageModel.belongsTo(Post, {
        foreignKey: 'post_id',
        as: 'post', // if you want to retrieve the post when querying PostImage
    });

    return PostImageModel;
};
