<template>
	<view>
		<van-sticky>
			<view class="topSharch">
				<view class="title" :style="'padding-top:' + titleHeight + 'px'">
					<van-icon @click="goBack" name="arrow-left" />
				</view>
			</view>
		</van-sticky>

		<view class="shopCart" v-if="shopList.length > 0">
			<view @click="toDatail(i)" v-for="i in shopList" :key="i.cat_id">
				<van-card  :price="i.goods_price.toFixed(2)" :title="i.goods_name" :thumb="i.goods_small_logo" />
				<view style="border: 1rpx solid #f4f4f4;"></view>
			</view>
		</view>
		
		<view class="shopCart" v-else>
			<van-divider contentPosition="center">暂无数据</van-divider>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleHeight: 0,
				pamars: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				shopList: [],
				total:''
			}
		},
		methods: {
			// 点击商品跳转详情页
			toDatail(i) {
				uni.navigateTo({
					url: `/page/goods_detail?goods_id=${i.goods_id}`
				})
			},
			// 获取微信右上角胶囊高度
			getHeight() {
				let res = wx.getMenuButtonBoundingClientRect();
				this.titleHeight = res.top;
			},
			// 返回
			goBack() {
				uni.navigateBack()
			},
			// 获取商品列表
			async getShopList() {
				let res = await uni.$http.get(`https://api-ugo-web.itheima.net/api/public/v1/goods/search`, this
					.pamars)
				if (res.statusCode !== 200) return Toast('请求超时')
				this.shopList = [...this.shopList,...res.data.message.goods]
				this.total = res.data.message.total
			}
		},
		onLoad(options) {
			this.pamars.query = options.query || ''
			this.pamars.cid = options.cid || ''
			this.getHeight()
			this.getShopList()
		},
		// 触底事件
		onReachBottom() {
			// 当shopList.length == this.total 不再发起请求
			if(this.shopList.length == this.total) return
			this.pamars.pagenum += 1
			this.getShopList()
		}
	}
</script>

<style lang="scss" scoped>
	.topSharch {
		width: 100%;
		height: 170rpx;
		background-color: #4ba685;
	}

	.title {
		font-weight: 600;
		line-height: 30px;
		margin-left: 40rpx;
		font-size: 17px;
	}

	.custom-class {
		border: 1rpx solid black;
	}

	.shopCart-item {
		width: 100%;
		border-radius: 20rpx;
		background-color: #fff;
	}
</style>
