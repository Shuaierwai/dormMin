import {myRequest} from './api.js'
export function loginApi(data){
	return myRequest({
		url: '/loginXcx', //。
		method:'get',
		data
	})
}

export function loginApi2(data){
	return myRequest({
		url: '/wxlogin', //。
		method:'get',
		data
	})
}