<template>
  <div>
    <a-row>
      <!--      <a-button style='margin-right: 20px' @click='getBarCode'>条码识别</a-button>-->
      <!--            <a-button style='margin-right: 20px' @click='getStatus'>获取设备状态</a-button>-->
      <!--            <a-button style='margin-right: 20px' @click='isConnect'>判断设备是否连接</a-button>-->
    </a-row>
    <a-row style='margin-top: 20px'>
      <a-col :span='12'>
        <a-card title='主摄像头' hoverable style='width: 300px'>
          <a-empty
            v-if="camera0 === ''"
            image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
            :image-style="{
            height: '60px',
          }"
          >
          </a-empty>
          <el-image v-else
                    slot='cover'
                    alt='example'
                    id='view1'
                    :src='camera0'
                    :preview-src-list='[camera0]'
                    fit='contain'
          >
            <div slot='error' class='image-slot'>
              <i class='el-icon-picture-outline'></i>
            </div>
            <div slot='placeholder' class='image-slot'>
              <i class='el-icon-loading'></i>
            </div>
          </el-image>
          <template slot='actions' class='ant-card-actions'>
            <a-icon type='plus' @click='open("0")' />
            <a-icon type='camera' @click='takePhoto("0")' />
            <a-icon type='close' @click='close("0")' />
          </template>
        </a-card>
      </a-col>
      <a-col :span='12'>
        <a-row :gutter='20'>
          <a-col v-for='(item, index) in images' :span='6'>
            <a-card hoverable>
              <el-image
                slot='cover'
                :src='item'
                :preview-src-list='images'
                fit='contain'
              >
                <div slot='error' class='image-slot'>
                  <i class='el-icon-picture-outline'></i>
                </div>
                <div slot='placeholder' class='image-slot'>
                  <i class='el-icon-loading'></i>
                </div>
              </el-image>
              <template slot='actions'>
                <a-icon type='close' @click='deleteImage(index)' />
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row v-show='false'>
      <a-carousel arrows dots-class='slick-dots slick-thumb'>
        <a slot='customPaging' slot-scope='props'>
          <img :src='getImgUrl(props.i)' />
        </a>
        <div v-for='item in images'>
          <el-image
            :src='item'
            :preview-src-list='images'
            fit='contain'
          >
            <div slot='error' class='image-slot'>
              <i class='el-icon-picture-outline'></i>
            </div>
            <div slot='placeholder' class='image-slot'>
              <i class='el-icon-loading'></i>
            </div>
          </el-image>
        </div>
      </a-carousel>
    </a-row>
    <a-row style='margin-top: 20px;display: none'>
      <a-card title='日志' hoverable>
        <a-empty
          v-if='messages.length === 0'
          image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
          :image-style="{
              height: '60px',
            }"
        >
        </a-empty>
        <p v-else v-for='item in messages'>{{ item }}</p>
      </a-card>
    </a-row>
  </div>
</template>

<script>

import { getStatus, isConnect, closeCamera, takePhoto, scanBarcode, openCamera, baseURL } from '@/utils/eloam'
import { uploadFile } from '@api/manage'

export default {
  name: 'camera',
  data() {
    return {
      baseURL: '',
      camera0: '',
      camera1: '',
      images: [],
      uploadImages: [],
      model: {
        mainImages: [],
        subImages: []
      },
      messages: []
    }
  },
  props:{
    /*这个属性用于控制文件上传的业务路径*/
    bizPath:{
      type:String,
      required:false,
      default:"temp"
    },
  },
  mounted() {
    isConnect().then(result => {
      console.log('---------高拍仪驱动连接状态----------')
      console.log(result)
    }).catch(() => {
      this.$message.warning('高拍仪驱动未启动')
    })

    getStatus().then(result => {
      console.log('---------高拍仪摄像头状态----------')
      console.log(result)
    }).catch(() => {
      this.$message.warning('高拍仪驱动未启动')
    })

    this.baseURL = baseURL
  },
  methods: {
    deleteImage(index) {
      this.images.splice(index, 1)
    },
    getImgUrl(i) {
      return this.images[i]
    },
    open(index) {
      openCamera({ index })
      if (index === '0') {
        this.camera0 = this.baseURL + '/video=stream&camidx=0'
      } else if (index === '1') {
        this.camera1 = this.baseURL + '/video=stream&camidx=1'
      }
    },
    close(index) {
      let that = this
      let params = { 'camidx': index }
      closeCamera(JSON.stringify(params)).then((result) => {
        if (index === '0') {
          that.camera0 = ''
        } else if (index === '1') {
          that.camera1 = ''
        }
      })
    },
    takePhoto(index) {
      let that = this
      let params = {
        'filepath': 'base64',
        'rotate': '0',
        'camidx': index,
        'ColorMode': '0',
        'quality': '3'
      }
      takePhoto(JSON.stringify(params)).then((result) => {
        console.log('---------高拍仪拍照----------')
        console.log(result)
        if (result.data.code === '0') {
          let base64 = result.data.photoBase64
          let start = 'data:image/jpg;base64,'
          let image = start + base64
          that.images.push(image)
          that.uploadImages.push(this.dataURLtoFileFun(image, '111.jpg'))
          if (index === '0') {
            that.model.mainImages.push(image)
          } else {
            that.model.subImages.push(image)
          }
        } else {
          this.$message.warning('拍摄失败，请检查高拍仪是否打开')
        }
      })
    },
    getBarCode() {
      let that = this
      let params = { 'time': '20' }
      scanBarcode(JSON.stringify(params)).then((res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          let barcodedata = res.data.data[i].barcodedata
          let list = barcodedata.split(',')
          let date = new Date().toString().slice(16, 24)
          that.messages.unshift(date + '  识别成功，内容是：' + res.data.data[i].barcodedata)
          if (list.length > 5) {
            //01,10,011002000911,02709763,1739.82,20210604,66742500080557092822,761A,
            that.messages.unshift('发票代码：' + list[0] + list[1] + list[2])
            that.messages.unshift('发票号码：' + list[3])
            that.messages.unshift('金额：' + list[4])
            that.messages.unshift('开票日期：' + list[5])
            that.messages.unshift('校验码：' + list[6])
            that.messages.unshift('其他：' + list[7])
          }
        }
      })
    },
    dataURLtoFileFun(dataurl, filename) {
      // 将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    uploadOne(res, filename) {
      let that = this
      let formData = new FormData()
      formData.append('biz', this.bizPath)
      formData.append('file', this.dataURLtoFileFun(res, filename))
      uploadFile(formData).then((res) => {
        console.log(res)
        if (res.success) {
          this.$emit('ok', res.message)
        }
      })
    },
    submitForm() {
      for (let i = 0; i < this.images.length; i++) {
        let base64 = this.images[i]
        let filename = 'eloam.jpg'
        this.uploadOne(base64, filename)
      }
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}

.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 45%;
}

.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}

.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}

.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}

.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>