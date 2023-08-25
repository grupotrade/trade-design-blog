export const state = {
    banners: [],
    bannersCategories: []
}

export const actions = {
    async getBanners({commit}) {
        let ref = this.$fire.firestore.collection('banners').where('deletedAt', '==', null).orderBy("name", "asc")
            ref.get().then(function (querySnapshot) {
                const result = []
                querySnapshot.forEach(function (doc) {
                    let data
                    data = doc.data()
                    data.id = doc.id
                    result.push(data)
                })
                commit('setBanners', result) 
            })
    },
    async getBannerByCategory({commit},payload) {
        return new Promise((resolve, reject) => {
        let ref = this.$fire.firestore.collection('banners').where('deletedAt', '==', null).where('category.position', '==', payload).orderBy("name", "asc")
            ref.get().then(function (querySnapshot) {
                const result = []
                console.log(result)
                querySnapshot.forEach(function (doc) {
                    let data
                    data = doc.data()
                    data.id = doc.id
                    result.push(data)
                })
                resolve(result) 
            })
        })
    },
    async getBannersCategories({commit}) {
        let ref = this.$fire.firestore.collection('banners_categories')
            ref.get().then(function (querySnapshot) {
                const result = []
                querySnapshot.forEach(function (doc) {
                    let data
                    data = doc.data()
                    data.id = doc.id
                    result.push(data)
                })
                commit('setBannersCategories', result) 
            })
    },
}
export const mutations = {
    setBanners(state, payload) {
        state.banners = payload
    },
    setBannersCategories(state, payload) {
        state.bannersCategories = payload
    },
}

export const getters = {
    getBanners: (state) => {
        return state.banners
    },
    getBannersCategories: (state) => {
        return state.bannersCategories
    }
}

