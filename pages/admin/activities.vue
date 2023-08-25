<template>
    <v-container fluid>
        <v-row align="center">
            <v-col cols="6">
                <h2>{{ $t("activities.title") }}</h2>
            </v-col>
            <v-col class="text-right">
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" v-show="iconMinimizeNewActivity" outlined color="primary"
                            @click="maximizeNewActivity()">
                            {{ $t("activities.restore_new_activity") }}
                        </v-btn>
                    </template>
                    <span> {{ $t("activities.restore_activity") }}</span>
                </v-tooltip>
                <v-btn class="primary" depressed @click="newActivity()" :disabled="iconMinimizeNewActivity"
                    :dark="!iconMinimizeNewActivity">
                    {{ $t("activities.new_activity") }}
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader class="mx-auto" type=" table: table-heading, table-thead, table-tbody, table-tfoot"
                    :loading="loading">

                    <v-data-table :items="activities" :headers="activitiesHeaders" hide-default-footer>
                        <template v-slot:item.createdAt="{ item }">
                            {{ $moment(item.createdAt).format('DD/MM/YYYY') }}
                        </template>
                        <template v-slot:item.celula="{ item }">
                            {{ item.celula.name }}
                        </template>
                        <template v-slot:item.sinopsis="{ item }">
                            {{ item.sinopsis.substring(0, 55) }}...
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="editActivity(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t("edit") }}</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="deleteActivity(item.id)">
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
        <v-dialog v-model="newActivityDialog" width="1240px" persistent>
            <v-toolbar dense flat class="midground">
                <v-toolbar-title>{{ $t('activities.new_activity') }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="minimizeNewActivity()">
                            <v-icon>mdi-window-minimize</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('minimize') }}</span>
                </v-tooltip>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="cancelNewActivity()">
                            <v-icon>mdi-window-close</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('cancel') }}</span>
                </v-tooltip>
            </v-toolbar>
            <v-card flat tile class="pt-4">
                <v-card-text>
                    <v-form v-model="newActivityForm" method="POST" @submit="createActivity">
                        <v-row>
                            <v-col>
                                <v-row dense>
                                    <v-col>
                                        <v-select dense label="Célula" v-model="activity.celula" :items="celulas"
                                            item-text="name" return-object :rules="rules.required" required outlined
                                            color="secondary"></v-select>
                                    </v-col>
                                    <v-col>
                                        <v-select dense label="Profesional" v-model="activity.professional"
                                            :items="professionals" item-text="name" return-object :rules="rules.required"
                                            required outlined color="secondary"></v-select>
                                    </v-col>
                                </v-row>
                                <v-text-field dense label="Título" v-model="activity.title" :rules="rules.required" required
                                    outlined color="secondary">
                                </v-text-field>
                                <p>Sinopis</p>
                                <client-only>
                                    <VueEditor v-model="activity.sinopsis" :editor-toolbar="customToolbar"
                                        :rules="rules.required" required />
                                </client-only>
                                <v-row dense class="mt-3">
                                    <v-col>
                                        <v-text-field dense label="Audiencia" v-model="activity.audience" outlined
                                            color="secondary">
                                        </v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field dense label="Duración" v-model="activity.duration" outlined
                                            color="secondary">
                                        </v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field dense label="Fecha inicio" v-model="activity.date" type="date"
                                            outlined color="secondary">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <p>Perfil del graduado</p>
                                <client-only>
                                    <VueEditor v-model="activity.graduateProfile" :editor-toolbar="customToolbar"
                                        :rules="rules.required" required />
                                </client-only>
                                <h4 class="body-1 my-2">Imagen / Video</h4>
                                <v-row>
                                    <v-col>
                                        <v-file-input dense v-model="image" :placeholder="$t('upload')" outlined
                                            @change="fileInput($event)" :disabled="processingImg">
                                            <template v-slot:append-outer>
                                                <v-progress-circular v-if="processingImg" color="grey" indeterminate
                                                    small />
                                            </template>
                                        </v-file-input>
                                    </v-col>
                                    <v-col>
                                        <v-text-field dense label="URL de video" v-model="activity.video"
                                            :disabled="activity.videoProvider == null" hide-details outlined
                                            color="secondary">
                                        </v-text-field>
                                        <v-radio-group v-model="activity.videoProvider" row dense>
                                            <v-radio label="Youtube" value="youtube"></v-radio>
                                            <v-radio label="Vimeo" value="cimeo"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col>
                                <v-row dense>
                                    <v-col cols="12">
                                        <p>Materiales provistos</p>
                                        <client-only>
                                            <VueEditor v-model="activity.materialProvided" :editor-toolbar="customToolbar"
                                                :rules="rules.required" required />
                                        </client-only>
                                    </v-col>
                                    <v-col>
                                        <p>Materiales no provistos</p>
                                        <client-only>
                                            <VueEditor v-model="activity.materialNotProvided"
                                                :editor-toolbar="customToolbar" :rules="rules.required" required />
                                        </client-only>
                                    </v-col>
                                </v-row>
                                <p class="mt-2">Productos</p>
                                <client-only>
                                    <VueEditor v-model="activity.products" :editor-toolbar="customToolbar"
                                        :rules="rules.required" required />
                                </client-only>

                            </v-col>
                            <v-col cols="12" class="text-right">
                                <v-btn depressed color="primary" :disabled="!newActivityForm" type="submit">
                                    {{ $t('save') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editActivityDialog" width="1240px" persistent>
            <v-toolbar dense flat class="midground">
                <v-toolbar-title>{{ $t('activities.edit_activity') }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="minimizeEditActivity()">
                            <v-icon>mdi-window-minimize</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('minimize') }}</span>
                </v-tooltip>
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" @click="cancelEditActivity()">
                            <v-icon>mdi-window-close</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('cancel') }}</span>
                </v-tooltip>
            </v-toolbar>
            <v-card flat tile class="pt-4">
                <v-card-text>
                    <v-form v-model="editActivityForm">
                        <v-row>
                            <v-col>
                                <v-row dense>
                                    <v-col>
                                        <v-select dense label="Célula" v-model="activityEditable.celula" :items="celulas"
                                            item-text="name" return-object :rules="rules.required" required outlined
                                            color="secondary"></v-select>
                                    </v-col>
                                    <v-col>
                                        <v-select dense label="Profesional" v-model="activityEditable.professional"
                                            :items="professionals" item-text="name" return-object :rules="rules.required"
                                            required outlined color="secondary"></v-select>
                                    </v-col>
                                </v-row>
                                <v-text-field dense label="Título" v-model="activityEditable.title" :rules="rules.required"
                                    required outlined color="secondary">
                                </v-text-field>
                                <p>Sinopis</p>
                                <client-only>
                                    <VueEditor v-model="activityEditable.sinopsis" :editor-toolbar="customToolbar"
                                        :rules="rules.required" required />
                                </client-only>
                                <v-row dense class="mt-3">
                                    <v-col>
                                        <v-text-field dense label="Audiencia" v-model="activityEditable.audience" outlined
                                            color="secondary">
                                        </v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field dense label="Duración" v-model="activityEditable.duration" outlined
                                            color="secondary">
                                        </v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field dense label="Fecha inicio" v-model="activityEditable.date" type="date"
                                            outlined color="secondary">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <p>Perfil del graduado</p>
                                <client-only>
                                    <VueEditor v-model="activityEditable.graduateProfile" :editor-toolbar="customToolbar"
                                        :rules="rules.required" required />
                                </client-only>
                                <h4 class="body-1 my-2">Imagen / Video</h4>
                                <v-row>
                                    <v-col>
                                        <v-file-input dense v-model="image" :placeholder="$t('upload')" outlined
                                            @change="fileInput($event)" :disabled="processingImg">
                                            <template v-slot:append-outer>
                                                <v-progress-circular v-if="processingImg" color="grey" indeterminate
                                                    small />
                                            </template>
                                        </v-file-input>
                                    </v-col>
                                    <v-col>
                                        <v-text-field dense label="URL de video" v-model="activityEditable.video"
                                            :disabled="activityEditable.videoProvider == null" hide-details outlined
                                            color="secondary">
                                        </v-text-field>
                                        <p v-if="activityEditable.videoProvider == 'vimeo'">Ingrese la url con un formato
                                            similar a: https://vimeo.com/816267552</p>
                                        <v-radio-group v-model="activityEditable.videoProvider" row dense>
                                            <v-radio label="Youtube" value="youtube"></v-radio>
                                            <v-radio label="Vimeo" value="vimeo"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col>
                                <v-row dense>
                                    <v-col cols="12">
                                        <p>Materiales provistos</p>
                                        <client-only>
                                            <VueEditor v-model="activityEditable.materialProvided"
                                                :editor-toolbar="customToolbar" :rules="rules.required" required />
                                        </client-only>
                                    </v-col>
                                    <v-col>
                                        <p>Materiales no provistos</p>
                                        <client-only>
                                            <VueEditor v-model="activityEditable.materialNotProvided"
                                                :editor-toolbar="customToolbar" :rules="rules.required" required />
                                        </client-only>

                                    </v-col>
                                </v-row>
                                <p class="mt-2">Productos</p>
                                        <client-only>
                                            <VueEditor v-model="activityEditable.products"
                                                :editor-toolbar="customToolbar" :rules="rules.required" required />
                                        </client-only>
                                
                            </v-col>
                            <v-col cols="12" class="text-right">
                                <v-btn depressed color="primary" :disabled="!editActivityForm" @click="editActivityFb">
                                    {{ $t('save') }}
                                </v-btn>
                            </v-col>
                        </v-row>

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
            newActivityForm: false,
            newActivityDialog: false,
            editActivityDialog: false,
            editActivityForm: false,
            iconMinimizeNewActivity: false,
            activeActivity: null,
            processingImg: false,
            activitiesHeaders: [{
                text: "Fecha",
                align: "start",
                value: "createdAt",
            }, {
                text: "Célula",
                align: "start",
                value: "celula",
            }, {
                text: "Título",
                align: "start",
                value: "title",
            },
            {
                text: "Sinopsis",
                align: "start",
                value: "sinopsis",
            },
            {
                text: "Profesional",
                align: "start",
                value: "professional.name",
            },
            {
                text: "",
                align: "start",
                value: "actions",
            },
            ],
            activity: {
                title: "",
                professional: {},
                celula: "",
                audience: "",
                duration: "",
                sinopsis: "",
                date: "",
                graduateProfile: "",
                materialProvided: "",
                materialNotProvided: "",
                products: "",
                active: true,
                video: "",
                videoProvider: null,

            },
            imgPath: '',
            image: null,
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
            celulas: "celulas/getCelulas",
            activities: "activities/getActivities",
            professionals: "professionals/getProfessionals"
        }),
        user() {
            return this.$store.state.authUser;
        },
        activityEditable: {
            get() {
                return this.deepCopy(this.activity)
            },
        }
    },
    mounted() {
        this.listActivities()
        this.getProfessionals()
    },
    methods: {
        async listActivities() {
            this.loading = true
            this.$store.dispatch('activities/getActivities')
                .then(() => {
                    this.loading = false
                })
        },
        async getProfessionals() {
            this.$store.dispatch('professionals/getProfessionals')
                .then(() => { })
        },
        newActivity() {
            this.$store.dispatch('activities/getActivityTypes')
                .then(() => {
                    this.newActivityDialog = true;
                })

        },
        minimizeNewActivity() {
            this.newActivityDialog = false;
            this.iconMinimizeNewActivity = true
        },
        maximizeNewActivity() {
            this.newActivityDialog = true;
        },
        cancelNewActivity() {
            this.$dialog.show({
                title: `${this.$t('confirm_dialog.cancel_new_activity')}`,
                text: `${this.$t('confirm_dialog.confirm_cancel')} ${this.$t('confirm_dialog.new_activity')}`,
                buttons: [{
                    text: 'Sí, cancelar',
                    color: 'primary',
                    handle: () => {
                        this.$dialog.hide()
                        this.iconMinimizeNewActivity = false
                        this.newActivityDialog = false
                    }
                }]
            })
        },
        cancelEditActivity() {
            this.$dialog.show({
                title: `${this.$t('confirm_dialog.cancel_edit_activity')}`,
                text: `${this.$t('confirm_dialog.confirm_cancel')} ${this.$t('confirm_dialog.edit_activity')}`,
                buttons: [{
                    text: 'Sí, cancelar',
                    color: 'primary',
                    handle: () => {
                        this.$dialog.hide()
                        this.iconMinimizeEditActivity = false
                        this.editActivityDialog = false
                    }
                }]
            })
        },
        createActivity(event) {
            this.loading = true
            const dateTime = new Date()
            this.activity.image = this.imgPath
            event.preventDefault();
            const payload = this.activity
            payload.createdBy = this.user
            if (payload.date) {
                payload.date = this.$moment(payload.date).format()
            }
            payload.createdAt = dateTime.toISOString(),
                payload.deletedAt = null
            this.$store.dispatch('activities/createActivity', payload)
                .then(() => {
                    this.loading = false
                    this.newActivityDialog = false
                    this.$toasted.success('Actividad creada', {
                        theme: "bubble",
                        position: "top-right",
                        duration: 2000
                    })
                    this.activity = {
                        title: "",
                        professional: {},
                        celula: "",
                        audience: "",
                        duration: "",
                        date: "",
                        sinopsis: "",
                        graduateProfile: "",
                        materialProvided: "",
                        materialNotProvided: "",
                        products: "",
                        active: true,
                        video: "",
                        videoProvider: null
                    },
                        this.imgPath = '',
                        this.image = null,
                        this.listActivities();
                })
        },
        editActivity(item) {
            this.editActivityDialog = true
            this.activity = item
            this.activeActivity = item.id
        },
        editActivityFb(event) {
            event.preventDefault();
            if (this.imgPath == null) {
                this.imgPath = this.activityEditable.image
            }
            if (this.activityEditable.date) {
                this.activityEditable.date = this.$moment(this.activityEditable.date).format()
            } else {
                this.activityEditable.date = null
            }
            this.$fire.firestore
                .collection("activities")
                .doc(this.activeActivity)
                .update({
                    title: this.activityEditable.title,
                    professional: this.activityEditable.professional,
                    celula: this.activityEditable.celula,
                    date: this.activityEditable.date,
                    audience: this.activityEditable.audience,
                    duration: this.activityEditable.duration,
                    sinopsis: this.activityEditable.sinopsis,
                    graduateProfile: this.activityEditable.graduateProfile,
                    materialProvided: this.activityEditable.materialProvided,
                    materialNotProvided: this.activityEditable.materialNotProvided,
                    products: this.activityEditable.products,
                    image: this.imgPath,
                })
                .then(() => {
                    this.listActivities();
                    this.editActivityDialog = false;
                    this.image = null
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        deleteActivity(doc) {
            if (confirm("¿Está seguro?")) {
                this.$fire.firestore
                    .collection("activities")
                    .doc(doc)
                    .delete()
                    .then(() => {
                        this.listActivities();
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
                    imgData.append("image", this.image);
                    const filePath = `${Date.now()}-${file.name}`;
                    const metadata = {
                        contentType: this.image.type
                    };
                    this.imgPath = filePath
                    await this.$fire.storage.ref()
                        .child('activities')
                        .child(filePath)
                        .put(this.image, metadata);
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

.activities {
    max-width: 1240px !important;
    margin: 150px auto 0 !important;
}
</style>
