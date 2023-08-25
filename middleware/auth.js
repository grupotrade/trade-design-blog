export default function ({store, redirect}) {
// if(Object.keys(store.getters['auth/getUser']).length == 0) return redirect('/login')
 if(store.state.authUser) {
    if(store.state.authUser.displayName == undefined) return redirect('/login')
 }
}