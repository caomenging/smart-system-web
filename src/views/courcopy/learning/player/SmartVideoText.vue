<template>
  <div class="post-index cardDiv-faan">
    <div>
      <div class='video'>
        <video-player class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
                      @play="onPlayerPlay($event)"
                      @pause="onPlayerPause($event)"
                      @ended="onPlayerEnded($event)"
                      @loadeddata="onPlayerLoadeddata($event)"
                      @waiting="onPlayerWaiting($event)"
                      @playing="onPlayerPlaying($event)"
                      @timeupdate="onPlayerTimeupdate($event)"
                      @canplay="onPlayerCanplay($event)"
                      @canplaythrough="onPlayerCanplaythrough($event)"
                      @ready="playerReadied"
                      @statechanged="playerStateChanged($event)"
        ></video-player>
      </div>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import {AwesomeSwiper} from  'vue-awesome-swiper'
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import 'video.js/dist/video-js.css'
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
import 'videojs-flash'
import 'videojs-contrib-hls'
import progress from "ant-design-vue/lib/progress/progress"


export default {
  name: "video",
  components: {
    videoPlayer
  },

  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: ''
          //require( "E:\\java\\WorkSpace\\ISPER_UI_9_19\\src\\views\\business\\progress\\video\\bunn.mp4" )//url地址
        }],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,  //全屏按钮
        }
      }
    }
  },
  created() {
    //获取视频的url
     this.get_num()
     //this.url = require("D:/soft_ware/Idea_Project/[HYSUB]Ganbare Douki-chan[10][BIG5_MP4][1920X1080].mp4");
    // this.url = require("D:\\doc\\study\\Code\\Java\\smart-system-server\\upload_file"+this.getUrlKey("url"));
    this.playerOptions['sources'][0]['src'] = this.url;
    this.onPlayerPlay
  },

  // mounted() {
  //   this.videoPlayer()
  // },
  // 对应的methods
  methods: {
    getUrlKey: function (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
    },
    get_num() {
      let path=decodeURIComponent(this.getUrlKey('url'))
      console.log(path)
      this.num = path
      console.log(this.num)
      // if (this.num === '521') {
      //   this.url = 'http://img.ksbbs.com/asset/Mon_1703/05cacb4e02f9d9e.mp4'
      // } else {
      //   // 这里有问题
      //   axios.get('${this.$settings.HOST}/planes/repair/${this.num}',
      //   )
      //     .then(response => {
      // **最关键的地方**
      // *加粗样式#响应成功的数据中提取url赋值给变量url
      // 2021-12-12 修改url地址，去掉ip @Author CabbSir
      this.url = "/smart-system/sys/common/static/" + this.num;
      // this.url = "D:/doc/study/Code/Java/smart-system-server/upload_file" + this.num;
      //         #将url赋值给src
      this.playerOptions['sources'][0]['src'] = this.url;

      console.log(this.url)
      //   }).catch(error => {
      //     console.log(error);
      //     console.log('‘对不起维修信息获取失败‘')
      //   })
      // }
      return this.num;
    },



/*    videoPlayer(){
      const that = this;
      let resetTime = 0;//拖动后重置播放时间
      let curTime = 0;//当前播放时间
      const vd = document.getElementById("video");//获取video对象
      const getCurTime = localStorage.getItem("remTime");//获取本地存储
      console.log(getCurTime)
      if(getCurTime >0.1){
        curTime = getCurTime;
        resetTime = getCurTime;
        vd.addEventListener("paly",function () {
          setTimeout(function (){
            vd.currentTime = get_Component;
            setInterval(timer,100);
            },2000);
          })
      }else{
        vd.play();
        setInterval(timer,100);
      }//定时器

      function timer() {
        curTime = vd.currentTime;
        var apartTime = curTime - resetTime;
        if(apartTime > 2){
          vd.currentTime = resetTime;
        }else{
          resetTime = curTime;
        }
        that.currentTime = curTime;
      }
      vd.addEventListener("pause",function (){
        localStorage.setItem("remTime",that.curTime);
      });
    },
    gogo(){
      this.$router.push("/Request");
    },

 */
    //监听播放
    onPlayerPlay(player) {
      console.log(player);
      // this.$refs.videoPlayer.player.play();
    },

    //监听暂停
    onPlayerPause(player) {
      console.log(player);
      // this.$refs.videoPlayer.player.pause();
    },
    //监听播放状态改变
    playerStateChanged(player) {
      // console.log(player);
    },

    //监听媒体是否已到达结尾，播放完
    onPlayerEnded(player) {
      // console.log(player);
    },

    //DOM元素上的readyState更改导致播放停止。
    onPlayerWaiting(player) {
      // console.log(player);
    },

    //媒体不再被禁止播放，并且已开始播放。
    onPlayerPlaying(player) {
      // console.log(player);
    },

    //当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata(player) {
      // console.log(player);
    },

    //当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      console.log(player.cache_.currentTime);
      // 禁止拖动进度条
      const timer = setInterval(function() {
        const currentTime = player.cache_.currentTime
        let originTime = player.cache_.originTime
        // console.log(currentTime, originTime)
        if (currentTime - originTime > 1) {
          player.cache_.currentTime = originTime
        }
        player.cache_.originTime = currentTime
      }, 100)
    },

    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },

    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      // debugger
      // this.sources.src = require( "E:\\java\\WorkSpace\\ISPER_UI_9_19\\src\\views\\business\\progress\\video\\bunn.mp4" )
      player.currentTime(0)
    }
  }
};
</script>
