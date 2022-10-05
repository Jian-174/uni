<template>
	<view>
		<!-- 		<van-sticky>
			<view class="topSharch">
				<view class="title" :style="'padding-top:' + titleHeight + 'px'">
					<van-icon @click="goBack" name="arrow-left" />
				</view>
			</view>
		</van-sticky>
		 -->

		<view v-if="token == ''" style="height: 100vh;background-color: #fff;">
			<view class="ifTrue">
				<view class="signIn">
					<view class="singin-img">
						<image src="../../static/singIn.png" mode=""></image>
					</view>
					<view class="btn">
						<van-button custom-class="btn-title" @click="getUserProfile" type="danger" round block>登录
						</van-button>
					</view>
					<view class="title">登录后尽享更多权益</view>
				</view>
			</view>
		</view>



		<view class="haveToken" v-else>

			<view class="bgc-img">
				<view class="box-bottom">
					<view class="box-img-title">
						<view class="imgs">
							<image :src="userInfo.avatarUrl" mode=""></image>
						</view>
						<view class="title">{{userInfo.nickName}}</view>
					</view>
				</view>
			</view>

			<view class="cart">

				<view class="cart-item">
					<van-grid :border="false">
						<van-grid-item text-class="textSize" text="收藏的店铺">
							<text slot="icon" style="font-size: 30rpx;">888</text>
						</van-grid-item>
						<van-grid-item text="收藏的商品">
							<text slot="icon" style="font-size: 30rpx;">888</text>
						</van-grid-item>
						<van-grid-item text="关注的商品">
							<text slot="icon" style="font-size: 30rpx;">888</text>
						</van-grid-item>
						<van-grid-item text="足迹">
							<text slot="icon" style="font-size: 30rpx;">888</text>
						</van-grid-item>
					</van-grid>
				</view>

				<view class="cart-items">
					<van-cell title="我的订单" />
					<van-grid :border="false">
						<van-grid-item icon="after-sale" text="待付款" />
						<van-grid-item icon="logistics" text="待发货" />
						<van-grid-item icon="exchange" text="退款/退货" />
						<van-grid-item icon="orders-o" text="全部订单" />
					</van-grid>
				</view>

				<view class="cart-iteml">
					<van-cell-group>
						<van-cell title="收货地址" is-link />
						<van-cell title="联系客服" is-link />
						<van-cell title="退出登录" @click="backSigin" is-link />
					</van-cell-group>
				</view>


			</view>
		</view>

		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Dialog from '@/wxcomponents/vant/dialog/dialog';
	import Toast from '@/wxcomponents/vant/toast/toast';
	export default {
		data() {
			return {
				titleHeight: 0,
				token: '',
				userInfo: {}
			};
		},

		onLoad() {
			this.getHeight()
			this.token = uni.getStorageSync('token')
			this.userInfo = uni.getStorageSync('userInfo')

		},
		methods: {
			// 获取微信右上角胶囊高度
			getHeight() {
				let res = wx.getMenuButtonBoundingClientRect();
				this.titleHeight = res.top;
			},

			getUserProfile() {
				uni.getUserProfile({ //获取微信信息
					desc: '用于获取您的个人信息', // 声明获取用户个人信息后的用途，不超过30个字符
					success: res => { //接口调用成功的回调
						this.getToken(res)
						Toast.loading({
							forbidClick: true,
						});
					}
				})

			},

			async getToken(obj) {
				let res = await uni.login()
				// console.log(res[1]);
				// console.log(obj.encryptedData);
				// console.log(obj.rawData);
				// console.log(obj.iv);
				// console.log(obj.signature);
				// console.log(res[1].code);
				// console.log(res[1].errMsg);

				Toast.loading({
					forbidClick: true,
				})

				if (res[1].errMsg == "login:ok") {
					let parmas = {
						encryptedData: obj.encryptedData,
						rawData: JSON.stringify(obj.rawData),
						iv: obj.iv,
						signature: obj.signature,
						code: res[1].code
					}
					let result = await uni.$http.post('https://api-ugo-web.itheima.net/api/public/v1/users/wxlogin',
						parmas)
					// 此处由于appId问题 所以无法获取真正的token
					// console.log(result);	
					
					// wx30808e247d64f545
					uni.setStorageSync('userInfo', obj.userInfo);
					// 假token
					uni.setStorageSync('token',
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
					);
					this.token = uni.getStorageSync('token')
					this.userInfo = uni.getStorageSync('userInfo')
					Toast.clear();
					Toast('登录成功');
				}
			},
			backSigin() {
				Dialog.confirm({
						title: '确认退出登录吗',
						message: '巴拉巴拉巴拉巴拉巴拉~~~~~~~~~~',
					})
					.then(() => {
						uni.removeStorageSync('token');
						uni.removeStorageSync('userInfo');
						this.token = ''
						this.userInfo = {}
					})
					.catch(() => {
						// on cancel
					});
			}
		}
	}
</script>

<style lang="scss">
	.textSize {
		font-size: 30rpx
	}

	.haveToken {
		.bgc-img {
			// z-index: -1;
			width: 750rpx;
			height: 500rpx;
			background-color: #4ba685;

			.box-bottom {
				width: 100%;
				height: 310rpx;
				position: relative;
				bottom: -190rpx;
				display: flex;
				justify-content: center;

				// align-items: center;
				.box-img-title {
					width: 500rpx;

					.imgs {
						margin: 0 auto;
						border-radius: 50%;
						overflow: hidden;
						width: 150rpx;
						height: 150rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.title {
						margin-top: 30rpx;
						text-align: center;
					}
				}

			}

		}

		.cart {
			position: absolute;
			top: 440rpx;
			width: 750rpx;
			margin: 0 auto;

			// background-color: #9efeff;
			.cart-item {
				margin: 0 auto;
				width: 720rpx;
				border-radius: 20rpx;
				overflow: hidden;
				background-color: #fff;
			}

			.cart-items {
				margin: 20rpx auto;
				width: 720rpx;
				border-radius: 20rpx;
				overflow: hidden;
				background-color: #fff;
			}

			.cart-iteml {
				margin: 20rpx auto;
				width: 720rpx;
				border-radius: 20rpx;
				overflow: hidden;
				background-color: #fff;
			}
		}
	}


	// .topSharch {
	// 	width: 100%;
	// 	height: 170rpx;
	// 	background-color: #4ba685;

	// 	.title {
	// 		font-weight: 600;
	// 		line-height: 30px;
	// 		margin-left: 40rpx;
	// 		font-size: 17px;
	// 	}
	// }

	.ifTrue {

		width: 750rpx;
		padding-top: 400rpx;
		// height: calc(100vh - 170rpx);
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;

		.signIn {
			width: 700rpx;
			height: 450rpx;
			background-color: #ffffff;

			.singin-img {
				margin-bottom: 30rpx;
				width: 200rpx;
				height: 200rpx;
				background-color: #fff;
				margin: 30rpx auto;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.btn {
				padding-top: 15rpx;
				width: 680rpx;
				margin: 0 auto;
				background-color: #fff;

				.btn-title {
					font-size: 35rpx
				}

			}

			.title {
				width: 100%;
				line-height: 80rpx;
				text-align: center;
				color: #c2c2c2;
				font-size: 25rpx
			}
		}
	}
</style>
