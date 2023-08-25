<template>
<v-container class="pt-lg-16 px-lg-16">
    <v-row>
        <v-col>
            <v-sheet class="rounded grey lighten-3 py-2 px-3 elevation-1 primary--text" v-if="post.type">
                <a href="/educacion">
                    <v-icon left color="primary">mdi-book-open</v-icon>Biblioteca
                </a> > {{ post.type.name }}
            </v-sheet>
            <article v-if="post">
                <header>
                    <h2 class="py-6 primary--text">{{ post.title }}</h2>
                </header>
                <p class="primary--text"> <span v-if="post.author">
                        <v-icon small color="primary" class="mx-1">mdi-account</v-icon>Autor: {{ post.author }}
                    </span>
                </p>
                <v-img :src="post.image" class="rounded" contain />
                <p class="py-3" v-html="post.content"></p>
            </article>
        </v-col>
        <v-col lg="3" cols="12">
            <v-skeleton-loader type="card" :loading="loadingRelated" v-if="relatedPosts.length > 0">
                <h4 class="mt-4 mb-6 primary--text">Artículos relacionados</h4>
                <v-card class="pa-4 mb-2" v-for="post in relatedPosts" :key="post.id" rounded @click="navigatePost(post)">
                    <p class="primary--text">{{ $moment(post.createdAt).format('DD/MM/YYYY')  }} | {{ post.author }}</p>
                    <h6 class="primary--text">
                        {{ post.title }}
                    </h6>
                </v-card>
                <!-- <v-carousel v-model="related" :show-arrows="false" hide-delimiter-background>
                    <v-carousel-item :key="post.id">
                        <v-card class="pa-4 mb-2"  v-for="post in relatedPosts" rounded @click="navigatePost(post)">
                            <h6 class="primary--text">{{ $moment(post.createdAt).format('DD/MM/YYYY')  }} | {{ post.author }}</h6>
                            <h4 class="primary--text">
                                {{ post.title }}
                            </h4>
                        </v-card>
                    </v-carousel-item>
                </v-carousel> -->
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
        this.$store.commit('posts/setPosts',[])
        this.$store.commit('posts/setPost',[])
        this.getPost()
    },
    methods: {
        async getPost() {
            let postId = this.$route.params.id
            this.$store.dispatch('posts/getPostbyId', postId)
                .then(() => {
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
            this.$store.dispatch('posts/getPostsByPostType', this.post.type.id)
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
