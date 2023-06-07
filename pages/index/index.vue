<template>
	<view class="content">
		<image class="login-img" src="../../static/images/logo.png"></image>
		<view class="login-title">
			<text>高校宿舍管理小程序</text>
		</view>
		<view class="login-box">
			<uni-forms :modelValue="formData" label-position="top" ref="form" :rules="rules">
				<uni-forms-item label="学生账号" name="user">
					<uni-easyinput type="text" v-model="formData.user" placeholder="请输入账号" />
				</uni-forms-item>
				<uni-forms-item label="密码" name="pass">
					<uni-easyinput type="password" v-model="formData.pass" placeholder="请输入密码" />
				</uni-forms-item>
			</uni-forms>
			<button @click="submitForm">登录</button>
		</view>

	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	// 封装的http请求
	import {
		loginApi
	} from '@/utils/loginApi.js'
	
	import {
		myRequest
	} from '@/utils/api.js'
	let form = ref(null);
	let formData = reactive({
		user: '',
		pass: '',
	})
	//表单规则
	let rules = reactive({
		user: {
			rules: [{
				required: true,
				errorMessage: '请输入账号',
			}, {
				validateFunction: function(rule, value, data, callback) {
					let reg = /^\d{1,}$/g;
					if (!reg.test(value)) {
						callback('账号格式错误，只能为数字')
					}
					return true
				}
			}]
		},
		pass: {
			rules: [{
				required: true,
				errorMessage: '请输入密码',
			}, {
				validateFunction: function(rule, value, data, callback) {
					let reg = /^\d{1,}$/g;
					if (!reg.test(value)) {
						callback('账号格式错误，只能为数字')
					}
					return true
				}
			}]
		}

	})

	let submitForm = () => {
		console.log(1111)
		form.value.validate().then(res => {
			console.log('表单数据信息：', res);
			let data = {
				userName: res.user,
				password: res.pass
			}
			 console.log(data)
			loginApi(data).then(res => {
				console.log(res)
				if (res.data.code == 200) {
						uni.showToast({
							title: '登录成功！',
							duration: 3000
						});
						//存储登陆者信息
						try {
							uni.setStorageSync('loginUser', res.data.data);
							uni.switchTab({
								url: '../dormHome/dormHome'
							});
						} catch (e) {
							// error
							console.log(e)
						}
						
					}
					if (res.data.code == 401) {
						uni.showToast({
							title: '账号或密码错误！',
							duration: 3000
						});
					}
			})

			// myRequest({
			// 	url: '/loginXcx', //。
			// 	method: 'get',
			// 	data: {
			// 		userName: formData.user.trim(),
			// 		password: formData.pass.trim()
			// 	}
			// }).then((res) => {
			// 	console.log(res)
			// 	if (res.data.code == 200) {
			// 		uni.showToast({
			// 			title: '登录成功！',
			// 			duration: 3000
			// 		});
			// 		//存储登陆者信息
			// 		try {
			// 			uni.setStorageSync('loginUser', res.data.data);
			// 		} catch (e) {
			// 			// error
			// 		}
			// 		uni.switchTab({
			// 			url: '../dormHome/dormHome'
			// 		});
			// 	}
			// 	if (res.data.code == 401) {
			// 		uni.showToast({
			// 			title: '账号或密码错误！',
			// 			duration: 3000
			// 		});
			// 	}
			// }).catch((res) => {
			// 	console.log(err)
			// });
		}).catch(err => {
			console.log('表单错误信息：', err);

		})
	}
</script>

<style scoped>
	page {
		width: 100%;
		height: 100%;

	}

	.content {
		height: 100vh;
		background-color: #0E9489;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.login-img {
		width: 300rpx;
		height: 200rpx;
		border-radius: 50%;
	}

	.login-title {
		margin: 20rpx 0;
		font-size: 40rpx;
		font-weight: bold;
	}

	.login-box {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 50rpx 20rpx;
		border: 2rpx solid #cccccc;
	}
</style>
