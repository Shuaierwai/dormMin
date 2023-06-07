<template>
	<view class="box">
		<view class="ChargingFee-box">
			<!-- 寝室电费余额 -->
			<view class="Top-up-money">
				<view class="Top-up-money-prompt">
					<text>{{moneyNumList.dormName}}电费余额</text>
				</view>
				<view class="dorm-money">
					<text>{{moneyNumList.dormMoney}}</text>
				</view>
			</view>
			<!-- 点击输入电费 -->
			<view class="InputMoney">
				<uni-forms :modelValue="moneyNumList" ref="form" :rules="moneyNumList.rules">
					<uni-forms-item name="inputMoney">
						<input class="InputMoney-box" v-model="moneyNumList.inputMoney" type="text" inputmode="numeric"
							placeholder="请输入充值金额">
					</uni-forms-item>
				</uni-forms>

			</view>
			<view class="money-num">
				<view @tap="seleMoney" :data-num="item.num" class="money-num-item" hover-class="money-num-item-hover"
					v-for="item in moneyNumList.money" :key="item.id">
					<text>￥{{item.num}}</text>
				</view>
			</view>
			<view class="top-up-btn">
				<button type="primary" @click="moneyTap">立刻充值</button>
			</view>
		</view>

	</view>
     <view class="">
     	<web-view v-if="moneyNumList.isShow" :src="moneyNumList.src"></web-view>
     </view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	// 引入小程序生命周期
	import {
		onShow,
		onPullDownRefresh,
		onReachBottom
	} from '@dcloudio/uni-app';
	//封装请求
	import {
		myRequest
	} from '@/utils/api.js'
	//导入时间
	import {
		formatDate
	} from '@/utils/date.js'
	let form = ref(null)
	let moneyNumList = reactive({
		
		money: [{
			id: 1,
			num: "20"
		}, {
			id: 2,
			num: "50"
		}, {
			id: 3,
			num: "100"
		}],
		isShow:false,
		src:"",
		inputMoney: '',
		dormName:'',
		dormMoney:'',
		studentName:"",
		dormId:'',
		studentId:'',
		rules: {
			inputMoney: {
				rules: [{
					required: true,
					errorMessage: '请输入充值金额',
				}, {
					validateFunction: function(rule, value, data, callback) {
						let reg = /^\d{1,}$/g;
						if (!reg.test(value)) {
							callback('金额格式错误，只能为数字')
						}
						return true
					}
				}]
			},
		}
	})
	onShow(()=>{
		let userInfo = uni.getStorageSync('loginUser');
		console.log(userInfo)
		moneyNumList.dormName=userInfo[0].d_num;
		moneyNumList.dormId=userInfo[0].d_id;
		moneyNumList.studentId=userInfo[0].s_id;
		moneyNumList.studentName=userInfo[0].s_name;
		getDorm()
	})
	let getDorm=()=>{
		console.log(moneyNumList.dormId)
		myRequest({
			url:'/getDormMoney',
			data:{
				id:moneyNumList.dormId
			}
		}).then((res)=>{	
			console.log(res.data.data[0].d_money)
			if(res.data.code==200){
				moneyNumList.dormMoney=res.data.data[0].d_money
			}
		})
	}
	//点击选择的金钱数量
	let seleMoney = (e) => {
		console.log(e)
		let money = e.currentTarget.dataset.num;
		console.log(moneyNumList.inputMoney)
		moneyNumList.inputMoney = money
	}

	//点击充值
	let moneyTap = () => {
		form.value.validate((valid) => {
			console.log(valid)
			if (valid) {
				console.log("验证失败");
			} else {
				console.log("充值成功成功");
				moneyNumList.isShow=true;
				myRequest({
					url: '/pay', //
					method:'post',
					data: {
						id:moneyNumList.studentId,
						orderId: '2021100121699395',
						student:moneyNumList.studentName,
						price: moneyNumList.inputMoney,
						dormId:Number(moneyNumList.dormId),
						payDate:formatDate('YY-MM-DD hh:mm:ss'),
					},
				}).then((res)=>{
					console.log(res)
					if(res.data.code==200){
						moneyNumList.src=res.data.result
						uni.showToast({
							title: '充值成功',
							duration: 2000
						});
						setTimeout(()=>{
							uni.redirectTo({
						     	url: '../dormHome/dormHome'
							 });
						},2000)
						// 
						// getDorm()
					}
					
					// uni.requestPayment({
					// 	provider: 'alipay', //wxpay微信 alipay支付宝
					// 	orderInfo: formData, //订单数据 后台返回的数据  
					// 	success: function(res) {
					// 		uni.showToast({
					// 			title: '支付成功'
					// 		})
					// 	},
					// 	// 参数有问题则抛出错误
					// 	fail: function(err) {
					// 		uni.showToast({
					// 			title: '支付失败'
					// 		})
					// 	},
					// })
					
				})
				
		
			}
		})
	}
</script>

<style scoped>
	.box {
		height: 100vh;
		background: #eff1fe;
	}

	.ChargingFee-box {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.Top-up-money {
		width: 700rpx;
		height: 300rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		background-color: #08AEEA;
		background-image: linear-gradient(0deg, #08AEEA 0%, #2AF598 100%);

	}

	.Top-up-money-prompt {
		color: #fff;
		font-size: 32rpx;
		font-weight: bolder;
	}

	.dorm-money {
		color: #fff;
		margin: 20rpx 0;
		font-size: 40rpx;
		font-weight: bolder;
	}

	.InputMoney {
		width: 750rpx;
		height: 100rpx;
		margin: 20rpx 0;
		background: #fff;
	}

	.InputMoney-box {
		width: 700rpx;
		height: 100rpx;
		padding: 0 40rpx;
	}

	.money-num {
		width: 700rpx;
		height: 200rpx;
		margin-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: space-between;
	}

	.money-num-item {
		width: 200rpx;
		height: 95rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 38rpx;
		font-weight: bolder;
		border-radius: 20rpx;
		background: #fff;
	}

	.money-num-item-hover {
		background: #6d97f8;
		color: #fff;
	}

	.top-up-btn {
		width: 700rpx;
	}

	.top-up-btn button {
		width: 700rpx;
	}
</style>
