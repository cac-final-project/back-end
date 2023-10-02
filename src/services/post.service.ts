import {
    postRepository,
    userRepository,
    voteRepository,
} from '@/repositories/index';
import { customErrorMsg } from '@/exceptions/index';

export const postService = {
    postRepository,
    userRepository,
    voteRepository,
    async createPost(postData: Post) {
        const user = await this.userRepository.findByUserId(postData.author);
        if (postData.type === 'tip') {
            if (postData.lat || postData.lon) {
                return customErrorMsg('tip cannot include either lat or lon');
            }
            const tip = await this.postRepository.createPost(postData);
            return tip;
        } else {
            if (!postData.lat || !postData.lon) {
                return customErrorMsg('lat or lon is missing');
            } else if (user?.type === 'user') {
                return customErrorMsg('only volunteers can create campaign');
            } else {
                const campaign = await this.postRepository.createPost(postData);
                return campaign;
            }
        }
        return;
    },

    async vote(voteData: voteData) {
        await this.voteRepository.vote(voteData);
        return;
    },

    async fetchPosts(fetchPostsData: fetchPostsData): Promise<Post[]> {
        return this.postRepository.fetchPosts(fetchPostsData);
    },
};
