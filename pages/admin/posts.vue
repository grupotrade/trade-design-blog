<template>
    <v-container fluid>
        <v-row align="center">
            <v-col cols="6">
                <h2>{{ $t("posts.title") }}</h2>
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

                    <v-data-table :items="posts" :headers="postsHeaders" hide-default-footer>
                        <template v-slot:item.createdAt="{ item }">
                            {{ $moment(item.createdAt).format('DD/MM/YYYY') }}
                        </template>
                        <template v-slot:item.type="{ item }">
                            {{ item.type.name }}
                        </template>
                        <template v-slot:item.content="{ item }">
                            {{ item.content.substring(0, 55) }}...
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
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="deletePost(item.id)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t("delete") }}</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-skeleton-loader>
            </v-col>
        </v-row>
        <v-dialog v-model="newPostDialog" width="750px" persistent>
            <v-toolbar dense flat class="midground">
                <v-toolbar-title>{{ $t('posts.new_post') }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="minimizeNewPost()">
                            <v-icon>mdi-window-minimize</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('minimize') }}</span>
                </v-tooltip>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="cancelNewPost()">
                            <v-icon>mdi-window-close</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('cancel') }}</span>
                </v-tooltip>
            </v-toolbar>
            <v-card flat tile class="pt-4">
                <v-card-text>
                    <v-form v-model="newPostForm" method="POST" @submit="createPost">
                        <v-row>
                            <v-col>
                                <v-select dense label="Categoría" v-model="post.type" :items="types" item-text="name"
                                    return-object :rules="rules.required" required outlined color="secondary"></v-select>
                            </v-col>
                            <v-col>
                                <v-text-field dense label="Autor" v-model="post.author" outlined color="secondary">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-text-field dense label="Título" v-model="post.title" :rules="rules.required" required outlined
                            color="secondary">
                        </v-text-field>
                        <p>Sinopis</p>
                        <client-only>
                            <VueEditor v-model="post.resume" :editor-toolbar="customToolbar" />
                        </client-only>
                        <p class="mt-2">Contenido</p>
                        <client-only>
                            <VueEditor v-model="post.content" :editor-toolbar="customToolbar" />
                        </client-only>
                        <h4 class="body-1 my-2">Imagen</h4>
                        <v-row>
                            <v-col>
                                <v-file-input dense v-model="post.img" :placeholder="$t('upload')" outlined
                                    @change="fileInput" :disabled="processingImg">
                                    <template v-slot:append-outer>
                                        <v-progress-circular v-if="processingImg" color="grey" indeterminate small />
                                    </template>
                                </v-file-input>
                            </v-col>
                        </v-row>
                        <v-btn depressed color="primary" :disabled="!newPostForm" type="submit">
                            {{ $t('save') }}
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editPostDialog" width="750px" persistent>
            <v-toolbar dense flat class="midground">
                <v-toolbar-title>{{ $t('posts.edit_post') }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="minimizeEditPost()">
                            <v-icon>mdi-window-minimize</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('minimize') }}</span>
                </v-tooltip>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="cancelEditPost()">
                            <v-icon>mdi-window-close</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('cancel') }}</span>
                </v-tooltip>
            </v-toolbar>
            <v-card flat tile class="pt-4">
                <v-card-text>
                    <v-form v-model="editPostForm">
                        <v-row>
                            <v-col>
                                <v-select dense label="Categoría" v-model="post.type" :items="types" item-text="name"
                                    return-object :rules="rules.required" required outlined color="secondary"></v-select>
                            </v-col>
                            <v-col>
                                <v-text-field dense label="Título" v-model="post.title" :rules="rules.required" required outlined
                            color="secondary">
                        </v-text-field>
                            </v-col>
                        </v-row>
                        <v-textarea dense label="Resumen" v-model="post.resume" outlined
                            color="secondary">
                        </v-textarea>
                        <p class="mt-2">Contenido</p>
                        <client-only>
                            <VueEditor v-model="post.content" :editor-toolbar="customToolbar" />
                        </client-only>
                        <h4 class="body-1 my-2">Imagen</h4>
                        <v-row>
                            <v-col>
                                <v-file-input v-model="post.img" :placeholder="$t('upload')" @change="fileInput"
                                    :disabled="processingImg">
                                    <template v-slot:append-outer>
                                        <v-progress-circular v-if="processingImg" color="grey" indeterminate small />
                                    </template>
                                </v-file-input>
                            </v-col>
                        </v-row>
                        <v-btn depressed color="primary" :disabled="!editPostForm" @click="editPostFb">
                            {{ $t('save') }}
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
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
            content: null,
            loading: false,
            newPostForm: false,
            newPostDialog: false,
            editPostDialog: false,
            editPostForm: false,
            iconMinimizeNewPost: false,
            activePost: null,
            processingImg: false,
            postsHeaders: [{
                text: "Fecha",
                align: "start",
                value: "createdAt",
            }, {
                text: "Tipo",
                align: "start",
                value: "type",
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
            post: {
                title: "",
                type: "",
                content: "",
                resume: "",
                active: true,
                img: null,
                imgPath: "",

            },
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
        this.listPosts();
    },
    methods: {
        async listPosts() {
            this.loading = true
            this.$store.dispatch('posts/getPosts')
                .then(() => {
                    this.loading = false
                })
        },
        newPost() {
            this.$store.dispatch('posts/getPostTypes')
                .then(() => {
                    this.newPostDialog = true;
                })

        },
        minimizeNewPost() {
            this.newPostDialog = false;
            this.iconMinimizeNewPost = true
        },
        maximizeNewPost() {
            this.newPostDialog = true;
        },
        cancelNewPost() {
            this.$dialog.show({
                title: `${this.$t('confirm_dialog.cancel_new_post')}`,
                text: `${this.$t('confirm_dialog.confirm_cancel')} ${this.$t('confirm_dialog.new_post')}`,
                buttons: [{
                    text: 'Sí, cancelar',
                    color: 'primary',
                    handle: () => {
                        this.$dialog.hide()
                        this.iconMinimizeNewPost = false
                        this.newPostDialog = false
                    }
                }]
            })
        },
        cancelEditPost() {
            this.$dialog.show({
                title: `${this.$t('confirm_dialog.cancel_edit_post')}`,
                text: `${this.$t('confirm_dialog.confirm_cancel')} ${this.$t('confirm_dialog.edit_post')}`,
                buttons: [{
                    text: 'Sí, cancelar',
                    color: 'primary',
                    handle: () => {
                        this.$dialog.hide()
                        this.iconMinimizeEditPost = false
                        this.editPostDialog = false
                    }
                }]
            })
        },
        createPost(event) {
            this.loading = true
            const dateTime = new Date()
            this.post.img = this.post.imgPath
            event.preventDefault();
            const payload = this.post
            payload.createdBy = this.user
            payload.createdAt = dateTime.toISOString(),
                payload.deletedAt = null
            this.$store.dispatch('posts/createPost', payload)
                .then(() => {
                    this.loading = false
                    this.newPostDialog = false
                    this.$toasted.success('Artículo creado', {
                        theme: "bubble",
                        position: "top-right",
                        duration: 2000
                    })
                    this.listPosts();
                })
        },
        editPost(item) {
            this.editPostDialog = true
            this.post = item
            this.activePost = item.id
        },
        editPostFb(event) {
            event.preventDefault();
            if (this.post.imgPath == null) {
                this.post.imgPath = this.post.img
            }
            this.$fire.firestore
                .collection("posts")
                .doc(this.activePost)
                .update({
                    title: this.post.title,
                    content: this.post.content,
                    resume: this.post.resume,
                    type: this.post.type,
                    img: this.post.imgPath,
                    img_color: this.post.img_color,
                })
                .then(() => {
                    this.listPosts();
                    this.editPostDialog = false;
                    this.post = {
                        title: "",
                        author: "",
                        type: "",
                        content: "",
                        link_url: "",
                        link_text: "",
                        img: null,
                        img_color: "",
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        deletePost(doc) {
            if (confirm("¿Está seguro?")) {
                this.$fire.firestore
                    .collection("posts")
                    .doc(doc)
                    .delete()
                    .then(() => {
                        this.listPosts();
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
}</style>
