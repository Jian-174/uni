// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state:{//存放状态
		cart:uni.getStorageSync('cart') || [],
		changeTotal:uni.getStorageSync('changeTotal') || false
	},
	mutations:{
		addToCart(state,obj) {
			let findResult = state.cart.find(x => x.goods_id == obj.goods_id)
			if (!findResult) {
				state.cart.push(obj)
			} else {
				findResult.goods_count++
			}
			this.commit('savaToStorage')
		},
		savaToStorage(state) {
			uni.setStorageSync('cart',state.cart)
		},
		addCartNum(state,obj) {
			let findResult = state.cart.find(x => x.goods_id == obj.goods_id)
			findResult.goods_count++
			this.commit('savaToStorage')
		},
		jianCartNum(state,obj) {
			let findResult = state.cart.find(x => x.goods_id == obj.goods_id)
			findResult.goods_count--  
			this.commit('savaToStorage')
		},
		changeChecked(state,obj) {
			let findResult = state.cart.find(x => x.goods_id == obj.goods_id)
			findResult.isShow = !obj.isShow
			this.commit('savaToStorage')
		},
		delCartNum(state,obj) {
			let arr = []
			state.cart.forEach(x => {
				if(x.goods_id !== obj.goods_id)  {
					arr.push(x)
				}
			})
			state.cart = arr
			this.commit('savaToStorage')
		},
		changeTotal(state,is) {
			state.cart.forEach(x => {
				x.isShow = is
			})
		},
		changeTotals(state,is) {
			state.changeTotal = is
			uni.setStorageSync('changeTotal',state.changeTotal)
		}
	}
})
export default store
