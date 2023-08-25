<template>
<v-dialog v-model="show" persistent width="950px">
    <v-toolbar dense flat color="primary" dark>
        <v-toolbar-title>{{$t('banners.edit_banner')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="minimizeBrandDialog()">
                    <v-icon>mdi-window-minimize</v-icon>
                </v-btn>
            </template>
            <span>{{ $t("minimize") }}</span>
        </v-tooltip>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="cancelBrandDialog()">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </template>
            <span>{{ $t("cancel") }}</span>
        </v-tooltip>
    </v-toolbar>
    <v-card flat tile class="card-surface pt-2">
        <v-form v-model="validBrand" v-on:submit.prevent="updateBrand">
            <v-card-text>
                <v-container>
                    <v-row dense>
                        <v-col>
                            <v-text-field dense outlined class="body-1" background-color="foreground" required :rules="rulesGlobal.required" v-model="bannerEditable.name" label="Nombre" color="secondary"></v-text-field>
                            <v-select dense outlined class="body-1" background-color="foreground" v-model="bannerEditable.category"  :items="categories" return-object item-text="name" label="Categoria" color="secondary"></v-select>
                            <v-text-field dense outlined class="body-1" background-color="foreground" v-model="bannerEditable.url" label="Link" color="secondary"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <h5 class="body-1 pa-3">Imagen desktop</h5>
                            <v-file-input dense v-model="bannerEditable.file" placeholder="Seleccione su archivos" accept="image/*" color="secondary" background-color="foreground" outlined prepend-icon="mdi-paperclip"  @change="fileInput" :disabled="processingImg">
                            </v-file-input>
                            <v-row dense>
                                <v-col cols="3">
                                    <span v-if="progress > 0 && progress < 100">Subiendo archivo...</span>
                                    <span v-if="progress == 100" class="success--text">Archivo subido</span>
                                </v-col>
                                <v-col>
                                    <v-progress-linear class="my-3" :value="progress" :buffer-value="100" :color="(progress == 100) ? 'success' : 'primary'" v-if="progress > 0 && progress < 100"></v-progress-linear>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col>
                            <h5 class="body-1 pa-3">Imagen mobile</h5>
                            <v-file-input dense v-model="bannerEditable.fileMobile" placeholder="Seleccione su archivos" accept="image/*" color="secondary" background-color="foreground" outlined prepend-icon="mdi-paperclip"  @change="fileInputMobile" :disabled="processingImg">
                            </v-file-input>
                            <v-row dense>
                                <v-col cols="3">
                                    <span v-if="progress > 0 && progress < 100">Subiendo archivo...</span>
                                    <span v-if="progress == 100" class="success--text">Archivo subido</span>
                                </v-col>
                                <v-col>
                                    <v-progress-linear class="my-3" :value="progress" :buffer-value="100" :color="(progress == 100) ? 'success' : 'primary'" v-if="progress > 0 && progress < 100"></v-progress-linear>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions class="justify-center background">
                <v-btn large color="primary" type="submit" :disabled="!validBrand || processingImg" depressed>{{$t('save')}}</v-btn>
            </v-card-actions>
        </v-form>
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
        banner: {
            type: Object,
            required: true
        },
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            validBrand: false,
            processingImg: false,
            fileURL: null,
            progress: 0,
            newImagePath: null,
            newImageMobilePath: null
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
            categories: "banners/getBannersCategories"
        }),
        bannerEditable: {
            get() {
                return this.deepCopy(this.banner)
            },
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.listBannersCategories()
            } 
        }
    },
    methods: {
        listBannersCategories() {
            this.$store.dispatch('banners/getBannersCategories')
        },
        minimizeBrandDialog() {
            this.$emit("minimize");
            this.show = false;
        },
        cancelBrandDialog() {
            this.$dialog.show({
                name: `${this.$t("confirm_dialog.cancel_edit_banner")}`,
                text: `${this.$t("confirm_dialog.confirm_cancel")} ${this.$t(
          "confirm_dialog.edit_banner"
        )}`,
                buttons: [{
                    text: this.$t("accept"),
                    color: "primary",
                    handle: () => {
                        this.$dialog.hide();
                        this.show = false;
                        this.$emit("cancel");
                    },
                }, ],
            });
        },
        updateBrand() {
            if(this.newImagePath != null) {
                this.bannerEditable.image = this.newImagePath
            }
            if(this.newImageMobilePath != null) {
                this.bannerEditable.imageMobile = this.newImageMobilePath
            }
            this.$fire.firestore.collection('banners').doc(this.bannerEditable.id).update({
                name: this.bannerEditable.name,
                category: this.bannerEditable.category,
                url: this.bannerEditable.url,
                image: this.bannerEditable.image,
                imageMobile: this.bannerEditable.imageMobile
            }).then(result => {
                this.$toasted.success('Brando editado', {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
                this.show = false,
                    this.$emit('finish')
            }, error => [
                this.$toasted.error(error, {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
            ])

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
                    imgData.append("image", this.bannerEditable.image);
                    const filePath = `${Date.now()}-${file.name}`;
                    this.newImagePath = filePath
                    await this.$fire.storage.ref()
                    .child('banners')
                        .child(filePath)
                        .put(this.bannerEditable.image);
                        console.log(filePath)
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.processingImg = false;
            }
        },
        async fileInputMobile(file) {
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
                    imgData.append("image", this.bannerEditable.imageMobile);
                    const filePath = `${Date.now()}-${file.name}`;
                    this.newImageMobilePath = filePath
                    await this.$fire.storage.ref()
                    .child('banners')
                        .child(filePath)
                        .put(this.bannerEditable.imageMobile);
                        console.log(filePath)
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
