<template>
	<view style="background-color: #fff;height: 100vh;">
		<van-sticky>
			<view class="topSharch">
				<view @click="goBack" class="title" :style="'padding-top:' + titleHeight + 'px'">
					<van-icon name="arrow-left" />
				</view>
				<van-search v-model="values" @clear="clearText" @change="changeSearch" @search="anterSearch"
					shape="round" background="#4ba685" placeholder="请输入搜索关键词" />
			</view>
		</van-sticky>

		<view style="width: 750rpx;" v-if="searchList.length == 0 ">
			<van-cell :border="true" title="搜索历史">
				<van-icon @click="clearStorage" slot="right-icon" name="delete-o" class="custom-icon" />
			</van-cell>
			<view class="van-hairline--bottom"></view>


			<view class="history-li">
				<view @click="clickTab(i)" class="title" v-for="i in storage" :key="i">
					<text class="text" style="padding: 0 15rpx;">{{i}}</text>
				</view>
			</view>
		</view>

		<van-cell-group v-else-if="searchList.length > 0">
			<van-cell icon="search" custom-class="over" @click="toCate(i)" v-for="i in searchList" :key="i.goods_id"
				:title="i.goods_name" />
		</van-cell-group>

		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast';
	export default {
		data() {
			return {
				titleHeight: 0,
				storage: [], // 搜索历史
				searchList: [], // 搜索响应数据
				values: ''
			}
		},
		onLoad() {
			this.getHeight()
			this.storage = uni.getStorageSync('sraechHistory')
		},
		methods: {
			// 获取微信右上角胶囊高度
			getHeight() {
				let res = wx.getMenuButtonBoundingClientRect();
				this.titleHeight = res.top;
			},
			// 返回上一次页面
			goBack() {
				uni.navigateBack()
			},
			// 获取搜索记录缓存
			anterSearch(event) {
				if (uni.getStorageSync('sraechHistory')) {
					let arr = uni.getStorageSync('sraechHistory')
					arr.push(event.detail)
					uni.setStorageSync('sraechHistory', arr);
					this.storage = uni.getStorageSync('sraechHistory')
					this.getSearchList(event.detail)
				} else {
					let arr = [event.detail]
					uni.setStorageSync('sraechHistory', arr);
					this.storage = uni.getStorageSync('sraechHistory')
					this.getSearchList(event.detail)

				}

			},
			// 清楚缓存
			clearStorage() {
				try {
					uni.removeStorageSync('sraechHistory');
				} catch (e) {
					// error
				}
				this.storage = []
			},
			// input发生变化
			async changeSearch(event) {
				this.getSearchList(event.detail)
			},
			//点击清空控件时触发
			clearText() {
				this.searchList = []
			},

			clickTab(i) {
				this.searchList = []
				// this.getSearchList(i)
				uni.navigateTo({
					url: `/page/goods_list?query=${i}`
				});
			},

			async getSearchList(key) {
				let res = await uni.$http.get(
					`https://api-ugo-web.itheima.net/api/public/v1/goods/qsearch?query=${key}`)
				if (res.statusCode !== 200) return Toast('请求超时')
				if (res.data.message.length <= 0) Toast('暂无数据')
				this.searchList = [...res.data.message]
			},

			// 跳转商品详情
			toCate(i) {
				uni.navigateTo({
					url: `/page/goods_detail?goods_id=${i.goods_id}`
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		margin: 0;
		padding: 0;
	}
	
	.history-li{
		display: flex;
		flex-flow: wrap;
		.title{
			margin-left: 10px;
			text-align: center;
			max-width: 300rpx;
			min-width: 90rpx;
			margin-top: 15rpx;
			font-size: 25rpx;
			// padding: 0 25rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 15rpx;
			background-color: #efefef;
			/*第一步： 溢出隐藏 */
			overflow: hidden;
			/* 第二步：让文本不会换行， 在同一行继续 */
			white-space: nowrap;
			/* 第三步：用省略号来代表未显示完的文本 */
			text-overflow: ellipsis;
			.text{
				max-width: 300rpx;
				min-width: 90rpx;
				/*第一步： 溢出隐藏 */
				overflow: hidden;
				/* 第二步：让文本不会换行， 在同一行继续 */
				white-space: nowrap;
				/* 第三步：用省略号来代表未显示完的文本 */
				text-overflow: ellipsis;
			}
		}
	}

	.topSharch {
		width: 750rpx;
		height: 250rpx;
		background-color: #4ba685;
	}
	.margin-is {
		min-width: 60rpx;
		max-width: 400rpx;
		font-size: 30rpx;
		height: 60rpx;
		margin-right: 25rpx;
		font-weight: 400;
		/*第一步： 溢出隐藏 */
		overflow: hidden;
		/* 第二步：让文本不会换行， 在同一行继续 */
		white-space: nowrap;
		/* 第三步：用省略号来代表未显示完的文本 */
		text-overflow: ellipsis;
		 .van-tag .van-tag--danger .van-tag--large{
			 min-width: 60rpx;
			 max-width: 400rpx;
			 background-color: #fff;
			 /*第一步： 溢出隐藏 */
			 overflow: hidden;
			 /* 第二步：让文本不会换行， 在同一行继续 */
			 white-space: nowrap;
			 /* 第三步：用省略号来代表未显示完的文本 */
			 text-overflow: ellipsis;
		 }
	}

	.title {
		line-height: 30px;
		margin-left: 40rpx;
		font-size: 17px;
	}

	.over {}

	.inp {
		margin: 0 15rpx;
		margin-top: 20rpx;
		width: 720rpx;
		height: 60rpx;
		background-color: #fefefe;
		border-radius: 30rpx;
		font-size: 18px;
		color: #838181;
		font-weight: 200;
		text-align: center;
	}

	.sraechHistory {
		margin: 0 15rpx;

		.sraechHistory-i {
			display: flex;
			justify-content: space-between;
			font-size: 40rpx;
			// margin: 15rpx 0;
			padding: 15rpx 0;
		}

	}

	.history {
		display: flex;
		flex-wrap: wrap;

		.history-i {
			background-color: #f5f5f5;
			min-width: 90rpx;
			max-width: 400rpx;
			padding: 0rpx 10rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 15rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: 400;
			margin-left: 10rpx;
			margin-top: 15rpx;
			/*第一步： 溢出隐藏 */
			overflow: hidden;
			/* 第二步：让文本不会换行， 在同一行继续 */
			white-space: nowrap;
			/* 第三步：用省略号来代表未显示完的文本 */
			text-overflow: ellipsis;
		}
	}


	.over {
		overflow: hidden !important;
		/* 第二步：让文本不会换行， 在同一行继续 */
		white-space: nowrap !important;
		/* 第三步：用省略号来代表未显示完的文本 */
		text-overflow: ellipsis !important;

		.van-cell__title {
			overflow: hidden !important;
			/* 第二步：让文本不会换行， 在同一行继续 */
			white-space: nowrap !important;
			/* 第三步：用省略号来代表未显示完的文本 */
			text-overflow: ellipsis !important;
		}
	}
</style>
