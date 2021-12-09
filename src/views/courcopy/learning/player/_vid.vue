<!--<template>-->

<!--   <div>-->
<!--    &lt;!&ndash; 阿里云视频播放器样式 &ndash;&gt;-->
<!--   <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css" >-->
<!--    &lt;!&ndash; 阿里云视频播放器脚本 &ndash;&gt;-->
<!--   <script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js"></script>-->

<!--    &lt;!&ndash; 定义播放器dom &ndash;&gt;-->
<!--    <div id="J_prismPlayer" class="prism-player"> </div>-->
<!--    </div>-->

<!--</template>-->

<!--<script>-->
<!--import vod from '../../api/api/vod'-->
<!--import cookie from 'js-cookie'-->
<!--export default {-->

<!--  layout: 'video',//应用video布局-->
<!--  asyncData({ params, error }) {-->
<!--    return vod.getPlayAuth(params.vid).then(response => {-->
<!--      // console.log(response.data.data)-->
<!--      return {-->
<!--        lodd:false,-->
<!--        aliplayerSdkPath:'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js',-->
<!--        vid: params.vid,-->
<!--        playAuth: response.data.data.playAuth,-->
<!--        scriptTagStatus: 0,-->
<!--      }-->
<!--      //console.log('11111')-->
<!--      //console.log(this.log)-->
<!--    })-->
<!--  },-->
<!--  methods: {-->
<!--       istoken(){-->
<!--        if(cookie.get('guli_token')){-->
<!--          return true-->
<!--        }-->
<!--        else{-->
<!--          return false-->
<!--        }-->
<!--      },-->
<!--      action(){-->

<!--        var player = window.Aliplayer({-->
<!--               id: 'J_prismPlayer',-->
<!--               vid: this.vid, // 视频id-->
<!--               playauth: this.playAuth, // 播放凭证-->
<!--               encryptType: '1', // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置此项-->
<!--               width: '100%',-->
<!--               height: '800px',-->
<!--               // 以下可选设置-->
<!--               //cover: 'https://edu-lideyu.oss-cn-beijing.aliyuncs.com/test/2021/09/20/0dcbee3f-2530-4c2c-829c-bfe94a346bcf.jpg', // 封面-->
<!--               qualitySort: 'asc', // 清晰度排序-->

<!--               mediaType: 'video', // 返回音频还是视频-->
<!--               autoplay: true, // 自动播放-->
<!--               isLive: false, // 直播-->
<!--               rePlay: false, // 循环播放-->
<!--               preload: true,-->
<!--               controlBarVisibility: 'hover', // 控制条的显示方式：鼠标悬停-->
<!--               useH5Prism: true, // 播放器类型：html5-->
<!--           },-->
<!--          function(player) {-->
<!--             console.log('播放器创建成功')-->
<!--          })-->
<!--      },-->

<!--      -->
<!--      insertScriptTag () {-->
<!--        const _this = this-->
<!--        let playerScriptTag = document.getElementById('playerScriptTag')-->
<!--        console.log('playerScriptTag',playerScriptTag)-->
<!--        // 如果这个tag不存在，则生成相关代码tag以加载代码-->
<!--        if (playerScriptTag === null) {-->
<!--          playerScriptTag = document.createElement('script')-->
<!--          playerScriptTag.type = 'text/javascript'-->
<!--          playerScriptTag.src = this.aliplayerSdkPath-->
<!--          playerScriptTag.id = 'playerScriptTag'-->
<!--          let s = document.getElementsByTagName('head')[0]-->
<!--          s.appendChild(playerScriptTag)-->
<!--        }-->
<!--        if (playerScriptTag.loaded) {-->
<!--          _this.scriptTagStatus++-->
<!--        } else {-->
<!--          playerScriptTag.addEventListener('load', () => {-->
<!--            _this.scriptTagStatus++-->
<!--            playerScriptTag.loaded = true-->
<!--            _this.action()-->
<!--          })-->
<!--        }-->
<!--        _this.action()-->
<!--      },-->
<!--  },-->
<!--  created () {-->
<!--        // this.dataUpdate();-->

<!--      // if (window.Aliplayer !== undefined) {-->
<!--      //   // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器-->
<!--      //   this.scriptTagStatus = 2-->
<!--      //   this.action()-->
<!--      // } else {-->
<!--      //   // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码-->
<!--      //   this.insertScriptTag()-->
<!--      // }-->

<!--    },-->
<!--    mounted() {//页面渲染之后-->
<!--      this.lodd = true-->
<!--      if (window.Aliplayer !== undefined) {-->
<!--        console.log('有')-->
<!--       // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器-->
<!--       this.scriptTagStatus = 2-->
<!--       this.action()-->
<!--      } else {-->
<!--       console.log('没有')-->
<!--       // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码-->
<!--       this.insertScriptTag()-->
<!--      }-->
<!--    }-->
<!--}-->
<!--</script>-->
<!--<style>-->
<!--  @import url(https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css);-->
<!--</style>-->
