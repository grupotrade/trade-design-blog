<template>
<v-container fluid>
    <v-row align="center">
        <v-col cols="6">
            <h2>{{ $t("tips.title") }}</h2>
        </v-col>
        <v-col class="text-right">
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on" v-show="iconMinimizeNewTip" outlined color="primary" @click="maximizeNewTip()">
                        {{ $t("tips.restore_new_tip") }}
                    </v-btn>
                </template>
                <span> {{ $t("tips.restore_tip") }}</span>
            </v-tooltip>
            <v-btn class="primary" depressed @click="newTip()" :disabled="iconMinimizeNewTip" :dark="!iconMinimizeNewTip">
                {{ $t("tips.new_tip") }}
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-skeleton-loader class="mx-auto" type=" table: table-heading, table-thead, table-tbody, table-tfoot" :loading="loading">

                <v-data-table :items="tips" :headers="tipsHeaders" hide-default-footer>
                    <template v-slot:item.createdAt="{ item }">
                        {{$moment(item.createdAt).format('DD/MM/YYYY')}}
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
                                <v-btn icon v-on="on" @click="editTip(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("edit") }}</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" @click="deleteTip(item.id)">
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
    <v-dialog v-model="newTipDialog" width="750px" persistent>
        <v-toolbar dense flat class="midground">
            <v-toolbar-title>{{$t('tips.new_tip')}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn depressed icon v-on="on" @click="minimizeNewTip()">
                        <v-icon>mdi-window-minimize</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('minimize')}}</span>
            </v-tooltip>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn depressed icon v-on="on" @click="cancelNewTip()">
                        <v-icon>mdi-window-close</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('cancel')}}</span>
            </v-tooltip>
        </v-toolbar>
        <v-card flat tile class="pt-4">
            <v-card-text>
                <v-form v-model="newTipForm" method="POST" @submit="createTip">
                    <v-row>
                        <v-col>
                            <v-combobox dense label="Etiqueta" v-model="tip.tags" multiple clearable small-chips persistent-hint hint="Seleccione etiquetas o agregue una nueva presionando la tecla Enter" :items="distinctTags" item-text="name" return-object outlined color="secondary"></v-combobox>
                        </v-col>
                    </v-row>
                    <v-text-field dense label="Título" v-model="tip.title" :rules="rules.required" required outlined color="secondary">
                    </v-text-field>
                    <p>Descripción</p>
                                <client-only>
                                    <VueEditor v-model="tip.resume" :editor-toolbar="customToolbar"
                                    />
                                </client-only>
                    <h4 class="body-1 my-2">Video</h4>
                    <v-text-field dense label="URL de video" v-model="tip.video" :disabled="tip.videoProvider == null" hide-details outlined color="secondary">
                    </v-text-field>
                    <p v-if="tip.videoProvider == 'vimeo'">Ingrese la url con un formato similar a: https://vimeo.com/816267552</p>
                    <v-radio-group v-model="tip.videoProvider" row dense>
                        <v-radio label="Youtube" value="youtube"></v-radio>
                        <v-radio label="Vimeo" value="vimeo"></v-radio>
                    </v-radio-group>
                    <v-btn depressed color="primary" :disabled="!newTipForm" type="submit">
                        {{$t('save')}}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="editTipDialog" width="750px" persistent>
        <v-toolbar dense flat class="midground">
            <v-toolbar-title>{{$t('tips.edit_tip')}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn depressed icon v-on="on" @click="minimizeEditTip()">
                        <v-icon>mdi-window-minimize</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('minimize')}}</span>
            </v-tooltip>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn depressed icon v-on="on" @click="cancelEditTip()">
                        <v-icon>mdi-window-close</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('cancel')}}</span>
            </v-tooltip>
        </v-toolbar>

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
            newTipForm: false,
            newTipDialog: false,
            editTipDialog: false,
            editTipForm: false,
            iconMinimizeNewTip: false,
            activeTip: null,
            processingImg: false,
            tipsHeaders: [{
                    text: "Fecha",
                    align: "start",
                    value: "createdAt",
                }, {
                    text: "Etiquetas",
                    align: "start",
                    value: "tags",
                }, {
                    text: "Título",
                    align: "start",
                    value: "title",
                },
                {
                    text: "URL Video",
                    align: "start",
                    value: "video",
                },
                {
                    text: "",
                    align: "start",
                    value: "actions",
                },
            ],
            tip: {
                title: "",
                tags: "",
                resume: "",
                active: true,
                video: null,
                videoProvider: null,

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
            tips: "tips/getTips"
        }),
        user() {
            return this.$store.state.authUser;
        },
        distinctTags() {
            const tagsSet = new Set();
            this.tips.forEach(item => {
                item.tags.forEach(tag => {
                    tagsSet.add(tag);
                });
            });
            return [...tagsSet];
        },
    },
    mounted() {
        this.listTips();
    },
    methods: {
        async listTips() {
            this.loading = true
            this.$store.dispatch('tips/getTips')
                .then(() => {
                    this.loading = false
                })
        },
        newTip() {
            this.newTipDialog = true;
        },
        minimizeNewTip() {
            this.newTipDialog = false;
            this.iconMinimizeNewTip = true
        },
        maximizeNewTip() {
            this.newTipDialog = true;
        },
        cancelNewTip() {
            this.$dialog.show({
                title: `${this.$t('confirm_dialog.cancel_new_tip')}`,
                text: `${this.$t('confirm_dialog.confirm_cancel')} ${this.$t('confirm_dialog.new_tip')}`,
                buttons: [{
                    text: 'Sí, cancelar',
                    color: 'primary',
                    handle: () => {
                        this.$dialog.hide()
                        this.iconMinimizeNewTip = false
                        this.newTipDialog = false
                    }
                }]
            })
        },
        cancelEditTip() {
            this.$dialog.show({
                title: `${this.$t('confirm_dialog.cancel_edit_tip')}`,
                text: `${this.$t('confirm_dialog.confirm_cancel')} ${this.$t('confirm_dialog.edit_tip')}`,
                buttons: [{
                    text: 'Sí, cancelar',
                    color: 'primary',
                    handle: () => {
                        this.$dialog.hide()
                        this.iconMinimizeEditTip = false
                        this.editTipDialog = false
                    }
                }]
            })
        },
        createTip(event) {
            this.loading = true
            const dateTime = new Date()
            event.preventDefault();
            const payload = this.tip
            payload.createdBy = this.user
            payload.createdAt = dateTime.toISOString(),
            payload.deletedAt = null
            this.$store.dispatch('tips/createTip', payload)
                .then(() => {
                    this.loading = false
                    this.newTipDialog = false
                    this.$toasted.success('Artículo creado', {
                        theme: "bubble",
                        position: "top-right",
                        duration: 2000
                    })
                    this.listTips();
                })
        },
        editTip(item) {
            this.editTipDialog = true
            this.tip = this.deepCopy(item)
            this.activeTip = item.id
        },
        editTipFb(event) {
            event.preventDefault();
            if (this.tip.imgPath == null) {
                this.tip.imgPath = this.tip.img
            }
            this.$fire.firestore
                .collection("tips")
                .doc(this.activeTip)
                .update({
                    title: this.tip.title,
                    content: this.tip.content,
                    author: this.tip.author,
                    type: this.tip.type,
                    img: this.tip.imgPath,
                    img_color: this.tip.img_color,
                })
                .then(() => {
                    this.listTips();
                    this.editTipDialog = false;
                    this.tip = {
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
        deleteTip(doc) {
            if (confirm("¿Está seguro?")) {
                this.$fire.firestore
                    .collection("tips")
                    .doc(doc)
                    .delete()
                    .then(() => {
                        this.listTips();
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
                    imgData.append("image", this.tip.img);
                    const filePath = `${Date.now()}-${file.name}`;
                    const metadata = {
                        contentType: this.tip.img.type
                    };
                    this.tip.imgPath = filePath
                    await this.$fire.storage.ref()
                        .child(filePath)
                        .put(this.tip.img, metadata);
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

.tips {
    max-width: 1240px !important;
    margin: 150px auto 0 !important;
}
</style>
