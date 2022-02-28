<template>
  <div class="upload_list">
    <img class="layui-upload-img" name="titleBase64Img" id="base64Img" :src="headImg" />
    <div class="fileInput">
      <input
        type="file"
        id="Updateimage"
        lay-verify="required"
        @change="toBase64()"
        accept="image/jpeg, image/png, image/jpg"
      />
    </div>
    <div>
      <a-button @click="checkInvoice()">查询发票</a-button>
    </div>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import signMd5Utils from '@/utils/encryption/signMd5Utils'
import { postAction } from '../../api/manage'

export default {
  name: 'invoice',
  data() {
    return {
      headImg: '',
      imageUrl: '',
      type: '',
    }
  },
  methods: {
    toBase64: function() {
      var that = this
      var file = document.querySelector('input[type=file]').files[0]
      console.log('base64', file)
      var reader = new FileReader()
      // reader.onloadend = function () {
      //     $("#base64Img").attr("style","display:inline-block");
      //     $("#base64Img").attr("src",reader.result);
      //   //把转换后的数据给id为base64Img的src属性
      //     console.log(reader.result);
      //     that.imageUrl = reader.result
      //     that.updataImg()
      //   //这里调用了向后台发请求的代码
      // }
      if (file) {
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          //读取完毕后调用接口
          // this.$set(this.imageUrl, e.target.result)
          this.imageUrl = e.target.result
          postAction('/invoice/recognize',{img: this.imageUrl}).then((res) => {
            alert(res)
          })
          // this.checkInvoice(this.imageUrl)
          console.log(this.imageUrl)
        }
      }
    },
    invoiceApi(imgUrl) {
      let that = this
      console.log(that)
      const parameter = { img: imgUrl }
      console.log(parameter)
      const url = 'http://dgfp.market.alicloudapi.com/ocrservice/invoice'
      let sign = signMd5Utils.getSign(url, parameter)
      //将签名和时间戳，添加在请求接口 Header
      let signHeader = {
        'X-Sign': sign,
        'X-TIMESTAMP': signMd5Utils.getDateTimeToString(),
        Authorization: 'APPCODE 1b638e4b0ead44c593727fffa06a82c8',
        'Content-Type': 'application/json',
      }

      return axios({
        url: url,
        method: 'post',
        data: parameter,
        headers: signHeader,
      })
    },

    checkInvoice(url) {
      this.invoiceApi(url).then((res) => {
        console.log(res.data)
        this.$message.info(res.data)
      })
    },
  },
}
</script>

<style>
</style>