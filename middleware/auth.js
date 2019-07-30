export default function({ store, redirect, route }) {
	// console.log(store.state)
	// console.log(route.path)
	// if(store.state.isLogin && parseInt(store.state.role)<=0){
    // 	return redirect('/home')
	// }

	if (!store.state.isLogin && route.path!="/") {
    	return redirect('/')
	}

	if (store.state.isLogin && route.path=="/")  {
    	return redirect('/home')
	}

}
