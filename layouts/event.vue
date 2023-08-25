<template>
<v-app>
    <LayoutHeader :user="user" />
    <v-navigation-drawer v-model="menuRooms" app temporary clipped disable-resize-watcher>
        <h3 class="title mt-8 ml-4 mb-8">Salas</h3>
        <v-list>

            <v-list-item v-for="item in rooms" :key="item.img" :to="item.to">
                <v-list-item-content>
                    <v-list-item-title>
                        <v-avatar :color="item.color" size="40" class="pa-2">
                            <v-img :src="'/img/rooms/'+item.img" width="20" contain></v-img>
                        </v-avatar>
                        {{item.name}}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>
    <confirm-dialog />
    <snackbar />
    <v-main>
        <v-container fluid class="pa-0">
            <v-btn fab small absolute @click="menuRooms = !menuRooms" class="mt-5 ml-5">
                <v-icon>menu</v-icon>
            </v-btn>
            <nuxt />
        </v-container>
    </v-main>
</v-app>
</template>

    
<script>
export default {
    data() {
        return {
            menuMobile: false,
            userDrawer: false,
            menuRooms: false,
            notificationDrawer: false,
            notifications: [],
            rooms: [{
                    name: 'Prostodoncia',
                    img: 'prostodoncia.png',
                    color: '#94C01F',
                    to: '/salas/prostodoncia'
                },
                {
                    name: 'Operatoria / Estética',
                    img: 'operatoria_dental.png',
                    color: '#941B80',
                    to: '/salas/operatoria'
                },
                {
                    name: 'Periodoncia e Implantología',
                    img: 'periodoncia_e_implantologia.png',
                    color: '#E5332A',
                    to: '/salas/periodoncia'
                },
                {
                    name: 'Odontopediatría',
                    img: 'odontopediatria.png',
                    color: '#36A8E0',
                    to: '/salas/odontopediatria'
                },
                {
                    name: 'Endodoncia',
                    img: 'endodoncia.png',
                    color: '#868686',
                    to: '/salas/endodoncia'
                },
                {
                    name: 'Práctica estudiantil',
                    img: 'practica_estudiantil.png',
                    color: '#F29100',
                    to: '/salas/practica'
                }
            ]
        }
    },
    computed: {
        user() {
            return this.$store.state.authUser;
        }
    },
    methods: {
        openRegister() {
            this.registerDialog = true
        },
        openLogin() {
            this.loginDialog = true
        },
        toggleTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem("useDarkTheme", this.$vuetify.theme.dark.toString())
        },
        toggleThemeDark() {
            this.$vuetify.theme.dark = true
        },
        logout() {
            this.$store.dispatch('users/logout').then(result => {
                window.location.href = '/'
            }, error => {
                //    console.log(error)
            })
        }
    }

}
</script>
