<template>
	<!-- 维修记录 -->
	<view class="maintenance-record">
		<view class="maintenance-record-list">
			<uni-card :title="toDate(item.m_time)" :extra="mainData.dormName" v-for="item in mainData.mainList" :key="item.id">
				<view class="maintenance-record-state">
					<text>维修内容：{{item.m_content}}</text>
					<text style="color: #66CC66;" v-if="item.m_state == 0 ? false : true">已处理</text>
					<text style="color: #FF0033;" v-else>未处理</text>
				</view>
			</uni-card>
		</view>
	</view>
	<uni-load-more iconType="circle" :status="mainData.status" :content-text="mainData.contentText"></uni-load-more>
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
	//封装请求
	import {
		myRequest
	} from '@/utils/api.js'
	//导入时间
	import {
		formatDate,
		toDate
	} from '@/utils/date.js'
	let mainData = reactive({
		isShow: true,
		mainList: [],
		dormName: '',
		studentId: '',
		time: '', //上报时间
		content: '', //上报内容
		state: '', //状态
		status: 'More',
		ifBottomRefresh: false, //是否触底
		//先渲染5条数据
		params: {
			count: 7,
			page: 1
		},
		contentText: {
			contentdown: '上拉加载更多~',
			contentrefresh: '加载中',
			contentnomore: '暂无更多~'
		},
	})
	//页面一上来
	onShow(() => {
		let userInfo = uni.getStorageSync('loginUser')
		let dormNum = userInfo[0].d_num
		let buildingName = userInfo[0].b_name
		mainData.studentId = userInfo[0].s_id
		mainData.dormName = '上报寝室：' + buildingName + ' ' + dormNum
		console.log(userInfo)
		render()
	})
	
	onPullDownRefresh(() => {
		render()
	})
	//页面上拉
	onReachBottom(()=>{
		console.log(1111)
		if(mainData.status=='noMore'){
			return
		}
		mainData.params.page++;
		render()
	})
	//渲染函数
	let render = () => {
		myRequest({
			url: '/getMaintenanceMini',
			data: {
				count: mainData.params.count,
				page: mainData.params.page,
				id: mainData.studentId
			}
		}).then((res) => {
			console.log(res)
			if (res.data.code == 200) {
			   if(res.data.data.length>mainData.params.count){
				   mainData.status='noMore'
			   }
			  // console.log('94',mainData.mainList);
			   mainData.mainList.push(...res.data.data)
			   
			    
			}
		})
	}
</script>

<style scoped>
	.maintenance-record-state {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
