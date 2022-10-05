<template>
	<view>
		<van-sticky>
			<view class="topSharch">
				<view class="title" :style="'padding-top:' + titleHeight + 'px'">
					<van-icon @click="goBack" name="arrow-left" />
				</view>
			</view>
		</van-sticky>

		<view class="centent">

			<view class="swiper">
				<view class="uni-margin-wrap">
					<swiper class="swiper" circular autoplay indicator-dots :indicator-dots="indicatorDots"
						:autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item v-for="item in goodsDetail.pics" :key="item.goods_id">
							<view class="swiper-item">
								<image style="width: 100%;height: 600rpx;" :src="item.pics_mid_url"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>

			<view class="title-i">

				<view style="width: 720rpx;margin: 0 auto;">
					<view class="price" v-if="goodsDetail.goods_price">
						<text>￥{{goodsDetail.goods_price}}</text>
					</view>
					<view class="dec">
						<view class="title-is">{{goodsDetail.goods_name}}</view>
						<view class="icon-i" @click="isCollection = !isCollection">
							<view v-show="isCollection" class="">
								<van-icon name="star" size="18" />
								<view>已收藏</view>
							</view>
							<view v-show="isCollection == false" class="">
								<van-icon name="star-o" size="18" />
								<view>收藏</view>
							</view>
						</view>
					</view>
					<view class="text-s">
						快递:免运费
					</view>
				</view>

				<rich-text :nodes="goodsDetail.goods_introduce"></rich-text>

				<view class="shopImg">
				</view>
			</view>

			<van-goods-action>
				<van-goods-action-icon icon="shop-o" text="店铺" />
				<van-goods-action-icon @click="toShopCart" icon="cart-o" text="购物车" :info="cartLength"/>
				<van-goods-action-button @click="addShopCart" text="加入购物车" type="warning" />
				<van-goods-action-button text="立即购买" />
			</van-goods-action>



		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import store from '@/store/index.js';//需要引入store
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		data() {
			return {
				isCollection: false,
				titleHeight: 0,
				goods_id: '',
				goodsDetail: {},
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				cartLength:0
			}
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack()
			},
			// 获取微信右上角胶囊高度
			getHeight() {
				let res = wx.getMenuButtonBoundingClientRect();
				this.titleHeight = res.top;
			},
			// get shopDetailData
			async getGoodsDetail(goods_id) {
				Toast.loading({
					forbidClick: true,
				})
				let res = await uni.$http.get(`https://api-ugo-web.itheima.net/api/public/v1/goods/detail`, {
					goods_id
				})
				if (res.statusCode !== 200) return Toast('请求超时')
				Toast.clear()
				res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;" ').replace(/webp/g, 'jpg')
				this.goodsDetail = res.data.message
				console.log(this.goodsDetail);
			},

			// 跳转购物车
			toShopCart() {
				uni.switchTab({
					url: '/pages/shopCart/shopCart'
				})
			},
			// 加入购物车
			addShopCart() {
				let cart = {
					goods_id: this.goodsDetail.goods_id,
					goods_name: this.goodsDetail.goods_name,
					goods_price: this.goodsDetail.goods_price,
					goods_count: 1,
					goods_small_logo: this.goodsDetail.goods_small_logo,
					goods_state: this.goodsDetail.goods_state,
					isShow:true
				}
				store.commit('addToCart',cart)
				Toast('已添加')

			}





		},
		onLoad(options) {
			this.getHeight();
			this.goods_id = options.goods_id
			this.getGoodsDetail(options.goods_id)
			this.cartLength = store.state.cart.length
		}
	}
</script>

<style scoped lang="scss">
	.topSharch {
		width: 100%;
		height: 165rpx;
		background-color: #4ba685;
	}

	.title {
		font-weight: 600;
		line-height: 30px;
		margin-left: 40rpx;
		font-size: 17px;
	}

	.centent {
		width: 750rpx;

		.swiper {
			width: 100%;
			height: 600rpx;
			// image{
			// 	width: 100%;
			// 	height: 100%;
			// }
		}

		.title-i {
			width: 750rpx;
			margin: 0 auto;
			height: 270rpx;
			background-color: #fff;

			.price {
				height: 100rpx;
				line-height: 100rpx;

				text {
					// padding-left: 15rpx;
					font-weight: 400;
					font-size: 40rpx;
					color: #c70303;
				}
			}

			.dec {
				display: flex;
				width: 720px;

				.title-is {
					// padding-left: 15rpx;
					width: 600rpx;

				}

				.icon-i {
					margin-top: 10rpx;
					font-size: 26rpx;
					width: 120rpx;
					text-align: center;
					// margin:  0 auto;
					// display: flex;
					// justify-content: center;
					// align-items: center;
				}
			}

			.text-s {
				margin-top: 15rpx;
				margin-bottom: 15rpx;
				font-size: 25rpx;
				color: #8b8b8b;
			}
		}

		.shopImg {
			width: 720rpx;
			margin: 0 auto;
		}
	}
</style>
