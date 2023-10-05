import { Sequelize } from 'sequelize';
import { SEQUELIZE_CONFIGS } from '@/common/db_constants';
import { UserGenerator, UserModel } from './models/user';
import { PostGenerator, PostModel } from './models/post';
import { VoteGenerator, VoteModel } from './models/vote';
import { ProfileGenerator, ProfileModel } from './models/profile';
import { CountyGenerator, CountyModel } from './models/county';
import { PostImageGenerator, PostImageModel } from './models/postimage';
import { TagGenerator, TagModel } from './models/posttags';

import { relations } from './relations';

const sequelize = new Sequelize(SEQUELIZE_CONFIGS);

declare global {
    interface TimeStampModel {
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date | null;
    }

    interface DB {
        Sequelize: typeof Sequelize;
        sequelize: Sequelize;
        User: typeof UserModel;
        Post: typeof PostModel;
        Vote: typeof VoteModel;
        Profile: typeof ProfileModel;
        County: typeof CountyModel;
        PostImage: typeof PostImageModel;
        PostTags: typeof TagModel;
    }
}

const user = UserGenerator(sequelize);
const post = PostGenerator(sequelize, user);
const vote = VoteGenerator(sequelize, user, post);
const profile = ProfileGenerator(sequelize);
const county = CountyGenerator(sequelize);
const postimage = PostImageGenerator(sequelize, post);
const posttags = TagGenerator(sequelize, post);

const db: DB = {
    Sequelize,
    sequelize,
    User: user,
    Post: post,
    Vote: vote,
    Profile: profile,
    County: county,
    PostImage: postimage,
    PostTags: posttags,
};

relations(db);

export default db;
