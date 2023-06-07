<template>
	<view class="container">
		<view class="header-box">
			<swiper class="swiper" circular indicator-dots="true" indicator-active-color="rgb(66,185,131)"
				autoplay="true" interval="3000">
				<swiper-item v-for="item in rotographList.list" :key="item.id">
					<image :src="'/static/images/'+item.src" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 功能 -->
		<view class="operation">
			<!-- 充电费模块 -->
			<view class="charging-fee" @tap="chargingFeeBtn">
				<view class="charging-fee-title">
					<text>充电费</text>
				</view>
				<view class="icon-box">
					<uni-icons type="forward" size="30"></uni-icons>
				</view>
			</view>
			<!-- 上报维修 -->
			<view class="maintenance" @tap="maintenanceBtn">
				<view class="charging-fee-title">
					<text>上报维修</text>
				</view>
				<view class="icon-box">
					<uni-icons type="forward" size="30"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 公告区域 -->
		<view class="notice">
			<view class="notice-title">
				<text>最新通知公告</text>
				
				<uni-notice-bar style="width: 400rpx;" show-icon scrollable :text="rotographList.studentName" />
			</view>
			<!-- 公告列表 -->
			<view class="notice-list">
				<view class="notice-list-item" v-for="item in rotographList.noticeList" :key="item.id">
					<view class="notice-content">
						<text>{{item.n_title}}</text>
					</view>
					<view class="notice-publisher">
						<text>发布人: {{item.u_name}}</text>
						<text>{{toDate(item.n_date)}}</text>
					</view>
				</view>
			   <uni-load-more iconType="circle" :status="rotographList.status" :content-text="rotographList.contentText" ></uni-load-more>
			</view>
		</view>
	</view>

</template>


<script setup>
	import {
		reactive
	} from "vue";
	import {
		onShow,
		onPullDownRefresh,
		onReachBottom
	} from '@dcloudio/uni-app';
	// 封装的http请求
	import {
		myRequest
	} from '@/utils/api.js'

	import {
		toDate
	} from '@/utils/date.js'
	// 轮播图列表
	let rotographList = reactive({
		list: [{
				id: 1,
				src: 'lunbut1.jpg'
			},
			{
				id: 2,
				src: 'lunbut2.jpg'
			},
			{
				id: 3,
				src: 'lunbut3.jpg'
			},
		],
		noticeList: [],
		studentName:'',
		status:'More',
		ifBottomRefresh: false,//是否触底
		
		//先渲染5条数据
		params:{
			count:3,
			page:1
		},
		contentText: 
		    {
		    contentdown: '上拉加载更多~',
		    contentrefresh: '加载中',
		    contentnomore: '暂无更多~'
		    },
		
		
	})
		
	let getList=()=>{
		myRequest({
			url: '/getNoticeMini',
			data: {
				count: rotographList.params.count,
				page: rotographList.params.page
			},
		}).then((res) => {
			console.log(res)
			if (res.data.code == 200) {
				console.log(res.data.total,res.data.data.length)
                if(res.data.data.length>rotographList.params.count){
					rotographList.status='noMore'
				}
				rotographList.noticeList.push(...res.data.data)
				
			}
		})
	}

	//页面一出来加载公告
	onShow(() => {
		console.log(rotographList.params.count)
		let userInfo=uni.getStorageSync('loginUser')
		rotographList.studentName= '你好！'+userInfo[0].s_name //加提醒语句
	   getList()
	})
	//点击页面刷新
	onPullDownRefresh(() => {
		getList()
	})
	//页面上拉
	onReachBottom(()=>{
		console.log(1111,rotographList.status)
		if(rotographList.status=='noMore'){
			return
		}
		rotographList.params.page++;
		getList()
	})

	// 点击跳转到缴费页面
	let chargingFeeBtn = () => {
		uni.navigateTo({
			url: '../ChargingFee/ChargingFee'
		});
	}

	//点击上报维修
	let maintenanceBtn = () => {
		uni.navigateTo({
			url: '../maintenance/maintenance'
		});
	}
</script>

<style scoped>
	.container {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}

	.header-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.swiper {
		width: 700rpx;
		height: 380rpx;
	}

	.swiper swiper-item image {
		width: 700rpx;
		height: 380rpx;
	}

	.operation {
		width: 700rpx;
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.charging-fee,
	.maintenance {
		width: 340rpx;
		height: 170rpx;
		background-color: #08AEEA;
		background-image: linear-gradient(90deg, #08AEEA 0%, #2AF598 100%);
		border-radius: 20rpx;
		font-size: 40rpx;
		font-weight: bolder;
		letter-spacing: 6rpx;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.maintenance {
		background-color: #FBAB7E;
		background-image: linear-gradient(90deg, #FBAB7E 0%, #F7CE68 100%);
	}

	.charging-fee-title {
		height: 120rpx;
		padding-left: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-box {
		width: 340rpx;
		display: flex;
		justify-content: flex-end;
	}

	.notice {
		width: 700rpx;
		height: 100rpx;

		margin-top: 40rpx;
	}

	.notice-title {
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.notice-title>text {
		font-size: 40rpx;
		font-weight: bold;
	}

	.notice-list {
		padding: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.notice-list-item {
		width: 700rpx;
		height: 120rpx;
		padding: 10rpx 0;
		margin: 16rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-bottom: 2rpx solid #f8f8f8;
		border-top: 2rpx solid #f8f8f8;
	}

	.notice-content {
		font-size: 36rpx;
	}

	.notice-publisher {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		color: #999;
	}
</style>
