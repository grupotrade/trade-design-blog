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
                            <v-select dense label="Categoría *" v-model="postEditable.type" :items="types" item-text="name"
                                return-object :rules="rules.required" required outlined color="secondary"></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field dense label="Autor" v-model="postEditable.author" outlined color="secondary">
                            </v-text-field>
                        </v-col>

                    </v-row>
                    <v-text-field dense label="Título *" v-model="postEditable.title" :rules="rules.required" required
                        outlined color="secondary">
                    </v-text-field>
                    <v-textarea dense label="Resumen" v-model="postEditable.resume" outlined color="secondary">
                    </v-textarea>
                    <p class="mt-2">Contenido *</p>
                    <client-only>
                        <VueEditor v-model="postEditable.content" @text-change="updateEditorContent" />
                    </client-only>
                    <h4 class="body-1 my-2">Imagen</h4>
                    <v-row>
                        <v-col>
                            <v-file-input v-model="postEditable.img" :placeholder="$t('upload')" @change="fileInput"
                                outlined :disabled="processingImg">
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
                            <v-btn depressed color="primary" :disabled="!editPostForm || postEditable.content == ''"
                                @click="updatePost">
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
            postEditable: {},
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
                this.postEditable = this.deepCopy(this.post)
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
        updatePost(event) {
            this.saving = true
            event.preventDefault();
            if (this.postEditable.imgPath == null) {
                this.postEditable.imgPath = this.postEditable.img
            }
            this.$fire.firestore
                .collection("posts")
                .doc(this.id)
                .update({
                    title: this.postEditable.title,
                    content: this.postEditable.content,
                    resume: this.postEditable.resume,
                    type: this.postEditable.type,
                    img: this.postEditable.imgPath
                })
                .then(() => {
                    this.saving = false
                    this.$emit('finish');
                    this.postEditable = {
                        title: "",
                        author: "",
                        type: "",
                        resume: "",
                        content: "",
                        img: null,
                    }
                    this.show = false;
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
                    imgData.append("image", this.postEditable.img);
                    const filePath = `${Date.now()}-${file.name}`;
                    const metadata = {
                        contentType: this.postEditable.img.type
                    };
                    this.postEditable.imgPath = filePath
                    await this.$fire.storage.ref()
                        .child('posts')
                        .child(filePath)
                        .put(this.postEditable.img, metadata);
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
