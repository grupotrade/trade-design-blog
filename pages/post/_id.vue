<template>
    <v-container class="pt-lg-16 px-lg-16">
        <v-row>
            <v-col>
                <v-skeleton-loader type="article" :loading="loadingPost">
                    <article v-if="post">
                        <v-sheet color="" class="secondary secondary--text lighten-4 pa-3 rounded-xl body-1"
                            v-if="post.type">
                            <v-btn to="../" text small rounded color="secondary" class="mr-2">
                                <v-icon small>mdi-chevron-left</v-icon> Volver
                            </v-btn> {{ post.type.name }}
                        </v-sheet>
                        <header>
                            <h1 class="py-8 black--text text-center">{{ post.title }}</h1>
                        </header>

                        <v-img :src="$config.storage + 'posts%2F' + post.img + '?alt=media'" class="rounded" contain />
                        <p class="py-3" v-html="post.content"></p>
                    </article>
                </v-skeleton-loader>
            </v-col>
            <v-col cols="12">
                <v-skeleton-loader type="card" :loading="loadingRelated" v-if="relatedPosts.length > 0">
                    <h4 class="mt-4 mb-6 primary--text">Artículos relacionados</h4>
                    <v-row>
                        <v-col v-for="post in relatedPosts" :key="post.id" cols="6" lg="4">
            <PostsPostCard :post="post" @navigate="navigatePost(post)" />
        </v-col>
                    </v-row>
                </v-skeleton-loader>
            </v-col>
        </v-row>

        <!-- <h3 class="mt-10 mb-6" v-if="posts">Más publicaciones</h3> -->
    </v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            content: "",
            selectPost: '',
            loadingPost: true,
            loadingRelated: false
        }
    },
    computed: {
        ...mapGetters({
            post: 'posts/getPost',
            posts: 'posts/getPosts'
        }),
        relatedPosts() {
            return this.posts.filter(post => post.id !== this.$route.params.id)
        }
    },
    mounted() {
        this.$store.commit('posts/setPosts', [])
        this.$store.commit('posts/setPost', [])
        this.getPost()
    },
    methods: {
        async getPost() {
            let postId = this.$route.params.id
            this.$store.dispatch('posts/getPostbyId', postId)
                .then(() => {
                    this.loadingPost = false
                    this.getRelatedPosts()
                })
                .catch(err => {
                    if (err.response) {
                        this.$toasted.error(err.response.data.error, {
                            duration: 1500
                        })
                    } else {
                        this.$toasted.error(err, {
                            duration: 1500
                        })
                    }
                })
        },
        async getRelatedPosts() {
            this.loadingRelated = true
            const postType = []
            postType.push(this.post.type.id)
            this.$store.dispatch('posts/getPostsByPostTypes', postType)
                .then(() => {
                    this.loadingRelated = false
                }).catch(err => {
                    if (err.response) {
                        this.$toasted.error(err.response.data.error, {
                            duration: 1500
                        })
                    } else {
                        this.$toasted.error(err, {
                            duration: 1500
                        })
                    }
                })
        },
        navigatePost(post) {
            this.$router.push('/post/' + post.id)
        }
    },

}
</script>
