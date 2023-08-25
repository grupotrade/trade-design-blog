<template>
<v-card flat>
    <v-skeleton-loader class="mx-auto" type=" card" :loading="loading">
        <v-row justify="center">
            <v-col cols="6" lg="3" class="d-flex justify-center px-sm-3 px-lg-8" v-for="brand in brands" :key="brand.name">
                <v-img :src="$config.storage + 'brands%2F' + brand.image + '?alt=media'" contain max-width="140px"></v-img>
            </v-col>
        </v-row>
    </v-skeleton-loader>
</v-card>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            loading: false,
        }
    },
    computed: {
        ...mapGetters({
            brands: "brands/getBrands",
        })
    },
    mounted() {
        this.listBrands()
    },
    methods: {
        async listBrands() {
            this.loading = true
            this.$store.dispatch('brands/getBrands')
                .then(() => {
                    this.loading = false
                })
        }
    }
}
</script>
