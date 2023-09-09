export const state = () => ({
    posts: [],
    post: {},
    postTypes: []
})

export const getters = {
    getPosts (state) {
        return state.posts
    },
    getPost (state) {
        return state.post
    },
    getPostTypes (state) {
        return state.postTypes
    }
}

export const actions = {
    async getPosts({commit}) {
        return new Promise((resolve, reject) => {
        this.$fire.firestore.collection('posts').where('deletedAt', '==', null).orderBy("createdAt", "desc")
        .get().then(function (querySnapshot) {
            let result = []
            querySnapshot.forEach(function (doc) {
                let data
                data = doc.data()
                data.id = doc.id
                result.push(data)
            })
            commit('setPosts', result)
            resolve(result)
            })
            .catch((error) => {
                console.log(error);
            });
        })
    },
    async getPostsByPostTypes({ commit }, postTypeIds) {
        commit('setPosts', []);
        return new Promise((resolve, reject) => {
          this.$fire.firestore.collection('posts')
            .where('deletedAt', '==', null)
            .where('type.id', 'in', postTypeIds) // buscar en varias categorías
            .orderBy('createdAt', 'desc')
            .get()
            .then(querySnapshot => {
              let result = [];
              querySnapshot.forEach(doc => {
                let data = doc.data();
                data.id = doc.id;
                result.push(data);
              });
              commit('setPosts', result);
              resolve(result);
            })
            .catch(error => {
              console.log(error);
            });
        });
      },
    getPostbyId({commit}, payload) {
        return new Promise((resolve, reject) => {
            let ref = this.$fire.firestore.collection('posts')
            ref.doc(payload).get().then((doc) => {
                if (doc.exists) {
                    commit('setPost', doc.data())
                    resolve()
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                reject()
                console.log("Error getting document:", error);
            })
        })
    },
    async getPostTypes({commit}) {
        let ref = this.$fire.firestore.collection('post_types').orderBy("name", "asc")
            ref.get().then(function (querySnapshot) {
                const result = []
                querySnapshot.forEach(function (doc) {
                    let data
                    data = doc.data()
                    data.id = doc.id
                    result.push(data)
                })
                commit('setPostTypes', result) 
            })
    },
    createPost({}, payload) {
        return new Promise((resolve, reject) => {
            this.$fire.firestore
                .collection('posts')
                .add(payload)
                .then(() => {
                    resolve()
                })
                .catch((error) => {
                    console.log(error);
                });
        })
    }
}


export const mutations = {
    setPosts(state, data) {
        state.posts = data
    },
    setPost(state, data) {
        state.post = data
    },
    setPostTypes(state, data) {
        state.postTypes = data
    }
}