<template>
<v-container>
    <v-row align="center">
        <v-col cols="6">
            <h2> {{ $t("users.title") }}</h2>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="4">
            <v-text-field v-model="searchUsers" :label="$t('search')" solo hide-details append-icon="mdi-table-search" color="secondary">
            </v-text-field>

        </v-col>
        <v-col class="text-right">
            <v-btn depressed color="secondary" @click="deletedUsers = !deletedUsers; listUsers()">
                <v-icon>
                    mdi-eye
                </v-icon>
                {{ (deletedUsers) ? 'Mostrar usuarios activos' : 'Mostrar usuarios eliminados' }}
            </v-btn>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on" v-show="minimizedUserDialog" outlined color="primary" @click="maximizeNewUsers()">
                        {{ $t("users.restore_user") }}
                    </v-btn>
                </template>
                <span> {{ $t("users.restore_user") }}</span>
            </v-tooltip>
            <v-btn depressed color="primary" @click="newUser()">
                <v-icon>mdi-plus</v-icon> Nuevo usuario
            </v-btn>
        </v-col>
    </v-row>
    <v-card flat outlined class="card-table mt-4">
        <v-skeleton-loader class="mx-auto" type=" table: table-heading, table-thead, table-tbody, table-tfoot" :loading="loading">
            <v-data-table :headers="headers" :items="users" item-key="email" :search="searchUsers">
                <template v-slot:item.actions="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" @click="editUser(item)">
                                <v-icon>
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip top v-if="!deletedUsers">
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" @click="deleteUser(item)">
                                <v-icon>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Eliminar</span>
                    </v-tooltip>
                    <v-tooltip top v-else>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" @click="restoreUser(item)">
                                <v-icon>
                                    mdi-delete-restore
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Restaurar</span>
                    </v-tooltip>
                </template>
                <template v-slot:item.enable="{ item }">
                    <v-switch v-model="item.enable" small @change="updateStatus(item)" :label="(item.enable) ? 'Autorizado' : 'No autorizado'"></v-switch>
                </template>
            </v-data-table>
        </v-skeleton-loader>
    </v-card>
    <UsersNewUserDialog v-model="newUserDialog" @finish="listUsers()" @minimize="minimizeUserDialog()" @cancel="cancelUserDialog()" />
    <UsersEditUserAdminDialog v-model="editUserDialog" :user="userSelected" v-if="userSelected" @cancel="cancelUserDialog()" @finish="listUsers()" />
</v-container>
</template>

<script>

export default {
    middleware: 'admin',
    layout: 'admin',
    name: 'Usuarios',
    data: () => ({
        headers: [{
                sortable: false,
                text: 'Nombre para Mostrar',
                value: 'displayName',
            },
            {
                sortable: false,
                text: 'Email',
                value: 'email',
            },

            {
                sortable: false,
                text: 'Empresa',
                value: 'group',
            },
            {
                sortable: false,
                text: 'Rol',
                value: 'role',
            },
            {
                sortable: false,
                text: 'Autorización',
                value: 'enable',
            },
            {
                sortable: false,
                text: 'Acciones',
                value: 'actions',
            }
        ],
        users: [],
        searchUsers: '',
        newUserDialog: false,
        minimizedUserDialog: false,
        editUserDialog: false,
        dialogDelete: false,
        dialogRestore: false,
        userSelected: null,
        deletedUsers: false,
        groups: []
    }),
    mounted() {
        this.listUsers()
    },
    methods: {
        listUsers() {
            const ref = this.$fire.firestore.collection('users').where('deleted_at', (this.deletedUsers) ? '!=' : '==', "")
            ref.get().then((querySnapshot) => {
                this.users = []
                querySnapshot.forEach((doc) => {
                    let item = doc.data()
                    item.id = doc.id
                    this.users.push(item)
                })

            }, error => {})
        },
        newUser() {
            this.newUserDialog = true
        },
        minimizeUserDialog() {
            this.minimizedUserDialog = true
        },
        maximizeUserDialog() {
            this.newUserDialog = true
            this.minimizedUserDialog = false
        },
        cancelUserDialog() {
            this.minimizedUserDialog = false
            this.listUsers()
        },
        updateStatus(item) {
            this.$fire.firestore.collection('users').doc(item.id).update({
                enable: item.enable
            }).then(result => {
                this.$snackbar.show({
                    text: 'Estado actualizado',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        },
        editUser(item) {
            this.userSelected = Object.assign({}, item)
            this.editUserDialog = true
        },
        deleteUser(item) {
            this.userSelected = Object.assign({}, item)
            this.$dialog.show({
                name: 'Eliminar usuario',
                text: '¿Confirma eliminar el usuario ' + this.userSelected.displayName +'?',
                    buttons: [{
                        text: this.$t("accept"),
                        color: "primary",
                        handle: () => {
                            this.$dialog.hide();
                            this.deleteUserConfirm(item)
                        },
                    }, ],
            });
        },
        restoreUser(item) {
            this.userSelected = Object.assign({}, item)
            this.dialogRestore = true
        },
        deleteUserConfirm(item) {
            const deleted_at = new Date()

            this.$fire.firestore.collection('users').doc(item.id).update({
                deleted_at: deleted_at.toISOString(),
                enable: false
            }).then(result => {
                this.listUsers()
                this.$snackbar.show({
                    text: 'Usuario eliminado',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        },
        restoreUser(item) {
            this.$fire.firestore.collection('users').doc(item.id).update({
                deleted_at: "",
                enable: true,
            }).then(result => {
                this.listUsers()
                this.dialogRestore = false
                this.$snackbar.show({
                    text: 'Usuario restaurado',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        }
    }
}
</script>
