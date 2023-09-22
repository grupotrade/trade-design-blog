<template>
    <v-container>
        <v-row align="center">
            <v-col cols="6">
                <h2>{{ $t("posts.title") }}</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-text-field v-model="searchPosts" :label="$t('search')" solo hide-details append-icon="mdi-table-search"
                    color="secondary">
                </v-text-field>
            </v-col>
            <v-col class="text-right">
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" v-show="iconMinimizeNewPost" outlined color="primary"
                            @click="maximizeNewPost()">
                            {{ $t("posts.restore_new_post") }}
                        </v-btn>
                    </template>
                    <span> {{ $t("posts.restore_post") }}</span>
                </v-tooltip>
                <v-btn class="primary" depressed @click="newPost()" :disabled="iconMinimizeNewPost"
                    :dark="!iconMinimizeNewPost">
                    {{ $t("posts.new_post") }}
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader class="mx-auto" type=" table: table-heading, table-thead, table-tbody, table-tfoot"
                    :loading="loading">

                    <v-data-table :items="posts" :headers="postsHeaders" hide-default-footer :search="searchPosts">
                        <template v-slot:item.createdAt="{ item }">
                            {{ $moment(item.createdAt).format('DD/MM/YYYY') }}
                        </template>
                        <template v-slot:item.content="{ item }">
                            {{ item.content.substring(0, 75) }}...
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="editPost(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t("edit") }}</span>
                            </v-tooltip>
                            <v-tooltip top v-if="item.active">
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="disablePost(item.id)">
                                        <v-icon>mdi-eye-outline</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t("disable") }}</span>
                            </v-tooltip>
                            <v-tooltip top v-else>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="enablePost(item.id)">
                                        <v-icon>mdi-eye-off-outline</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t("enable") }}</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-skeleton-loader>
            </v-col>
        </v-row>
        <PostsNewPostDialog v-model="newPostDialog"  @finish="fetchPosts()" @minimize="minimizeNewPost()" :user="user" />
        <PostsUpdatePostDialog v-model="editPostDialog" v-if="editPostDialog" :post="postEditable" :id="activePost" :user="user"  @finish="fetchPosts()"  @minimize="minimizeEditPost" />
    </v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    layout: 'admin',
    data() {
        return {
            searchPosts: '',
            content: null,
            loading: false,
            newPostDialog: false,
            editPostDialog: false,
            iconMinimizeNewPost: false,
            iconMinimizeEditPost: false,
            activePost: null,
            processingImg: false,
            postEditable: '',
            postsHeaders: [{
                text: "Fecha",
                align: "start",
                value: "createdAt",
            }, {
                text: "Tipo",
                align: "start",
                value: "type.name",
            }, {
                text: "Título",
                align: "start",
                value: "title",
            },
            {
                text: "Resumen",
                align: "start",
                value: "resume",
            },
            {
                text: "",
                align: "start",
                value: "actions",
            },
            ],
            rules: {
                required: [(v) => !!v || this.$t("rules.required")],
            },
            customToolbar: [[{
                header: [false, 1, 2, 3, 4, 5, 6]
            }], ["bold", "italic", "underline", "strike"], // toggled buttons
            [{
                align: ""
            }, {
                align: "center"
            }, {
                align: "right"
            }, {
                align: "justify"
            }], ["blockquote", "code-block"], [{
                list: "ordered"
            }, {
                list: "bullet"
            }, {
                list: "check"
            }], [{
                indent: "-1"
            }, {
                indent: "+1"
            }], // outdent/indent
            [{
                color: []
            }, {
                background: []
            }], // dropdown with defaults from theme
            ["link"], ["clean"] // remove formatting button
            ]
        };
    },
    computed: {
        ...mapGetters({
            posts: "posts/getPosts",
            types: "posts/getPostTypes"
        }),
        user() {
            return this.$store.state.authUser;
        }
    },
    mounted() {
        this.fetchPosts()
        this.fetchPostTypes()
    },
    methods: {
        async fetchPosts() {
            this.loading = true
            this.$store.dispatch('posts/getPosts')
                .then(() => {
                    this.loading = false
                })
        },
        fetchPostTypes() {
            this.$store.dispatch('posts/getPostTypes')
                .then(() => {
                })
        },
        newPost() {
            this.newPostDialog = true;
        },
        minimizeNewPost() {
            this.newPostDialog = false;
            this.iconMinimizeNewPost = true
        },
        minimizeEditPost() {
            this.editPostDialog = false;
            this.iconMinimizeEditPost = true
        },
        maximizeNewPost() {
            this.newPostDialog = true;
        },
        editPost(item) {
            this.editPostDialog = true
            this.postEditable = this.deepCopy(item)
            this.activePost = item.id
        },        
        disablePost(id) {
            if (confirm("¿Está seguro?")) {
                this.$fire.firestore
                    .collection("posts")
                    .doc(id)
                .update({
                    active:false,
                })
                    .then(() => {
                        this.fetchPosts();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        enablePost(id) {
            if (confirm("¿Está seguro?")) {
                this.$fire.firestore
                    .collection("posts")
                    .doc(id)
                .update({
                    active: true,
                })
                    .then(() => {
                        this.fetchPosts();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        async fileInput(file) {
            try {
                if (file && file.name) {
                    this.processingImg = true;
                    const fr = new FileReader();
                    fr.readAsDataURL(file);
                    fr.addEventListener("load", () => {
                        // this is to load image on the UI
                        // .. not related to file upload :)
                        this.fileURL = fr.result;
                    });
                    const imgData = new FormData();
                    imgData.append("image", this.post.img);
                    const filePath = `${Date.now()}-${file.name}`;
                    const metadata = {
                        contentType: this.post.img.type
                    };
                    this.post.imgPath = filePath
                    await this.$fire.storage.ref()
                        .child('posts')
                        .child(filePath)
                        .put(this.post.img, metadata);
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.processingImg = false;
            }
        }
    },
};
</script>

<style scoped>
[v-cloak] {
    display: none;
}

.posts {
    max-width: 1240px !important;
    margin: 150px auto 0 !important;
}
</style>
