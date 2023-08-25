<template>
<v-container class="px-lg-16">
    <v-sheet class="hero my-lg-4">
        <BannersListBanners class="mb-4" position="contenidos-arriba" />
    </v-sheet>
    <v-row class="mt-12">
        <v-col cols="12">
            <h2 class="primary--text text-center my-lg-4">
                Próximos streamings
            </h2>
        </v-col>
        <v-col cols="12">
            <v-slide-group v-model="model" class="pa-lg-4" active-class="success" show-arrows>
                <v-slide-item v-for="item in streamings" :key="item" v-slot="{ active }">
                    <v-card class="streaming-card text-center ma-4" height="380" :width="$vuetify.breakpoint.xs ? 250 : 300">
                        <v-chip color="white" outlined class="mt-8">{{item.eventDate}}</v-chip>
                        <h3 class="white--text mt-10">{{ item.title }}</h3>
                        <p class="white--text mt-8">
                            Hora: {{item.eventTime}}<br>
                            Docente: {{item.speaker.name}}
                        </p>
                        <v-menu open-on-hover bottom offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn rounded depressed color="white" class="mt-4" v-on="on">Agregar al calendario</v-btn>
                            </template>
                            <v-list>
                                <v-list-item  target="_blank" :href="'https://calendar.google.com/calendar/render?action=TEMPLATE&dates='+item.eventDate+'&details='+item.sinopsis+'&location='+item.url+'&text='+item.title" class="primary--text">
                                    <v-list-item-title>
                                        <v-icon left color="primary">mdi-google</v-icon>Google Calendar
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item to="/contenido" class="primary--text">
                                    <v-list-item-title>
                                        <v-icon left color="primary">mdi-apple</v-icon>iCalendar
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item :href="'https://outlook.live.com/calendar/0/deeplink/compose?body='+item.sinopsis+'&location='+item.location+'&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt='+item.eventDate+'&subject='+item.title" class="primary--text">
                                    <v-list-item-title>
                                        <v-icon left color="primary">mdi-microsoft-outlook</v-icon>Outlook
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-card>
                </v-slide-item>
            </v-slide-group>
        </v-col>
    </v-row>
    <v-sheet class="hero my-4">
        <BannersListBanners class="my-4" position="contenidos-abajo" />
    </v-sheet>
</v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            streamings: "streamings/getStreamings",
        }),
        user() {
            return this.$store.state.authUser;
        }
    },
    mounted() {
        this.getStreamings()
    },
    methods: {
        async getStreamings() {
            this.loading = true
            this.$store.dispatch('streamings/getStreamings')
                .then(() => {
                    this.loading = false
                })
        },
    }
};
</script>
