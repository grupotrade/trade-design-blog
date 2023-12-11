<template>
    <v-card @click="navigateActivity(post)" :class="related ? 'post-card-related' : 'fill-height post-card'" :width="width">
        <v-img :src="$config.storage + 'posts%2F' + post.img + '?alt=media'" cover :height="imgHeight"
            v-if="post.img && post.img != ''">
            <v-chip color="secondary" small class="ma-2" v-if="$moment().diff(post.createdAt, 'days') <= 3">NUEVO</v-chip>
        </v-img>
        <v-img src="/img/imagen_generica.png" cover :height="imgHeight" v-else>
            <v-chip color="secondary" small class="ma-2" v-if="$moment().diff(post.createdAt, 'days') <= 3">NUEVO</v-chip>
        </v-img>

        <v-card-text>
            <p class="primary--text semi mb-0" v-if="!related"> {{ post.type.name }}</p>
            <h4 class="black--text my-2 semi">{{ post.title }}</h4>
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
