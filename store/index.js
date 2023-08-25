export const state = () => ({
    authUser: {}
  })
  
  export const actions = {

    async onAuthStateChangedAction({ commit }, { authUser, claims }) {
      if(authUser) {
      const { uid, email, displayName } = authUser
  
    commit('setUser', {
        uid,
        email,
        displayName,
      })
    }
    },
    async nuxtServerInit({ dispatch, commit }, { res }) {
//      console.log(res.locals)
      if (res && res.locals && res.locals.user) {
        const { allClaims: claims, idToken: token, ...authUser } = res.locals.user
        await dispatch('onAuthStateChangedAction', {
          authUser,
          claims,
          token
        })
        commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser, claims, token })
      }
    },
    signOut({commit}, payload) {
      this.$fire.auth.signOut().then(() => {
          commit('setUser', {})
          location.replace('/')
          console.log('Signed Out');
      }).catch((error) => {
      // An error happened.
      });
  }
  }
  
  export const mutations = {
    ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser, claims }) {
      if(authUser) {
      const { uid, email, displayName} = authUser
  
      state.authUser = {
        uid,
        displayName,
        email,
      }
    }
    },
    setUser(state, payload) {
     // console.log(payload)
      state.authUser = payload;
    }
  }

  export const getters = {
    getAuthUser: (state) => {
        return state.authUser
    }
}