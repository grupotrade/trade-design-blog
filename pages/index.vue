<template>
<v-container fluid class="py-8">
    <v-sheet class="mx-4">
        <BannersListBanners class="mb-4" position="home-top" />
    </v-sheet>
     <v-container fluid id="productos" class="px-4">
        <v-row dense>
            <v-col cols="12" class="pb-12">
                <h3 class="primary--text text-center"><span class="secondary--text">Productos</span> destacados</h3>
            </v-col>
            <v-col cols="12" lg="3" v-for="item in productsHome" :key="item.name">
                <v-card elevation="3" shaped class="py-3 ma-2">
                    <v-img :src="item.images[0]"></v-img>
                    <v-card-text style="min-height:180px">
                        <h4 class="pt-3">{{item.name}}</h4>
                        <p>{{item.description.substring(0, 100)}}...</p>
                        <!-- <h5 v-if="user.displayName" class="primary--text text-right">${{item.price}}</h5> -->
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn color="primary" rounded depressed class="px-4" @click="viewProduct(item)">
                            Ver más
                        </v-btn>
                        <!-- <v-btn color="primary" rounded depressed @click="openLogin" v-else class="px-4">
                            Iniciar sesión
                        </v-btn> -->
                    </v-card-actions>
                </v-card>
            </v-col>
            <!-- <v-slide-group v-model="productSlider" show-arrows class="pa-4" active-class="success">
            </v-slide-group> -->
        </v-row>
    </v-container>
    <v-container fluid id="marcas" class="px-4">
        <v-row justify="center" class="mt-10">
            <v-col cols="12" class="pb-12">
                <h3 class="primary--text text-center"><span class="secondary--text">Encuentra las</span> mejores marcas</h3>
            </v-col>
            <v-col cols="12">
                <BrandsListBrands />
            </v-col>
            <!-- <v-slide-group v-model="slideBrands" class="px-8" show-arrows>
                <v-slide-item v-for="(item, i) in brands" :key="i" class="pa-1">
                    <v-img :src="item.img" width="200" class="mx-8"></v-img>
                </v-slide-item>
            </v-slide-group>  -->
        </v-row>
    </v-container>
    <DialogsLogin v-model="loginDialog" @openRegister="openRegister" />
    <DialogsRegister v-model="registerDialog" />
</v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            agenda: null,
            eventRoute: '',
            eventRouteNew: '',
            loginDialog: false,
            registerDialog: false
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
        }
    }
}
</script>

<style scoped>
.hero {
    background-repeat: no-repeat !important;
    background-color: var(--v-primary-base) !important;
    border-radius: 25px;
    background-position: right !important;
    background-size: contain !important;
    min-height: 320px;
}

.hero-img {
    position: absolute;
    width: 540px;
    margin: -30px 0 0 36px;
}
</style>
