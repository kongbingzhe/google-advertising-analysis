//监听插件安装成功
chrome.runtime.onInstalled.addListener(getPermit);

//防止统计网站身份验证
function getPermit() {
	Object.defineProperties(navigator, { webdriver: { get: () => undefined } });
}




//state
/**
 'black&white':{
	 key: {
		 black : {
			 apply: 13
			 fasf : 312
		 },
		 white: {
			 fdfa: 31,
			 fsadf: 31
		 },
		 page: 1
		 finished: false
	 } 
	 }
**/