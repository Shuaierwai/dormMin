<template>
	<view class="maintenance">
		<view class="maintenance-box">
			<text>上报维修</text>
		</view>
		<view class="maintenance-form">
			<uni-forms :modelValue="formData" ref="form" :rules="formData.rules">
				<uni-forms-item label="姓名" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="楼宇号" name="buildingNumber">
					<uni-easyinput disabled type="text" v-model="formData.buildingNumber" placeholder="请输入楼宇号" />
				</uni-forms-item>
				<uni-forms-item label="寝室号" name="dormId">
					<uni-easyinput disabled type="text" v-model="formData.dormId" placeholder="请输入寝室号" />
				</uni-forms-item>
				<uni-forms-item label="维修的内容" name="repairContent">
					<uni-easyinput type="text" v-model="formData.repairContent" placeholder="请输入维修内容" />
				</uni-forms-item>
				<uni-section title="只选择图片" type="line">
					<view class="example-body">
						<uni-file-picker limit="1" title="提交维修的图片,最多1张图片" ref="files" :auto-upload="false" mode="grid"
							@select="select" @success="success" @fail="fail"></uni-file-picker>
					</view>
				</uni-section>

				<button class="maintenance-btn" @tap="submitForm">确定提交</button>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from "vue";
	import {
		onShow,
		onPullDownRefresh,
		onReachBottom
	} from '@dcloudio/uni-app';
	import {
		formatDate
	} from '@/utils/date.js'
	import {
		myRequest
	} from '@/utils/api.js'
	let files = ref(null)
	let form = ref(null)
	let formData = reactive({
		name: '',
		dormId: '',
		buildingNumber: '',
		repairContent: "",
		tempFilePaths: "", //获取图片的地址
		rules: {
			name: {
				rules: [{
					required: true,
					errorMessage: '请输入名字',
				}]
			},
			repairContent: {
				rules: [{
					required: true,
					errorMessage: '请输入描述',
				}]
			},
		}
	})
	onShow(()=>{
		let userInfo = uni.getStorageSync('loginUser');
		console.log(userInfo);
		formData.buildingNumber=userInfo[0].b_name;
		formData.dormId=userInfo[0].d_num;
	})
	let select = (e) => {
		console.log("获取上传状态", e.tempFilePaths[0])
		formData.tempFilePaths = e.tempFilePaths[0]
		console.log(formatDate())
	}

	let success = (e) => {
		console.log("上传成功", e.tempFilePaths[0])

	}
	let fail = (e) => {
		console.log("上传失败", e)
	}

	let submitForm = () => {
		console.log(files.value.upload())
		let oDate = new Date()
		let studentId=uni.getStorageSync('loginUser')
		form.value.validate((valid) => {
			console.log(valid)
			if (valid) {
				console.log("验证失败");
			} else {
				console.log("验证成功");
				console.log(formData.tempFilePaths)
				uni.uploadFile({
					url: 'http://localhost:8880/UploadRepairs', //仅为示例，非真实的接口地址
					filePath: formData.tempFilePaths,
					name: 'myfile',
					formData: {
						'context': formData.repairContent.trim(),
						'repairTime': formatDate('YY-MM-DD hh:mm:ss'),
						'studentId': studentId[0].s_id
					},
					success: (uploadFileRes) => {
						console.log(uploadFileRes.data);
						let obj = JSON.parse(uploadFileRes.data)
						if (obj.code == 200) {
							uni.showToast({
								title: '上传成功',
								duration: 2000
							});
							uni.redirectTo({
								url: '../dormHome/dormHome'
							});
						}
					}
				});
			}
		})
	}
</script>

<style scoped>
	.maintenance {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.maintenance-box {
		width: 700rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40rpx;
		font-weight: bold;
		border-bottom: 2rpx solid #999;
	}

	.maintenance-form {
		width: 700rpx;
		padding: 20rpx;
	}

	.maintenance-btn {
		margin: 20rpx 0;
	}
</style>
