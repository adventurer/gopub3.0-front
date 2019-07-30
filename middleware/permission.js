export default function({ store, redirect, route }) {
    let permission =['/task','/task/new','/task/publish','/home','/permission/ban']
    if (store.state.isLogin && store.state.role==1) {
        if (permission.indexOf(route.path) == -1) {
            return redirect('/permission/ban')
        }
    }

    
    

}
