<template>
<v-container class="px-lg-16">
    <v-sheet class="hero my-4">
        <BannersListBanners class="mb-4" position="educacion-arriba" />
    </v-sheet>
    <v-row>
        <v-col cols="12">
            <h2 class="primary--text my-4">
                Taller
            </h2>
        </v-col>
    </v-row>
    <v-row justify="center" dense v-if="loadingPosts">
        <v-progress-circular indeterminate color="secondary" class="mx-auto my-12"></v-progress-circular>
    </v-row>
    <v-row v-else-if="posts.length > 0" dense  class="mt-8 mt-lg-0">
        <v-col v-for="post in posts.slice(0,limitPosts)" :key="post.id" cols="6" lg="4">
            <postsActivityCard :post="post" @navigate="navigateActivity(post)" />
        </v-col>
        <v-col cols="12" class="text-center" v-if="posts.length > 6 && limitPosts < posts.length">
            <v-btn depressed rounded color="primary" class="px-16" @click="limitPosts = limitPosts + 6" small>Ver más</v-btn>
        </v-col>
    </v-row>
    <p v-else class="pa-12"> No hay resultados que coincidan con la búsqueda.</p>
    <v-sheet class="hero my-4">
        <BannersListBanners class="my-4" position="educacion-abajo" />
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
            activePostTypes: [],
            selectedPostTypes: []
        }
    },
    computed: {
        ...mapGetters({
            postTypes: "posts/getPostTypes",
            posts: "posts/getPosts"
        }),
        user() {
            return this.$store.state.authUser;
        },
    },
    mounted() {
        this.listAllPosts();
    },
    methods: {
        async listAllPosts() {
            this.loadingPosts = true
            this.$store.dispatch('posts/getPostTypes')
                .then(() => {

                })
            this.$store.dispatch('posts/getPosts')
                .then(() => {
                    this.loadingPosts = false
                })
        },
        async listPostsByPostType(postType) {
            // buscar el índice de la categoría seleccionada en el array
            const index = this.selectedPostTypes.findIndex(item => item.id === postType.id);
            if (index >= 0) {
                // si la categoría ya está en el array, eliminarla
                this.selectedPostTypes.splice(index, 1);
            } else {
                // si la categoría no está en el array, agregarla
                this.selectedPostTypes.push(postType);
            }

            this.loadingPosts = true;
            // llamar a la acción del store con todas las categorías seleccionadas
            const selectedIds = this.selectedPostTypes.map(item => item.id);
            if (this.selectedPostTypes.length > 0) {
                this.$store.dispatch('posts/getPostsByPostTypes', selectedIds)
                    .then(() => {
                        this.loadingPosts = false;
                    })
            } else {
                this.listAllPosts()
            }
            const activeIndex = this.activePostTypes.findIndex(item => item === postType.id);
            if (activeIndex >= 0) {
                // si la categoría ya está en el array, eliminarla
                this.activePostTypes.splice(index, 1);
            } else {
                // si la categoría no está en el array, agregarla
                this.activePostTypes.push(postType.id);
            }
        },
        navigateActivity(post) {
            this.$router.push('/actividad/' + post.id)
        },
        navigatePost(post) {
            this.$router.push('/post/' + post.id)
        },
        handleAutocompleteChange() {
            this.$refs.celulas.searchInput = '';
        },

    },
};
</script>
