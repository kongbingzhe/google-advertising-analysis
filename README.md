# google-advertising-analysis
A Google extension is used to analyze the advertising ranking of e-businesses such as Facebook and Shopify in Google Image Search

# 参考文档
- [谷歌扩展程序开发文档](https://developer.chrome.com/docs/extensions/mv3/getstarted/)


## 目录结构

```
|- src                        服务端代码
    |
    |- background.html        扩展插件的承载页，详细请参考谷歌插件开发
    |
    |- popup.html             扩展插件提供给用户操作的弹出层页面
    |
    |- images                 图片资源
    |
    |- scripts                background.html、popup.html等页面需要的js文件和需要用到的工具库
    |
    |- styles                 background.html、popup.html等页面需要的css文件

```

## 使用方法

1. 右键图片打开选项，点击在谷歌中搜索图片，开发相应的搜索页面之后
2. 插件会自动打开并统计汇总各个电商平台图片对应商品的推广排名和数量，不需要点击下一页等操作
3. 如果需要重置数据，可以点击重新点击插件图标，会重新统计数据