<template>
    <v-container v-if="posts">
        <v-row>
            <v-col v-for="post in posts" :key="post.id" cols="12" md="4">
                <v-card flat class="fill-height pb-4" @click="viewPost(post.id)">
                    <v-sheet :color="post.img_color" rounded class="mb-2">
                        <img :src="'https://firebasestorage.googleapis.com/v0/b/'+$config.storageBucket+'/o/'+post.img+'?alt=media'" class="width-100 rounded" />
                    </v-sheet>
                    <h4 class="mb-2">{{post.title}}</h4>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    </template>
    
    <script>
    export default {
        props: {
            posts: {
                type: Array
            }
        },
        data() {
            return {
    
            }
        },
        methods: {
            viewPost(post) {
                this.$router.push('/whatsnew/post/' + post)
            }
        }
    
    };
    </script>
    