import { Sequelize, DataTypes, Model } from 'sequelize';
import { PostModel } from './post';

declare global {
    interface Tag extends TimeStampModel {
        id: number;
        post_id: number;
        name: string;
    }

    type TagCreateInterface = Omit<
        Tag,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >;
}

export class TagModel extends Model<Tag, TagCreateInterface> implements Tag {
    public id!: number;
    public post_id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const TagGenerator = (
    sequelize: Sequelize,
    Post: typeof PostModel,
): typeof TagModel => {
    TagModel.init(
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
                    model: Post, // Referencing the Post model
                    key: 'id',
                },
            },
            name: {
                type: DataTypes.STRING(255), // Assuming the tag name will be less than 255 characters. Adjust as necessary.
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'post_tags',
            timestamps: true,
            paranoid: true,
        },
    );

    // Associating Tag with Post
    TagModel.belongsTo(Post, {
        foreignKey: 'post_id',
        as: 'post', // if you want to retrieve the post when querying Tag
    });

    return TagModel;
};
