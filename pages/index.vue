<template>
    <v-container fluid class="pa-0">
        <v-sheet>
            <BannersListBanners class="mb-4" position="blog-top" />
        </v-sheet>
        <v-container class="container-default">
            <v-row no-gutters>
                <v-col cols="12">
                    <h2 class="mt-6 mb-8">Buscar por categoría</h2>
                </v-col>
                <v-col v-if="!$vuetify.breakpoint.xs">
                    <p class="mt-1">Seleccionar categoría:</p>
                </v-col>
                <v-col cols="12" lg="8">
                    <v-autocomplete v-model="selectedPostTypes"
                        :label="$vuetify.breakpoint.xs ? 'Seleccionar categoría:' : ''" ref="postTypes"
                        :items="filteredPostTypes" item-text="name" item-value="id" dense filled rounded chips clearable
                        deletable-chips multiple small-chips @click:clear="fetchPosts"></v-autocomplete>

                </v-col>
                <v-col class="text-center">
                    <v-btn color="primary" rounded depressed class="px-12 py-4" @click="listPostsByPostType">Buscar</v-btn>
                </v-col>
            </v-row>
            <v-row justify="center" dense v-if="loadingPosts">
                <v-progress-circular indeterminate color="secondary" class="mx-auto my-12"></v-progress-circular>
            </v-row>
            <div v-else-if="posts.length > 0">
                <h2 class="my-6">Lo más nuevo</h2>
                <v-row class="mt-4 mt-lg-2">
                    <v-col v-for="post in posts.slice(0, limitPosts)" :key="post.id" cols="12" lg="3">
                        <PostsPostCard :post="post" @navigate="navigatePost(post)" />
                    </v-col>
                    <v-col cols="12" class="text-center" v-if="posts.length > 6 && limitPosts < posts.length">
                        <v-btn depressed rounded color="primary" class="px-16" @click="limitPosts = limitPosts + 6"
                            small>Ver más</v-btn>
                    </v-col>
                </v-row>
            </div>
            <p v-else class="pa-12"> No hay resultados que coincidan con la búsqueda.</p>
        </v-container>
        <CommonSuscribeForm class="mt-12 mb-8" />
        <v-container class="container-default">
            <CommonFollowUs class="mt-12 mb-8" />
        </v-container>

        <v-sheet class="my-4">
            <BannersListBanners class="my-4" position="blog-footer" />
        </v-sheet>
    </v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            loadingPosts: false,
            limitPosts: 6,
            selectedPostTypes: [],
            postsTotal: []
        }
    },
    computed: {
        ...mapGetters({
            posts: "posts/getPosts",
            postTypes: "posts/getPostTypes",
        }),
        user() {
            return this.$store.state.authUser;
        },
        uniquePostTypes() {
            return new Set(this.postsTotal.map(post => post.type.name))
        },
        filteredPostTypes() {
            return this.postTypes.filter(post => this.uniquePostTypes.has(post.name))
        }
    },
    mounted() {
        this.fetchPostTypes();
        this.fetchPosts();
    },
    methods: {
        async fetchPostTypes() {
            this.loadingPosts = true
            this.$store.dispatch('posts/getPostTypes')
                .then(() => {

                })
        },
        async listPostsByPostType() {
            this.loadingPosts = true
            if (this.selectedPostTypes.length > 0) {
                let payload = this.selectedPostTypes
                console.log(payload)
                this.$store.dispatch('posts/getPostsByPostTypes', payload)
                    .then(() => {
                        this.loadingPosts = false
                    })
            } else {
                this.fetchPosts()
            }
        },
        async fetchPosts() {
            this.loadingPosts = true
            this.$store.dispatch('posts/getActivePosts')
                .then(() => {
                    this.loadingPosts = false
                    this.postsTotal = this.deepCopy(this.posts)
                })
        },
        navigatePost(post) {
            this.$router.push('/post/' + post.id)
        }

    },
};
</script>
