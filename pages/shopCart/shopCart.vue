<template>
	<view class="index">
		<van-sticky>
			<view class="topSharch">
				<view class="title" :style="'padding-top:' + titleHeight + 'px'">
					<van-icon @click="goBack" name="arrow-left" />
				</view>
			</view>
		</van-sticky>

		<view class="shopList">
			<van-swipe-cell v-for="item in cartList" :key="item.goods_id" right-width=" 65 ">
				<van-cell-group>
					<view class="shopListItem">
						<view class="inp">
							<checkbox-group @click="clickCheched" @change="changeChecked(item)">
								<label>
									<checkbox style="transform:scale(0.7)" value="cb" :checked="item.isShow" />
								</label>
							</checkbox-group>
						</view>

						<view class="centenIs">
							<view class="shopImgIs" @click="toDetail(item.goods_id)">
								<image :src="item.goods_small_logo" mode="heightFix"></image>
							</view>
							<view class="shopItile">
								<view class="toptitle">{{item.goods_name}}</view>
								<view class="price_btn">
									<view style="line-height: 60rpx;color: #f8191d;font-size: 40rpx;width: 160rpx;">
										￥{{item.goods_price}}
									</view>
									<van-stepper :disable-input="true" @focus="inputFocus(num)" @plus="addCartNum(item)"
										@minus="jianCartNum(item)" :value="item.goods_count" />
									<view style="margin-left: 10rpx;margin-top: 10rpx;">
										<van-icon @click="delItem(item)" name="delete-o" size="40rpx" color="red" />
									</view>
								</view>
							</view>
						</view>
					</view>
				</van-cell-group>
				<view slot="right"></view>
			</van-swipe-cell>


			<view style="width: 750rpx;height: 190rpx;"></view>
		</view>


		<view class="ClickButton">
			<van-notice-bar @click="getAddress" v-if="address == ''" right-icon="arrow" left-icon="logistics"
				mode="link" text="请选择收货地址" />
			<van-notice-bar @click="getAddress" v-else right-icon="arrow" left-icon="logistics" mode="link"
				:text="address" />
			<view class="ClickButton-item">
				<view class="btn">
					<view style="width: 65rpx;">
						<checkbox-group @change="changeTotal()">
							<label>
								<checkbox style="transform:scale(0.7)" value="cb" :checked="checkedTotal" />
							</label>
						</checkbox-group>
					</view>
					<view style="flex: 6;">
						<view style="padding-left: 200rpx;">合计:<text
								style="color:#f8191d;font-size: 30rpx;">￥{{totalPrice}}</text></view>
					</view>
					<view style="flex: 3;">
						<van-button @click="SubmitCart" block round color="linear-gradient(to right, #ff5f34, #ee0a24)">
							提交订单
						</van-button>
					</view>
				</view>
			</view>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast';
	import store from '@/store/index.js'; //需要引入store
	export default {
		data() {
			return {
				titleHeight: 0,
				checked: true,
				newValue: '',
				checkedTotal: false,
				address: uni.getStorageSync('address') || '', //地址
			}
		},
		onLoad() {
			this.getHeight();
			this.clickCheched()

		},
		methods: {
			// 获取地址信息
			async getAddress() {
				let res = await uni.chooseAddress()
				console.log(res);
				// if (res[0] === null && res[1].errMsg === 'chooseAddress:ok') {
				// 	let obj = res[1]
				// 	this.address = '收货信息 :' + obj.userName + '  ' + obj.provinceName + obj.cityName + obj.countyName +
				// 		obj.detailInfo + ' ' + obj.telNumber
				// 	uni.setStorageSync('address', this.address)
				// }
				// if (res[0].errMsg === 'chooseAddress:fail cancel') {
				// 	// this.reAuth()
				// }
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
			// 商品数量++
			addCartNum(obj) {
				store.commit('addCartNum', obj)
			},
			// 商品数量--
			jianCartNum(obj) {
				store.commit('jianCartNum', obj)
			},
			// 商品数量的input
			changeChecked(obj) {
				store.commit('changeChecked', obj)
			},
			// 全选
			changeTotal() {
				this.checkedTotal = !this.checkedTotal
				store.commit('changeTotal', this.checkedTotal)
			},


			delItem(obj) {
				store.commit('delCartNum', obj)
			},


			toDetail(goods_id) {
				uni.navigateTo({
					url: `/page/goods_detail?goods_id=${goods_id}`
				});
			},
			// 计算选择数量
			clickCheched() {
				let num = 0
				store.state.cart.forEach(x => {
					if (x.isShow == true) {
						num++
					}
				})
				if (num == store.state.cart.length) {
					this.checkedTotal = true
				} else {
					this.checkedTotal = false
				}
			},

			async SubmitCart() {
				// if(this.address == '') return Toast('您还未选择地址')
				let isCheched = this.cartList.some(x => x.isShow === true);
				if (!isCheched) return Toast('您还未选择商品')
				if (uni.getStorageSync('token') == '') return Toast('未登录')
				// 
				
				// 收集创建订单参数
				let goodsList = []
				store.state.cart.forEach(x => {
					if(x.isShow == true) {
						let obj = {}
						obj.goods_id = x.goods_id,
						obj.goods_number = x.goods_count,
						obj.goods_price = x.goods_price
						goodsList.push(obj)
					}
				})
				let parmas = {
					// order_price : this.totalPrice, // 总价格
					order_price : '0.01', // 总价格 写死0.01
					consignee_addr:'玉林市',
					goods:goodsList
				}
				
				// 创建订单
				let res = await uni.$http.post('https://api-ugo-web.itheima.net/api/public/v1/my/orders/create', parmas)
				if(res.data.meta.status !== 200) return Toast(res.data.meta.msg)
				// 获取支付参数
				let order_numbers = res.data.message.order_number
				let resOrder = await uni.$http.post('https://api-ugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder', {order_number:order_numbers})
				console.log(resOrder);

			}
		},
		computed: {
			// 获取vuex中商品数据
			cartList() {
				return store.state.cart
			},
			// 统计总价格
			totalPrice() {
				let Price = 0
				store.state.cart.forEach(x => {
					if (x.isShow) {
						Price += x.goods_price * x.goods_count
					}
				})
				return Price.toFixed(2)
			}
		},
		watch: {
			checkedTotal(nueValue, oldValue) {
				store.commit('changeTotals', this.checkedTotal)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ClickButton {
		width: 750rpx;
		height: 190rpx;
		background-color: #fff;

		position: fixed;
		bottom: 0;
		z-index: 9999;

		.ClickButton-item {
			height: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.btn {
				display: flex;
				align-items: center;
				width: 700rpx;
				height: 100rpx;
			}
		}
	}

	.shopList {
		width: 700rpx;
		margin: 0 auto;
		overflow: hidden;

		.shopListItem {
			border-radius: 20rpx;
			margin-top: 20rpx;
			width: 100%;
			height: 250rpx;
			background-color: #fff;
			display: flex;

			.inp {
				width: 65rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.centenIs {
				flex: 1;
				display: flex;
				align-items: center;

				.shopImgIs {
					border-radius: 20rpx;
					width: 200rpx;
					height: 200rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.shopItile {
					margin: 15rpx;
					flex: 1;
					height: 200rpx;

					.toptitle {
						max-width: 400rpx;
						height: 50%;
						/*第一步： 溢出隐藏 */
						overflow: hidden;
						/* 第二步：让文本不会换行， 在同一行继续 */
						white-space: nowrap;
						/* 第三步：用省略号来代表未显示完的文本 */
						text-overflow: ellipsis;
					}

					.price_btn {
						display: flex;
						position: relative;
						bottom: -20px; //table.height - div_height
					}
				}
			}
		}
	}

	.topSharch {
		width: 100%;
		height: 170rpx;
		background-color: #4ba685;

	}



	.shopCart-item {
		width: 100%;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.index {
		width: 750rpx;
		height: 100vh;
		position: relative;
	}
</style>
