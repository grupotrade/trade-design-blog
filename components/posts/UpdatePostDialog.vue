<template>
    <v-dialog v-model="show" width="750px" persistent fullscreen>
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
                            <v-text-field dense label="Autor" v-model="post.author" outlined color="secondary">
                            </v-text-field>
                        </v-col>

                    </v-row>
                    <v-col>
                        <v-text-field dense label="Título" v-model="post.title" :rules="rules.required" required outlined
                            color="secondary">
                        </v-text-field>
                    </v-col>
                    <v-textarea dense label="Resumen" v-model="post.resume" outlined color="secondary">
                    </v-textarea>
                    <p class="mt-2">Contenido</p>
                    <client-only>
                        <VueEditor v-model="post.content" :editor-toolbar="customToolbar" />
                    </client-only>
                    <h4 class="body-1 my-2">Imagen</h4>
                    <v-row>
                        <v-col>
                            <v-file-input v-model="post.img" :placeholder="$t('upload')" @change="fileInput" outlined
                                :disabled="processingImg">
                                <template v-slot:append-outer>
                                    <v-progress-circular v-if="processingImg" color="grey" indeterminate small />
                                </template>
                            </v-file-input>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col class="text-right">
                            <v-btn depressed color="primary" :disabled="!editPostForm || post.content == ''"
                                @click="editPostFb">
                                {{ $t('save') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    props: {
        value: {
            type: Boolean
        },
        post: {
            type: Object,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            validPost: false,
            processingImg: false,
            saving: false,
            editPostForm: false,
            fileURL: null,
            progress: 0,
            newImagePath: null,
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
            ],
        }
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit("modified", val);
            }
        },
        ...mapGetters({
            types: "posts/getPostTypes"
        }),
        postEditable: {
            get() {
                return this.deepCopy(this.post)
            },
        }
    },
    methods: {
        minimizeEditPost() {
            this.$emit("minimize");
            this.show = false;
        },
        cancelEditPost() {
            this.$dialog.show({
                text: `${this.$t('confirm_dialog.new_post')}`,
                buttons: [{
                    text: 'Si',
                    color: "primary",
                    handle: () => {
                        this.$dialog.hide();
                        this.show = false;
                        this.$emit("cancel");
                    },
                },],
            });
        },
        editPostFb(event) {
            event.preventDefault();
            if (this.post.imgPath == null) {
                this.post.imgPath = this.post.img
            }
            this.$fire.firestore
                .collection("posts")
                .doc(this.id)
                .update({
                    title: this.post.title,
                    content: this.post.content,
                    resume: this.post.resume,
                    type: this.post.type,
                    img: this.post.imgPath
                })
                .then(() => {
                    this.fetchPosts();
                    this.editPostDialog = false;
                    this.post = {
                        title: "",
                        author: "",
                        type: "",
                        resume: "",
                        content: "",
                        img: null,
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
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


    }
}
</script>
