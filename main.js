import App from './App'
import store from './store'

// #ifndef VUE3
import Vue from 'vue'

// 按需导入 $http 对象
import {
	$http
} from '@escook/request-miniprogram'
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

Vue.prototype.$store = store

// $http.baseUrl = 'https://applet-base-api-t.itheima.net'  

// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
	// do somethimg...
	uni.showLoading({
		title: '数据加载中...'
	})
}

// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
	if (options.url.indexOf('/my/') !== -1) {
		options.header = {
			'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo',
		}
	}
}

// 请求完成之后做一些事情
$http.afterRequest = function() {
	// do something...
	uni.hideLoading()
}


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
