<template>
<v-container>
    <v-row align="center">
        <v-col cols="6">
            <h2> {{ $t("brands.title") }}</h2>
        </v-col>
        <v-col class="text-right">

        </v-col>
    </v-row>
    <v-row>
        <v-col cols="4">
            <v-text-field v-model="searchBrands" :label="$t('search')" solo hide-details append-icon="mdi-table-search" color="secondary">
            </v-text-field>
        </v-col>
        <v-col class="text-right">
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on" v-show="minimizedBrandDialog" outlined color="primary" @click="maximizeNewBrand()">
                        {{ $t("brands.restore_brand") }}
                    </v-btn>
                </template>
                <span> {{ $t("brands.restore_brand") }}</span>
            </v-tooltip>
            <v-btn depressed color="primary" @click="newBrand()">
                <v-icon>mdi-plus</v-icon> Nueva marca
            </v-btn>
        </v-col>
    </v-row>
    <v-card flat outlined class="card-table mt-4">
        <v-skeleton-loader class="mx-auto" type=" table: table-heading, table-thead, table-tbody, table-tfoot" :loading="loading">
            <v-data-table :items="brands" :headers="brandsHeaders" :search="searchBrands" sort-by="brandid" sort-desc class="body-2">
                <template v-slot:[`item.user`]="{item}">
                    {{ item.user }}
                </template>
                <template v-slot:[`item.status`]="{item}">
                    <v-chip :color="getStatusColor(item.status)" small>{{ $t('brands.status.'+item.status)}}</v-chip>
                </template>
                <template v-slot:[`item.image`]="{item}">
                        <v-img cover max-width="120px" max-height="40px" :src="$config.storage+'brands%2F' + item.image + '?alt=media'"></v-img>
                    </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top content-class="top">
                        <template v-slot:activator="{ on }">
                            <v-btn icon color="primary" v-on="on" @click="updateBrand(item)" :disabled="item.status == 3">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("brands.edit_brand") }}</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                        <template v-slot:activator="{ on }">
                            <v-btn icon color="error" v-on="on" @click="deleteBrand(item)" :disabled="item.status == 3">
                                <v-icon color="error">delete</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("brands.delete_brand") }}</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                        <template v-slot:activator="{ on }">
                            <v-btn icon color="primary" v-on="on" @click="copyUrl(item.id)" :disabled="item.status == 3">
                                <v-icon color="primary">mdi-content-copy</v-icon>
                            </v-btn>
                        </template>
                        <span>Copiar url para iframe</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-skeleton-loader>
    </v-card>
    <BrandsUpdateBrandDialog v-model="updateBrandDialog" :brand="brandSelected" :user="user" v-if="brandSelected != null" @finish="listBrands()" @minimize="minimizeBrandDialog()" @cancel="cancelBrandDialog()" />
    <BrandsNewBrandDialog v-model="newBrandDialog" :user="user" @finish="listBrands()" @minimize="minimizeBrandDialog()" @cancel="cancelBrandDialog()" />
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
            searchBrands: '',
            loading: false,
            newBrandDialog: false,
            updateBrandDialog: false,
            viewBrandDialog: false,
            minimizedBrandDialog: false,
            brandsHeaders: [{
                    text: 'Nombre',
                    value: 'name',
                },
                {
                    text: 'Imagen',
                    value: 'image',
                },
                {
                    text: this.$t('category'),
                    value: 'category.name',
                },
                {
                    text: this.$t('brands.created_by'),
                    value: 'user.name',
                },
                {
                    text: this.$t('status'),
                    value: 'status',
                },
                {
                    text: '',
                    value: 'actions',
                }
            ],
            brandSelected: null,
            deletedBrands: null,
        }
    },
    computed: {
        ...mapGetters({
            brands: "brands/getBrands",
        }),
        user() {
            return this.$store.state.authUser;
        }
    },
    mounted() {
        this.listBrands()
    },
    methods: {
        listBrands() {
            this.$store.dispatch('brands/getBrands')
        },
        newBrand() {
            this.newBrandDialog = true
        },
        minimizeBrandDialog() {
            this.minimizedBrandDialog = true
        },
        maximizeBrandDialog() {
            this.newBrandDialog = true
            this.minimizedBrandDialog = false
        },
        cancelBrandDialog() {
            this.minimizedBrandDialog = false
            this.listBrands()
        },
        viewBrand(item) {
            this.brandSelected = item
            this.viewBrandDialog = true
        },
        updateBrand(item) {
            this.brandSelected = item
            this.updateBrandDialog = true
        },
        deleteBrand(item) {
            this.$dialog.show({
                name: `${this.$t("confirm_dialog.delete_brand")}`,
                text: `${this.$t("confirm_dialog.confirm_cancel")} ${this.$t(
          "confirm_dialog.delete_brand"
        )}`,
                buttons: [{
                    text: this.$t("accept"),
                    color: "primary",
                    handle: () => {
                        this.$dialog.hide();
                        this.deleteBrandConfirm(item)
                    },
                }, ],
            });
        },
        deleteBrandConfirm(item) {
            const dateTime = new Date()
            this.$fire.firestore.collection('brands').doc(item.id).update({
                deletedAt: dateTime.toISOString()
            }).then(result => {
                this.$toasted.success('Marca eliminada', {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
                this.listBrands()
            }, error => [
                this.$toasted.error(error, {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
            ])
        }
    }
}
</script>
