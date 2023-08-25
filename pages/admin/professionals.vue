<template>
    <v-container>
        <v-row align="center">
            <v-col cols="6">
                <h2> {{ $t("professionals.title") }}</h2>
            </v-col>
            <v-col class="text-right">
    
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-text-field v-model="searchProfessionals" :label="$t('search')" solo hide-details append-icon="mdi-table-search" color="secondary">
                </v-text-field>
            </v-col>
            <v-col class="text-right">
                <v-tooltip bottom content-class="bottom">
                    <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" v-show="minimizedProfessionalDialog" outlined color="primary" @click="maximizeProfessionalDialog()">
                            {{ $t("professionals.restore_professional") }}
                        </v-btn>
                    </template>
                    <span> {{ $t("professionals.restore_professional") }}</span>
                </v-tooltip>
                <v-btn depressed color="primary" @click="newProfessional()">
                    <v-icon>mdi-plus</v-icon> Nuevo profesional
                </v-btn>
            </v-col>
        </v-row>
        <v-card flat outlined class="card-table mt-4">
            <v-skeleton-loader class="mx-auto" type=" table: table-heading, table-thead, table-tbody, table-tfoot" :loading="loading">
                <v-data-table :items="professionals" :headers="professionalsHeaders" :search="searchProfessionals" sort-by="professionalid" sort-desc class="body-2">
                    <template v-slot:[`item.user`]="{item}">
                        {{ item.user }}
                    </template>
                    <template v-slot:[`item.image`]="{item}">
                            <v-img cover max-width="120px" max-height="40px" :src="$config.storage+'professionals%2F' + item.image + '?alt=media'"></v-img>
                        </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip top content-class="top">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="primary" v-on="on" @click="updateProfessional(item)" :disabled="item.status == 3">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("professionals.edit_professional") }}</span>
                        </v-tooltip>
                        <v-tooltip top content-class="top">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="error" v-on="on" @click="deleteProfessional(item)" :disabled="item.status == 3">
                                    <v-icon color="error">delete</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("professionals.delete_professional") }}</span>
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
        <ProfessionalsUpdateProfessionalDialog v-model="updateProfessionalDialog" :professional="professionalSelected" :user="user" v-if="professionalSelected != null" @finish="listProfessionals()" @minimize="minimizeProfessionalDialog()" @cancel="cancelProfessionalDialog()" />
        <ProfessionalsNewProfessionalDialog v-model="newProfessionalDialog" :user="user" @finish="listProfessionals()" @minimize="minimizeProfessionalDialog()" @cancel="cancelProfessionalDialog()" />
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
                searchProfessionals: '',
                loading: false,
                newProfessionalDialog: false,
                updateProfessionalDialog: false,
                viewProfessionalDialog: false,
                minimizedProfessionalDialog: false,
                professionalsHeaders: [{
                        text: 'Nombre',
                        value: 'name',
                    },
                    {
                        text: 'Imagen',
                        value: 'image',
                    },
                    {
                        text: this.$t('name'),
                        value: 'name',
                    },
                    {
                        text: this.$t('professionals.created_by'),
                        value: 'user.name',
                    },
                    {
                        text: '',
                        value: 'actions',
                    }
                ],
                professionalSelected: null,
                deletedProfessionals: null,
            }
        },
        computed: {
            ...mapGetters({
                professionals: "professionals/getProfessionals",
            }),
            user() {
                return this.$store.state.authUser;
            }
        },
        mounted() {
            this.listProfessionals()
        },
        methods: {
            listProfessionals() {
                this.$store.dispatch('professionals/getProfessionals')
            },
            newProfessional() {
                this.newProfessionalDialog = true
            },
            minimizeProfessionalDialog() {
                this.minimizedProfessionalDialog = true
            },
            maximizeProfessionalDialog() {
                this.newProfessionalDialog = true
                this.minimizedProfessionalDialog = false
            },
            cancelProfessionalDialog() {
                this.minimizedProfessionalDialog = false
                this.listProfessionals()
            },
            viewProfessional(item) {
                this.professionalSelected = item
                this.viewProfessionalDialog = true
            },
            updateProfessional(item) {
                this.professionalSelected = item
                this.updateProfessionalDialog = true
            },
            deleteProfessional(item) {
                this.$dialog.show({
                    name: `${this.$t("confirm_dialog.delete_professional")}`,
                    text: `${this.$t("confirm_dialog.confirm_cancel")} ${this.$t(
              "confirm_dialog.delete_professional"
            )}`,
                    buttons: [{
                        text: this.$t("accept"),
                        color: "primary",
                        handle: () => {
                            this.$dialog.hide();
                            this.deleteProfessionalConfirm(item)
                        },
                    }, ],
                });
            },
            deleteProfessionalConfirm(item) {
                const dateTime = new Date()
                this.$fire.firestore.collection('professionals').doc(item.id).update({
                    deletedAt: dateTime.toISOString()
                }).then(result => {
                    this.$toasted.success('Marca eliminada', {
                        theme: "bubble",
                        position: "top-right",
                        duration: 2000
                    })
                    this.listProfessionals()
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
    