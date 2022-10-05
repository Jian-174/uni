<template>
	<view class="view-wrap">
		<view :style="{height: barHeight}"></view>
		<view class="nav-bar-wrap" :style="{background: background}">
			<view class="status-bar" :style="{height: statusHeight}"></view>
			<view class="nav-bar" :style="{padding: menuGap, gap: menuGap, height: menuHeight}">
				<view class="left" v-if="back" @click="handleBack">
					<uni-icons type="arrowleft" size="26" :color="backColor"></uni-icons>
				</view>
				<view class="search-bar"
					:style="{height: menuHeight, borderRadius: borderRadius, background: searchBackground}"
					@click="handleSearch('to')" v-if="search">
					<icon class="icon" type="search" size="14" :color="iconColor" @click.stop="handleSearch('search')"></icon>
					<input type="text" :placeholder="placeholder" :placeholder-style="placeholderStyle"
						:style="{color: searchColor}" :disabled="disabled" v-model="keyWord" @confirm="handleSearch">
					<icon class="icon" type="clear" size="14" :color="iconColor" v-show="keyWord"
						@click.stop="handleSearch('clear')"></icon>
				</view>
				<view class="container" v-else>
					<slot></slot>
				</view>
				<view class="right" :style="{width: menuWidth, height: menuHeight}"></view>
			</view>
		</view>
	</view>
	
</template>
 
<script>
	const {
		windowWidth,
		statusHeight,
		menuGap,
		menuWidth,
		menuHeight
	} = getApp().globalData
	export default {
		props: {
			background: {
				type: String,
				default: 'none'
			},
			back: {
				type: Boolean
			},
			backColor: {
				type: String,
				default: '#000'
			},
			search: {
				type: Boolean
			},
			searchValue:{
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean
			},
			searchBackground: {
				type: String,
				default: '#fff'
			},
			iconColor: {
				type: String,
				default: '#999'
			},
			searchColor: {
				type: String,
				default: '#000'
			},
			placeholder: {
				type: String,
				default: '关键字快速搜索'
			},
			placeholderStyle: {
				type: String,
				default: 'color: #999;'
			},
		},
		data() {
			return {
				barHeight:'32px',
				menuGap: '7px',
				menuWidth: '0px',
				menuHeight: '32px',
				statusHeight: '7px',
				borderRadius: '4px',
				keyWord:'',
			};
		},
		watch:{
			searchValue(val){
				this.keyWord = val
			}
		},
		created() {
			this.statusHeight = statusHeight + 'px'
			this.menuGap = menuGap + 'px'
			this.menuWidth = menuWidth + 'px'
			this.menuHeight = menuHeight + 'px'
			this.borderRadius = menuHeight / 2 + 'px'
			this.barHeight = statusHeight + menuHeight + menuGap * 2 + 'px'
		},
		computed: {
			barWidth() {
				if (this.back) {
					return windowWidth - menuWidth - menuGap * 4 - 26 + 'px'
				} else {
					return windowWidth - menuWidth - menuGap * 3 + 'px'
				}
			}
		},
		methods: {
			//处理返回
			handleBack() {
				this.$tools.navTo(-1)
				this.$emit('back')
			},
			//处理搜索
			handleSearch(event) {
				if (event == 'to') {
					this.disabled && this.$emit('search')
				} else if (event == 'search') {
					this.$emit('search', this.keyWord)
				} else if (event == 'clear') {
					this.keyWord = ''
					this.$emit('search', this.keyWord)
				} else if (typeof event == 'object') {
					this.keyWord = event.detail.value.trim()
					this.$emit('search', this.keyWord)
				}
			}
		}
	}
</script>
 
<style lang="scss" scoped>
	.view-wrap{
		position: relative;
	}
	.nav-bar-wrap {
		position: fixed;
		top: 0;
		z-index: 99;
		width: 750rpx;
		.nav-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: content-box;
 
			.left {
				width: 26px;
				flex-shrink: 0;
				text-align: center;
			}
 
 
 
			.search-bar {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 12px;
				gap: 7px;
				font-size: 14px;
				color: #eee;
				flex-grow: 1;
 
				input {
					flex-grow: 1;
				}
			}
 
			.container {}
 
 
			.right {
				flex-shrink: 0;
			}
 
 
		}
	}
</style>