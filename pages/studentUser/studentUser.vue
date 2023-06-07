<template>
	<view class="studentUser">
		<view class="student-user">
			<view class="user-name">
				<text>{{studentData.userName}}</text>
				<view class="user-class">
					<text>{{studentData.academy}}</text>
					<text style="margin-left: 10rpx;">{{studentData.className}}</text>
				</view>
			</view>

		</view>

		<view class="user-info">
			<!-- 寝室 -->
			<view class="user-dorm-box">
				<view class="user-dorm-name">
					<text>{{studentData.BuildingName}} {{studentData.dormName}}</text>
				</view>
				<text class="user-dorm">所属寝室</text>
			</view>
			<!-- 寝室余额 -->
			<view class="user-dorm-box">
				<view class="user-dorm-name">
					<text>￥{{studentData.dormMoney}}</text>
				</view>
				<text class="user-dorm">所属寝室余额</text>
			</view>
			<view class="user-dorm-box">
				<view class="user-dorm-name">
					<text>{{studentData.dormStatus}}</text>
				</view>
				<text class="user-dorm">所属寝室状态</text>
			</view>



		</view>
		<!-- 缴费记录和上报维修 -->
		<view class="user-actions">
			<view class="user-actions-pay" hover-class="user-actions-pay-hover" @tap="paymentBtn">
				<view class="user-actions-pay-left">
					<uni-icons type="cart-filled" size="30"></uni-icons>
					<text>缴费记录</text>
				</view>
				<uni-icons type="right" size="30"></uni-icons>
			</view>
			<!-- 上报维修 -->
			<view class="user-actions-repair" hover-class="user-actions-repair-hover" @tap="maintenanceBtn">
				<view class="user-actions-pay-left">
					<uni-icons type="settings" size="30"></uni-icons>
					<text>维修记录</text>
				</view>
				<uni-icons type="right" size="30"></uni-icons>
			</view>
			<button class="quit-login" type="warn" @tap="quitLogin">退出登录</button>
		</view>

	</view>
</template>

<script setup>
	import {
		onShow,
		onPullDownRefresh,
		onReachBottom
	} from '@dcloudio/uni-app';
	import {
		reactive
	} from "vue";
	import {
		myRequest
	} from '@/utils/api.js'
	let studentData = reactive({
		    userId:"",//学生id
			userName:'',//名字
			academy:'',//学院
			className:'',//班级
            dormName:'',//寝室
		    BuildingName:'',//楼宇
			dormMoney:'' ,//寝室剩余金钱
			dormStatus:'',//寝室状态 1为正常,0为欠费
	})
	//页面一出来
	onShow(() => {
		let userInfo = uni.getStorageSync('loginUser');
		console.log(userInfo)
		
		myRequest({
			url:'/getStudentDataMini',
			data:{
				id:userInfo[0].s_id
			}
		}).then((res)=>{
			console.log(res);
			if(res.data.code==200){
				studentData.userName=res.data.data[0].s_name
				studentData.dormName=res.data.data[0].d_num
				studentData.BuildingName=res.data.data[0].b_name
				studentData.dormMoney=res.data.data[0].d_money
				studentData.dormStatus=res.data.data[0].d_state==1?'正常':'欠费'
				studentData.academy=res.data.data[0].a_name
				studentData.className=res.data.data[0].c_name
			
			}
		})
	})
	//点击缴费记录
	let paymentBtn = () => {
		uni.navigateTo({
			url: '../paymentHistory/paymentHistory'
		});
	}
	//点击维修记录
	let maintenanceBtn = () => {
		uni.navigateTo({
			url: '../maintenanceRecord/maintenanceRecord'
		});
	}

	//点击退出登录
	let quitLogin = () => {
		async function timeout(ms) {
			await new Promise(() => {
				setTimeout(() => {
					uni.redirectTo({
						url: '../index/index'
					});
				}, 2000);
			});
		}
		timeout();
		try {
			uni.removeStorageSync('loginUser');
		} catch (e) {
			// error
		}
		uni.showToast({
			title: '退出成功！',
			duration: 2000
		});


	}
</script>

<style scoped>
	.studentUser {
		width: 750rpx;
		height: 100vh;
		background: #f7f7f7;
	}

	.student-user {
		width: 750rpx;
		height: 260rpx;
		color: #fff;
		position: relative;
		background: #2a2f33;
	}

	.user-name {
		font-size: 40rpx;
		font-weight: bold;
		position: absolute;
		top: 30rpx;
		left: 40rpx;
	}

	.user-class {
		font-size: 26rpx;
		font-weight: 300;
		margin-top: 10rpx;
	}

	.user-dorm-box {
		width: 200rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	.user-dorm-name {
		font-size: 40rpx;
		font-weight: bolder;
	}

	.user-dorm {
		font-size: 28rpx;
		font-weight: bold;
	}

	.user-info {
		width: 680rpx;
		height: 240rpx;
		color: #fff;
		background-color: #08AEEA;
		background-image: linear-gradient(90deg, #08AEEA 0%, #2AF598 100%);
		border-radius: 10rpx;
		position: absolute;
		top: 140rpx;
		left: 35rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}


	.user-info-dorm-box {
		width: 160rpx;
		height: 60rpx;
		margin: 20rpx;
		border-radius: 10rpx;
		font-size: 40rpx;
		font-weight: bolder;
		color: #2fb45d;
		background: #107647;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.user-info-box {
		width: 700rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.user-info-cost {
		padding-left: 20rpx;
		font-weight: 700;
		font-size: 48rpx;
	}

	.user-info-state {
		padding-right: 20rpx;
		font-weight: 700;
		font-size: 48rpx;
	}

	.user-actions {
		width: 750rpx;
		position: absolute;
		top: 420rpx;
		left: 0;
	}

	.user-actions-pay,
	.user-actions-repair {
		width: 750rpx;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
	}

	.user-actions-repair-hover,
	.user-actions-pay-hover {
		background: #f7f7f7;
	}

	.user-actions-pay-left {
		padding-left: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.user-actions-repair {
		margin-top: 10rpx;
	}

	.quit-login {
		width: 700rpx;
		margin-top: 260rpx;
	}
</style>
