<template>
	<view class="centents">

		<view class="topInp">
			<view class="title" :style="'padding-top:' + titleHeight + 'px'">
				<input @click="toSharch" class="inp" type="text" name="" placeholder="搜索" id="">
			</view>
		</view>

		<view class="index">

			<!-- 轮播图 -->
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular autoplay indicator-dots :indicator-dots="indicatorDots"
					:autoplay="autoplay" :interval="interval" :duration="duration">
					<swiper-item v-for="swiper in swiperList" :key="swiper.id">
						<view class="swiper-item">
							<image class="img-itme" :src="swiper.image"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!-- 宫格 -->
			<view class="grid">
				<van-row>
					<van-col span="6" v-for="i in navList" :key="i.name">
						<view class="grid-item" @click="toPage(i)">
							<view>
								<view>
									<img class="grid-img" :src="i.img_src" alt="" srcset="">
								</view>
								<view class="text">{{i.name}}</view>
							</view>
						</view>
					</van-col>
				</van-row>
			</view>

			<!-- 楼层 -->
			<view class="storey" v-for="i in floorList" :key="i.floor_title.name">
				<view class="storey-item">
					<!-- <view class="storey-title">{{i.floor_title.name}}</view> -->
					<img :src="i.floor_title.image_src" alt="" srcset="">
				</view>
				<van-row gutter="5">

					<van-col span="8">
						<view class="storey-col" @click="toGoods(i.product_list[0])">
							<img :src="i.product_list[0].image_src" alt="" srcset="">
						</view>
					</van-col>

					<van-col span="16">
						<van-row gutter="5">
							<van-col span="12" v-for="(item,index) in i.product_list" v-if="index !== 0" :key="index">
								<view @click="toGoods(item)" :class="[`card${index}`,{cardHover:hovered ===index}]"
									class="storey-row">
									<img :src="item.image_src" alt="" srcset="">
								</view>
							</van-col>
						</van-row>
					</van-col>
				</van-row>
			</view>

			<van-toast id="van-toast" />
		</view>
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast';
	export default {
		data() {
			return {
				titleHeight: 0,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				swiperList: [], // 轮播图数据
				navList: [], //宫格数据
				floorList: [], //楼层 
			}
		},
		onLoad() {

			this.getSwiper()
			this.getNavList()
			this.getFloorList()
			this.getHeight();
		},
		methods: {
			getHeight() {
				let res = wx.getMenuButtonBoundingClientRect();
				this.titleHeight = res.top;
			},
			// 获取轮播图数据
			async getSwiper() {
				Toast.loading({
					forbidClick: true,
				});
				let res = await uni.$http.get('https://applet-base-api-t.itheima.net/slides')
				if (res.statusCode == 200) {
					this.swiperList = res.data
				} else {
					Toast('请求超时');
				}
			},
			// 获取宫格数据
			async getNavList() {
				let res = await uni.$http.get('https://api-ugo-web.itheima.net/api/public/v1/home/catitems')
				if (res.statusCode !== 200) {
					Toast('请求超时');
				}
				this.navList = res.data.message
				let iconList = ['../../static/fenlei.png', '../../static/miaosha.png', '../../static/chaoshi.png',
					'../../static/muying.png'
				]
				this.navList.forEach((ele, index, obj) => {
					ele.img_src = iconList[index]
				})
			},
			// 点击宫格
			toPage(i) {
				if (i.name == '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					});
				}
			},
			// 获取楼层数据
			async getFloorList() {
				let res = await uni.$http.get('https://api-ugo-web.itheima.net/api/public/v1/home/floordata')
				if (res.statusCode !== 200) {
					Toast('请求超时');
				}
				Toast.clear()
				this.floorList = res.data.message
				this.floorList
			},
			// 点击楼层跳转页面
			toGoods(i) {
				let query = i.navigator_url.split('=')
				console.log(query[1]);
				uni.navigateTo({
					url: `/page/goods_list?query=${query[1]}`
				});
			},
			// 跳转搜索页
			toSharch() {
				uni.navigateTo({
					url: '/page/sharch'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card2 {
		margin-bottom: 10rpx;
	}

	.card1 {
		margin-bottom: 10rpx;
	}

	page {
		background-color: #f7f8fa;
	}

	.topInp {
		position: absolute;
		width: 100%;
		height: 300rpx;
		background-color: #4ba685;

		.title {
			font-weight: 600;
			line-height: 30px;
			margin-left: 40rpx;
			font-size: 17px;

			.inp {
				width: 500rpx;
				height: 60rpx;
				background-color: #fefefe;
				border-radius: 30rpx;
				font-size: 18px;
				color: #838181;
				font-weight: 200;
				text-align: center;
			}
		}
	}


	.index {
		margin: 0 20rpx;

		.uni-margin-wrap {
			width: 100%;
			border-radius: 20rpx;
			overflow: hidden;

			.swiper {
				margin-top: 200rpx;
				height: 400rpx;

				.swiper-item {
					display: block;
					height: 300rpx;
					line-height: 300rpx;
					text-align: center;
					border-radius: 20rpx;

					.img-itme {
						width: 100%;
						height: 400rpx;
						border-radius: 10rpx;
					}
				}
			}
		}


		.grid {
			margin-top: 15rpx;
			width: 100%;
			background-color: #fefefe;
			border-radius: 10rpx;
			overflow: hidden;

			// display: flex;
			.grid-item {
				display: flex;
				justify-content: center;

				.grid-img {
					margin-top: 20rpx;
					width: 75rpx;
					height: 70rpx;
					text-align: center;
				}

				.text {
					margin-top: 10rpx;
					font-size: 22rpx;
					text-align: center;
					margin-bottom: 15rpx;

				}
			}

		}

		.storey {
			margin-top: 15rpx;
			width: 100%;
			background-color: #fefefe;
			border-radius: 10rpx;

			.storey-item {
				width: 100%;
				padding-top: 10rpx;
				height: 50rpx;

				img {
					width: 100%;
					height: 100%;
				}

				.storey-title {
					padding: 10rpx 0;
					font-size: 35rpx;
				}
			}

			.storey-col {
				height: 400rpx;
				border-radius: 10rpx;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.storey-row {
				height: 195rpx;
				border-radius: 10rpx;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
