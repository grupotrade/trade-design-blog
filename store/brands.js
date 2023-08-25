export const state = {
    brands: [],
    brandsCategories: []
}

export const actions = {
    async getBrands({commit}) {
        let ref = this.$fire.firestore.collection('brands').where('deletedAt', '==', null).orderBy("name", "asc")
            ref.get().then(function (querySnapshot) {
                const result = []
                querySnapshot.forEach(function (doc) {
                    let data
                    data = doc.data()
                    data.id = doc.id
                    result.push(data)
                })
                commit('setBrands', result) 
            })
    },
    async getBrandsCategories({commit}) {
        let ref = this.$fire.firestore.collection('brands_categories')
            ref.get().then(function (querySnapshot) {
                const result = []
                querySnapshot.forEach(function (doc) {
                    let data
                    data = doc.data()
                    data.id = doc.id
                    result.push(data)
                })
                commit('setBrandsCategories', result) 
            })
    },
}
export const mutations = {
    setBrands(state, payload) {
        state.brands = payload
    },
    setBrandsCategories(state, payload) {
        state.brandsCategories = payload
    },
}

export const getters = {
    getBrands: (state) => {
        return state.brands
    },
    getBrandsCategories: (state) => {
        return state.brandsCategories
    }
}

