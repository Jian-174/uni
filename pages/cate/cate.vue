<template>
	<view>
		<van-sticky>
			<view class="topSharch">
				<view class="title" :style="'padding-top:' + titleHeight + 'px'">
					<input @click="toSharch" class="inp" type="text" name="" placeholder="搜索" id="">
				</view>
			</view>
		</van-sticky>
		
		<view style="display: flex;height: 100vh;">
			<!-- <van-row> -->
			
				<!-- <van-col span="5"> -->
					<view>
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
							<van-sidebar active-key="activeKey" @change="onChange">
								<van-sidebar-item @tap="goTop" v-for="item in CateGoriesList" :key="item.cat_id"
									:title="item.cat_name" />
							</van-sidebar>
						</scroll-view>
					</view>
				<!-- </van-col> -->
			
				<!-- <van-col span="19"> -->
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="scroll">
						<view style="width: 100%;height: 100vh;">
							<view class="grid" @click="toDetail(i)" v-for="i in arrList" :key="i.cat_id">
								<view class="text-i">{{i.cat_name}}</view>
								<van-row>
									<van-col span="8" v-for="item in i.children" :key="item.cat_id">
										<view @click="toGoodsList(i)" class="grid-item">
											<view>
												<view>
													
													<image :src="item.cat_icon.replace('dev','web')" mode="heightFix"></image>
													<!-- <image src="../../static/miaosha.png" mode="heightFix"></image> -->
												</view>
												<view class="text">{{item.cat_name}}</view>
											</view>
										</view>
									</van-col>
								</van-row>
							</view>
						</view>
					</scroll-view>
				<!-- </van-col> -->
			<!-- </van-row> -->
		</view>

		<van-toast id="van-toast" />
	</view>
</template>

<script>
	// import Notify from '@/wxcomponents/vant/notify/notify';
	import Toast from '@/wxcomponents/vant/toast/toast';
	export default {
		data() {
			return {
				titleHeight: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},

				activeKey: 0,
				CateGoriesList: [], // 分类数据
				arrList: [], //默认数据
			}
		},
		methods: {
			// 获取分类数据
			async getCateGories() {
				Toast.loading({
					forbidClick: true,
				})
				let res = await uni.$http.get('https://api-ugo-web.itheima.net/api/public/v1/categories ')
				if (res.statusCode !== 200) return Toast('请求超时')
				Toast.clear();
				this.CateGoriesList = res.data.message
				this.arrList = this.CateGoriesList[0].children
			},


			onChange(event) {
				this.arrList = []
				this.arrList = this.CateGoriesList[event.detail].children
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				})
			},
			// 获取微信右上角胶囊高度
			getHeight() {
				let res = wx.getMenuButtonBoundingClientRect();
				this.titleHeight = res.top;
			},
			// 跳转搜索页
			toSharch() {
				uni.navigateTo({
					url: '/page/sharch'
				});
			},
			toDetail(i){
				console.log(i);
			},
			toGoodsList(i) {
				uni.navigateTo({
					url: `/page/goods_list?query=${i.cat_name}`
				});
			}

		},
		onLoad() {
			this.getCateGories()
			this.getHeight()
		}
	}
</script>

<style lang="scss">
	.title {
		font-weight: 600;
		line-height: 30px;
		margin-left: 40rpx;
		font-size: 17px;
	}

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

	.topSharch {
		width: 100%;
		height: 180rpx;
		background-color: #4ba685;
	}

	.van-sidebar {
		width: 100%;
		overflow: hidden;
	}

	.text-i {
		font-size: 30rpx;
		text-align: center;
		width: 100%;
		margin: 20rpx auto;
	}

	.custom-class {
		background-color: #1c6bff;
	}

	.grid {
		width: 100%;
		background-color: #fefefe;
		border-radius: 10rpx;
		overflow: hidden;



		.grid-item {
			display: flex;
			justify-content: center;

			image {
				margin-top: 15rpx;
				width: 100rpx;
				height: 100rpx;
				text-align: center;
			}

			.text {
				width: 100rpx;
				font-size: 25rpx;
				margin-top: 10rpx;
				text-align: center;
				margin-bottom: 15rpx;
				/*第一步： 溢出隐藏 */
				overflow: hidden;
				/* 第二步：让文本不会换行， 在同一行继续 */
				white-space: nowrap;
				/* 第三步：用省略号来代表未显示完的文本 */
				text-overflow: ellipsis;
			}
		}

	}



	.scroll-Y {
		height: 100vh;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}

	.scroll-view-item_H {
		display: inline-block;
		width: 100%;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}



	.search {
		background-color: #FFFFFF;
		border-radius: 30upx;
		height: 60upx;
		line-height: 60upx;
		padding: 0 20upx;
		display: flex;
		margin: 0 30upx;

		text {
			display: inline-block;
			margin-right: 10upx;
		}

		.cuIcon-search {
			margin-right: 12upx;
		}

		input {
			margin-top: 50rpx;
			font-size: 24upx;
			height: 60upx;
			width: 280upx;
		}
	}
</style>
