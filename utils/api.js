//你的请求地址(线上或线下) 172.16.110.48
  const BASE_URL="http://localhost:8880"      
  // 向外暴露一个方法 myRequest
  export const myRequest = (options) => { 
	  // console.log(options.data,options)
      return new Promise((resolve, reject) => { 
          uni.request({ 
              // 开发者服务器接口地址（请求服务器地址 + 具体接口名）
              url: BASE_URL + options.url,
              // 请求方式（若不传，则默认为 GET ）
              method: options.method || 'GET',
              // 请求参数（若不传，则默认为 {} ）
              data: options.data || { },
              // 请求成功
              success: (res) => { 
                  resolve(res)
              },
              // 请求失败
              fail: (err) => { 
                  reject(err)
              },
              //请求结束之后，执行的回调函数（成功或失败都会执行）
              complete() { 
                  //隐藏loading
                  
              }
          })
      })
  }
