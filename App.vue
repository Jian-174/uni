<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			initBounding() {
				const {
					windowWidth,
					windowHeight,
					statusBarHeight
				} = uni.getSystemInfoSync()

				let menuGap = 7
				let menuWidth = 0
				let menuHeight = 32
				let statusHeight = 7

				// #ifdef MP
				const {
					top,
					left,
					right,
					width,
					height
				} = uni.getMenuButtonBoundingClientRect()
				menuGap = windowWidth - right
				menuWidth = width
				menuHeight = height
				statusHeight = top - menuGap
				// #endif

				// #ifdef APP-PLUS
				statusHeight = statusBarHeight
				// #endif

				this.globalData.windowWidth = windowWidth
				this.globalData.windowHeight = windowHeight
				this.globalData.statusHeight = statusHeight
				this.globalData.menuGap = menuGap
				this.globalData.menuWidth = menuWidth
				this.globalData.menuHeight = menuHeight

				console.log('=============>>>initBounding', this.globalData)
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f8fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
			Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
			sans-serif;
	}

	/*每个页面公共css */
	@import "/wxcomponents/vant/common/index.wxss"
</style>
