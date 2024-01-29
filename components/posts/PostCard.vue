<template>
    <v-card @click="navigateActivity(post)" :class="related ? 'post-card-related d-flex' : 'fill-height d-flex flex-column post-card'" :width="width">
        <v-img :src="$config.storage + 'posts%2F' + post.thumbImg + '?alt=media'" cover :height="imgHeight"  :width="related ? '150px' : ''"
            v-if="post.thumbImg && post.thumbImg != ''">
            <v-chip color="secondary" small class="ma-2" v-if="$moment().diff(post.createdAt, 'days') <= 3">NUEVO</v-chip>
        </v-img>
        <v-img src="/img/imagen_generica.png" cover :height="imgHeight"  :width="related ? '220px' : ''" v-else>
            <v-chip color="secondary" small class="ma-2" v-if="$moment().diff(post.createdAt, 'days') <= 3">NUEVO</v-chip>
        </v-img>

        <v-card-text class="background fill-height" :style="related ? 'height:'+imgHeight+'px' : ''">
            <p class="primary--text semi mb-0"> {{ post.type.name }}</p>
            <h4 class="white--text my-2 semi">{{ post.title }}</h4>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        post: {
            type: Object
        },
        related: {
            type: Boolean,
            default: false
        },
        imgHeight: {
            type: String,
            default: '220'
        },
        width: {
            type: String,
            default: '100%'
        },
        index: {
            type: Number
        }
    },
    methods: {
        navigateActivity() {
            this.$emit('navigate')
        },
        getIdYoutube(url) {
            return this.$youtube.getIdFromURL(url)
        },
        getIdVimeo(url) {
            return url.split("/").pop();
        },
    }
}
</script>
