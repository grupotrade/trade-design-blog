<template>
    <v-container fluid class="px-0">
        <v-row>
            <v-col>
                <v-skeleton-loader type="article" :loading="loadingPost">
                    <div v-if="post">
                        <v-container class="container-default">
                            <v-sheet class="container-default secondary secondary--text lighten-4 pa-3 rounded-xl body-1"
                                v-if="post.type">
                                <v-btn to="../" text small rounded color="secondary" class="mr-2">
                                    <v-icon small>mdi-chevron-left</v-icon> Volver
                                </v-btn> {{ post.type.name }}
                            </v-sheet>
                        </v-container>
                        <div class="d-flex justify-center">
                            <v-img :src="$config.storage + 'posts%2F' + post.img + '?alt=media'" class="rounded mb-6"
                                contain />
                        </div>
                        <v-container class="container-post">
                            <h1 class="py-12 black--text">{{ post.title }}</h1>
                            <p class="py-3 semi" v-html="post.resume" v-if="post.resume != ''"></p>
                            <p class="py-3" v-html="post.content"></p>
                        </v-container>
                    </div>
                </v-skeleton-loader>
            </v-col>
            <v-col cols="12">
                <v-skeleton-loader type="card" :loading="loadingRelated" v-if="relatedPosts.length > 0">
                    <v-container>
                        <h2 class="mt-6 mb-10">Artículos relacionados</h2>

                        <v-row>
                            <v-col v-for="post in relatedPosts" :key="post.id" cols="12" lg="4">
                                <PostsPostCard :post="post" :related="true" @navigate="navigatePost(post)" />
                            </v-col>
                        </v-row>
                    </v-container>
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
