<template>
<view class="content">
		<button @click="loginBtn">登录</button>
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		    <image class="avatar" :src="avatarUrl"></image>
		  </button> 
		  <input type="nickname" class="weui-input" placeholder="请输入昵称"/>
	</view>
</template>

<script setup>
	
	     import {ref} from 'vue'
		import {onShow,onLoad} from '@dcloudio/uni-app'
		import {loginApi2} from '@/utils/loginApi.js'
		
		const avatarUrl = ref('')
		
		const loginBtn = () => {
			uni.login({
				provider: 'weixin', //使用微信登录
				success: function (res) {
					console.log('uni。login 调用成功',res);
					if(res.code){
						//接口调用成功
						loginApi2({code:res.code}).then((res) => {
							console.log('向后端发送登录请求',res);
						})
						
					}else{
						
					}
				}
			});
		}
		
		const onChooseAvatar = (e) => {
			console.log( e )
			 const { avatarUrl } = e.detail 
			
			avatarUrl = avatarUrl
		}
</script>

<style>
</style>