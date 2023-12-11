<template>
    <v-dialog v-model="show" width="950px" fullscreen>
        <v-toolbar dense flat color="midground">
            <v-toolbar-title>{{ $t('posts.new_post') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn depressed icon v-on="on" @click="minimizeNewPostDialog()">
                        <v-icon>mdi-window-minimize</v-icon>
                    </v-btn>
                </template>
                <span>{{ $t("minimize") }}</span>
            </v-tooltip>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn depressed icon v-on="on" @click="cancelNewPost()">
                        <v-icon>mdi-window-close</v-icon>
                    </v-btn>
                </template>
                <span>{{ $t("cancel") }}</span>
            </v-tooltip>
        </v-toolbar>
        <v-card flat tile class="pt-4">
            <v-card-text>
                <v-form v-model="newPostForm" method="POST" @submit="createPost">
                    <v-row>
                        <v-col>
                            <v-select dense label="Categoría *" v-model="post.type" :items="types" item-text="name"
                                return-object :rules="rules.required" required outlined color="secondary"></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field dense label="Autor" v-model="post.author" outlined color="secondary">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-text-field dense label="Título *" v-model="post.title" :rules="rules.required" required outlined
                        color="secondary">
                    </v-text-field>
                    <v-textarea dense label="Resumen" v-model="post.resume" outlined color="secondary">
                    </v-textarea>
                    <p class="mt-2">Contenido *</p>
                    <client-only>
                        <VueEditor v-model="post.content" />
                    </client-only>
                    <h4 class="body-1 my-2">Imagen</h4>
                    <v-row dense>
                        <v-col>
                            <v-file-input dense v-model="post.img" :placeholder="$t('upload')" outlined @change="fileInput"
                                :disabled="processingImg">
                                <template v-slot:append-outer>
                                    <v-progress-circular v-if="processingImg" color="grey" indeterminate small />
                                </template>
                            </v-file-input>
                        </v-col>
                    </v-row>          
                    <v-dialog v-model="saving" width="300px">
                        <v-card flat class="pa-8 text-center">
                           <h4>Guardando artículo...</h4> 
                            <v-progress-circular indeterminate></v-progress-circular>
                        </v-card>
                    </v-dialog>         
                <v-row dense>
                        <v-col class="text-right">
                            <v-btn depressed color="primary" :disabled="!newPostForm || post.content == ''" type="submit"
                                :loading="saving">
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
        user: {
            type: Object
        },
        value: {
            type: Boolean
        },
    },
    model: {
        event: `modified`
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
        })
    },
    data() {
        return {
            validPost: false,
            processingImg: false,
            saving: false,
            fileURL: null,
            progress: 0,
            newPostForm: false,
            post: {
                title: "",
                type: "",
                author: '',
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
            ],
        }
    },
    methods: {
        minimizeNewPostDialog() {
            this.$emit("minimize");
            this.show = false;
        },
        cancelNewPost() {
            this.$dialog.show({
                text: `${this.$t('confirm_dialog.new_post')}`,
                buttons: [{
                    text: 'Sí',
                    color: 'primary',
                    handle: () => {
                        this.$dialog.hide()
                        this.iconMinimizeNewPost = false
                        this.show = false
                    }
                }]
            })
        },
        createPost(event) {
            this.saving = true
            const dateTime = new Date()
            this.post.img = this.post.imgPath
            event.preventDefault();
            const payload = this.post
            payload.createdBy = this.user
            payload.createdAt = dateTime.toISOString(),
                payload.deletedAt = null
            this.$store.dispatch('posts/createPost', payload)
                .then(() => {
                    this.saving = false
                    this.show = false
                    this.$toasted.success('Artículo creado', {
                        theme: "bubble",
                        position: "top-right",
                        duration: 2000
                    })
                    this.post = {
                        title: "",
                        type: "",
                        author: '',
                        content: "",
                        resume: "",
                        active: true,
                        img: null,
                        imgPath: "",

                    },
                        this.$emit('finish');
                })
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
