<template>
<v-dialog v-model="show" width="950px">
    <v-toolbar dense flat color="primary" dark>
        <v-toolbar-title>{{$t('brands.new_brand')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="minimizeNewBrandDialog()">
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
        <v-form v-model="validBrand" v-on:submit.prevent="saveBrand">
            <v-card-text>
                <v-container>
                    <v-row dense>
                        <v-col>
                            <v-text-field dense outlined class="body-1" background-color="foreground" required :rules="rulesGlobal.required" v-model="brand.name" label="Nombre" color="secondary"></v-text-field>
                            <v-select dense outlined class="body-1" background-color="foreground" v-model="brand.category" :items="categories" return-object item-text="name" label="Categoría" color="secondary"></v-select>
                            <v-text-field dense outlined class="body-1" background-color="foreground" v-model="brand.url" label="Link" color="secondary"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <h5 class="body-1 pa-3">Logo</h5>
                            <v-file-input dense v-model="brand.file" placeholder="Seleccione su archivo" accept="image/*" color="secondary" background-color="foreground" outlined prepend-icon="mdi-paperclip"  @change="fileInput" :disabled="processingImg">
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
            categories: "brands/getBrandsCategories"
        })
    },
    watch: {
        value(val) {
            if (val) {
                this.listBrandsCategories()
            } 
        }
    },
    data() {
        return {
            validBrand: false,
            processingImg: false,
            fileURL: null,
            progress: 0,
            brand: {
                name: '',
                category: '',
                description: '',
                image: null,
                imagePath: "",
                url: '',
            }

        }
    },
    methods: {
        listBrandsCategories() {
            this.$store.dispatch('brands/getBrandsCategories')
        },
        minimizeNewBrandDialog() {
            this.$emit("minimize");
            this.show = false;
        },
        cancelBrandDialog() {
            this.$dialog.show({
                name: `${this.$t("confirm_dialog.cancel_new_brand")}`,
                text: `${this.$t("confirm_dialog.confirm_cancel")} ${this.$t(
          "confirm_dialog.new_brand"
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
        saveBrand: function (e) {
            e.preventDefault()
            const brandsRef = this.$fire.firestore.collection("brands")
            const dateTime = new Date()
            brandsRef.add({
                name: this.brand.name,
                category: this.brand.category,
                url: this.brand.url,
                image: this.brand.imagePath,
                date: dateTime.toISOString(),
                deletedAt: null,
                status: 1,
                user: {
                    name: this.user.displayName,
                    id: this.user.uid
                },
            }, )
            this.brand = {
                name: '',
                category: '',
                description: '',
                image: null,
                imagePath: "",
                url: '',
            }
            this.success = true
            this.show = false;
            this.$emit('finish', this.user)
            this.$toasted.success('Marca cargada', {
                theme: "bubble",
                position: "top-right",
                duration: 2000
            })
        },
        async fileInput(file) {
            try {
                if (file && file.name) {
                    this.processingImg = true;
                    const filePath = `${Date.now()}-${file.name}`;
                    this.brand.imagePath = filePath
                    await this.$fire.storage.ref()
                    .child('brands')
                        .child(filePath)
                        .put(file);
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
