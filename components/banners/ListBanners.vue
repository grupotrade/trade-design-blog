<template>
    <v-card flat v-if="banners.length > 0">
        <v-skeleton-loader class="mx-auto" type=" card" :loading="loading" v-if="!$vuetify.breakpoint.xs">
            <v-carousel v-if="banners.length > 1" height="540px" hide-delimiters>
                <v-carousel-item v-for="banner in banners" :key="banner.name">
                    <v-img cover contain max-height="540px"
                        :src="$config.storage + 'banners%2F' + banner.image + '?alt=media'"></v-img>
                </v-carousel-item>
            </v-carousel>
            <v-img :src="$config.storage + 'banners%2F' + banners[0].image + '?alt=media'" v-else></v-img>
        </v-skeleton-loader>
        <v-skeleton-loader class="mx-auto" type=" card" :loading="loading" v-else>
            <v-carousel v-if="banners.length > 1" height="500px" hide-delimiters>
                <v-carousel-item v-for="banner in banners" :key="banner.name">
                    <v-img cover contain max-height="500px"
                        :src="$config.storage + 'banners%2F' + banner.imageMobile + '?alt=media'"></v-img>
                </v-carousel-item>
            </v-carousel>
            <v-img :src="$config.storage + 'banners%2F' + banners[0].imageMobile + '?alt=media'" v-else></v-img>
        </v-skeleton-loader>
    </v-card>
</template>
    
        
<script>
export default {
    props: {
        position: {
            type: String,
            defaul: 'principal'
        },
    },
    data() {
        return {
            loading: false,
            banners: []
        }
    },
    mounted() {
        this.listBanners()
    },
    methods: {
        async listBanners() {
            this.loading = true
            let payload = this.position
            this.$store.dispatch('banners/getBannerByCategory', payload)
                .then(result => {
                    this.loading = false
                    if (result.length > 0) {
                        this.banners = result
                    }
                })
        }
    }
}
</script>
    