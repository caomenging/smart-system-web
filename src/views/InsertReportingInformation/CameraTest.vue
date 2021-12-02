<template>
  <div>
    <!-- 照片区域 -->
    <div
      style="
        border-radius: 25px;
        width: 100px;
        height: 30px;
        background-color: #ffddaa;
        border: 2px solid #ccc;
        margin-left: auto;
        margin-right: auto;
      "
      v-on:click="imgClick()"
    >
      点我拍照！
    </div>
    <div
      v-for="(urls, index) in imgs"
      style="margin: 2px; border: 1px solid #ccc"
    >
      <div
        style="text-align: right; position: relative"
        v-on:click="deleteImg(index)"
      >
        X
      </div>
      <img :src="urls" width="200px" height="200px" />
    </div>

    <input
      style="float: left; display: none"
      type="file"
      id="uploadFile"
      accept="image/*"
      v-on:change="readLocalFile()"
    />

    <!--  录像-- -->
     <div>
      <button>点击上传</button>
      <input
        type="file"
        @change="openCamera($event)"
        accept="video/*"
        capture="user"
      />
    </div>
    <!-- accept="video/*" ：accept 属性只能与 <input type="file"> 配合使用。-->
    <!--	它规定能够通过文件上传进行提交的文件类型。 -->
    <!-- 指定capture属性调用默认相机，摄像，录音功能-->



  </div>
</template>

<script>
export default {
  data() {
    //name: CameraTest
    return {
      imgs: [],
    };
  },
  methods: {
    //删除图片
    deleteImg: function (index) {
      this.imgs.splice(index, 1);
    },
    //图片click
    imgClick: function () {
      document.getElementById("uploadFile").click();
    },
    //点击选中图片
    readLocalFile: function () {
      var localFile = document.getElementById("uploadFile").files[0];
      var reader = new FileReader();
      var content;
      var current = this;
      reader.onload = function (event) {
        content = event.target.result;
        current.imgs.push(content); //获取图片base64代码
      };
      reader.onerror = function (event) {
        alert("error");
      };
      content = reader.readAsDataURL(localFile, "UTF-8");
      var sss = document.getElementById("uploadFile").value;
      console.log(sss);
    },
  },
  mounted() {},
  created() {},
  components: {},

  // 录像
  // 调用摄像头 上传视频
  openCamera(t) {
    let that = this;
    let duration;
    let selectedFile = e.target.files[0];
    let reader = new FileReader(); //这是核心,读取操作就是由它完成.
    reader.onload = function (e) {
      let strContent = this.result;
      //获取视频或者音频时长
      let fileurl = URL.createObjectURL(selectedFile);
      let audioElement = new Audio(fileurl);
      //经测试，发现audio也可获取视频的时长
      audioElement.addEventListener("loadedmetadata", function (_event) {
        duration = audioElement.duration;
        if (duration > 8) {
          that.$message.error("视频时间过长，请重新录制");
        } else {
          that.base64ToFile(strContent);
        }
      });
    };
    reader.readAsDataURL(selectedFile); //读取文件的内容,也可以读取文件的URL
  },
  //将bes64转成文件
  base64ToFile(base64Data) {
    // base64转blob
    let arr = base64Data.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let blob = new Blob([u8arr], {
      type: mime,
    });
    // 将blob转为文件
    blob.lastModifiedDate = new Date();
    blob.name = "file";
    let config = {
      //其他配置
    };
    this.Request(blob, config); //发起请求
  },
  Request(data, config) {
    axios
      .post("/url", data, config)
      .then((res) => {
        console.log("成功");
      })
      .catch((err) => {
        console.log("失败");
      });
  },

};

</script>

<style scoped>
</style>