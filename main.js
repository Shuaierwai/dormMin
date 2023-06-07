
// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	// app.config.globalProperties.$http=http
	return {
		app
	}
}
// #endif
