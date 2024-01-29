<template>
    <v-container>
        <v-row align="center">
            <v-col cols="6">
                <h2> {{ $t("banners.title") }}</h2>
            </v-col>
            <v-col class="text-right">

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-text-field v-model="searchBanners" :label="$t('search')" solo hide-details append-icon="mdi-table-search"
                    color="secondary">
                </v-text-field>
            </v-col>
            <v-col class="text-right">
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" v-show="minimizedBannerDialog" outlined color="primary"
                            @click="maximizeNewBanner()">
                            {{ $t("banners.restore_banner") }}
                        </v-btn>
                    </template>
                    <span> {{ $t("banners.restore_banner") }}</span>
                </v-tooltip>
                <v-btn depressed color="primary" @click="newBanner()">
                    <v-icon>mdi-plus</v-icon> Nuevo banner
                </v-btn>
            </v-col>
        </v-row>
        <v-card flat outlined class="card-table mt-4">
            <v-skeleton-loader class="mx-auto" type=" table: table-heading, table-thead, table-tbody, table-tfoot"
                :loading="loading">
                <v-data-table :items="banners" :headers="bannersHeaders" :search="searchBanners" sort-by="bannerid"
                    sort-desc class="body-2">
                    <template v-slot:[`item.date`]="{ item }">
                        {{ $moment(item.date).format('DD-MM-YYYY HH:mm') }}
                    </template>
                    <template v-slot:[`item.description`]="{ item }">
                        {{ item.description.substring(0, 30) + '...' }}
                    </template>
                    <template v-slot:[`item.image`]="{ item }">
                        <v-img cover max-width="120px" max-height="40px"
                            :src="$config.storage + '/banners%2F' + item.image + '?alt=media'"></v-img>
                    </template>
                    <template v-slot:[`item.imageMobile`]="{ item }">
                        <v-img cover max-width="120px" max-height="40px"
                            :src="$config.storage + 'banners%2F' + item.imageMobile + '?alt=media'"></v-img>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        {{ item.user }}
                    </template>
                    <template v-slot:[`item.onHome`]="{ item }">
                        <v-switch hide-details dense :input-value="item.onHome" small
                            @change="(item.onHome === true) ? updateOnHome(item, false) : updateOnHome(item, true)"></v-switch>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                        <v-chip :color="getStatusColor(item.status)" small>{{ $t('banners.status.' + item.status) }}</v-chip>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip top content-class="top">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="primary" v-on="on" @click="updateBanner(item)"
                                    :disabled="item.status == 3">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("banners.edit_banner") }}</span>
                        </v-tooltip>
                        <v-tooltip top content-class="top">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="error" v-on="on" @click="deleteBanner(item)"
                                    :disabled="item.status == 3">
                                    <v-icon color="error">delete</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("banners.delete_banner") }}</span>
                        </v-tooltip>
                        <v-tooltip top content-class="top">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="primary" v-on="on" @click="copyUrl(item.id)"
                                    :disabled="item.status == 3">
                                    <v-icon color="primary">mdi-content-copy</v-icon>
                                </v-btn>
                            </template>
                            <span>Copiar url para iframe</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-skeleton-loader>
        </v-card>
        <BannersUpdateBannerDialog v-model="updateBannerDialog" :banner="bannerSelected" :user="user"
            v-if="bannerSelected != null" @finish="listBanners()" @minimize="minimizeBannerDialog()"
            @cancel="cancelBannerDialog()" />
        <BannersNewBannerDialog v-model="newBannerDialog" :user="user" @finish="listBanners()"
            @minimize="minimizeBannerDialog()" @cancel="cancelBannerDialog()" />
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
            searchBanners: '',
            loading: false,
            newBannerDialog: false,
            updateBannerDialog: false,
            viewBannerDialog: false,
            minimizedBannerDialog: false,
            bannersHeaders: [{
                text: 'Nombre',
                value: 'name',
            },
            {
                text: 'Imagen desktop',
                value: 'image',
            },
            {
                text: 'Imagen mobile',
                value: 'imageMobile',
            },
            {
                text: this.$t('category'),
                value: 'category.name',
            },
            {
                text: this.$t('banners.created_by'),
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
            bannerSelected: null,
            deletedBanners: null,
        }
    },
    computed: {
        ...mapGetters({
            banners: "banners/getBanners",
        }),
        user() {
            return this.$store.state.authUser;
        }
    },
    mounted() {
        this.listBanners()
    },
    methods: {
        listBanners() {
            this.$store.dispatch('banners/getBanners')
        },
        newBanner() {
            this.newBannerDialog = true
        },
        async updateOnHome(item, value) {
            console.log(item, value)
            await this.$fire.firestore.collection('banners').doc(item.id).update({
                onHome: value
            }).then(result => {
                this.listBanners()
                this.$snackbar.show({
                    text: 'Marca mostrado en home',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        },
        minimizeBannerDialog() {
            this.minimizedBannerDialog = true
        },
        maximizeBannerDialog() {
            this.newBannerDialog = true
            this.minimizedBannerDialog = false
        },
        cancelBannerDialog() {
            this.minimizedBannerDialog = false
            this.listBanners()
        },
        viewBanner(item) {
            this.bannerSelected = item
            this.viewBannerDialog = true
        },
        updateBanner(item) {
            this.bannerSelected = item
            this.updateBannerDialog = true
        },
        deleteBanner(item) {
            this.$dialog.show({
                name: `${this.$t("confirm_dialog.delete_banner")}`,
                text: `${this.$t("confirm_dialog.confirm_cancel")} ${this.$t(
                    "confirm_dialog.delete_banner"
                )}`,
                buttons: [{
                    text: this.$t("accept"),
                    color: "primary",
                    handle: () => {
                        this.$dialog.hide();
                        this.deleteBannerConfirm(item)
                    },
                },],
            });
        },
        deleteBannerConfirm(item) {
            const dateTime = new Date()
            this.$fire.firestore.collection('banners').doc(item.id).update({
                deletedAt: dateTime.toISOString()
            }).then(result => {
                this.$toasted.success('Marca eliminada', {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
                this.listBanners()
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
    