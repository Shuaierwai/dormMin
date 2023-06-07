<template>
	<view class="paymentHistory">
		<!-- <scroll-view scroll-y="true"  >
			
		</scroll-view> -->
		<view class="paymentHistory-list">
			<uni-card class="pay-card" ref="payCard" :title="toDate(item.p_date) " v-for="item in payData.payList"
				:key="item.id">
				<view class="recharge-record">
					<text>充值人：{{item.s_name}}</text>
					<view>
						<text>充值金额：￥{{item.p_payAmount}}</text>
					</view>
				</view>
			</uni-card>
		</view>
		<uni-load-more iconType="circle" :status="payData.status" :content-text="payData.contentText"></uni-load-more>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from "vue";
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom,
	} from '@dcloudio/uni-app';
	//封装请求
	import {
		myRequest
	} from '@/utils/api.js'
	//导入时间
	import {
		formatDate,
		toDate
	} from '@/utils/date.js'
	let payCard = ref(null)
	let payData = reactive({
		payList: [], //缴费记录表
		studentId: "", //缴费学生的id
		totalNum: '', //每个页面总个数
		currentNum: '', //当前数据个数
		cardHeight: "",
		height: "",
		status: 'More',
		//先渲染5条数据
		params: {
			count: 7,
			page: 1,
		},
		contentText: {
			contentdown: '上拉加载更多~',
			contentrefresh: '加载中',
			contentnomore: '暂无更多~'
		},
	})
	//一上来渲染
	onShow(() => {
		let userInfo = uni.getStorageSync('loginUser')
		payData.studentId = userInfo[0].s_id
		console.log(userInfo)
		render()
	
	})

	//渲染函数
	let render = () => {
		// payData.totalNum = parseInt(uni.getSystemInfoSync().windowHeight / 82)
		 // console.log(payData.totalNum)
		myRequest({
			url: '/getStudentPayMini',
			data: {
				count:payData.params.count,
				page: payData.params.page,
				id: payData.studentId
			}
		}).then((res) => {
			console.log(res)
			if (res.data.code == 200) {
				console.log('79', payData.totalNum, res.data.total)
				if(res.data.data.length<payData.params.count){
					payData.status='noMore'
				}
				payData.payList.push(...res.data.data)
			}
		})
	}

	onPullDownRefresh(() => {
		render()
	})
	//页面上拉
	onReachBottom(() => {
		if(payData.status == 'nomore'){
				return
			}
			payData.params.page++;
			render();
	})
</script>

<style scoped>
	.paymentHistory {
		width: 750rpx;
	}

	.paymentHistory-list {
		width: 750rpx;
	}

	.recharge-record {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
