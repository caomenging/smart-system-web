<template>
  <div>
    <canvas id="aa" width="450" height="500"></canvas>
<!--    <div>
      <input v-model="url"/>
    </div>
    <div>
      <input v-model="name"/>
    </div>-->
      <button v-show=false @click="initQrCode">生成二维码</button>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  export default {

    data () {
      return {
        url: 'http://192.168.43.79:8080/smart-system/qrCode/generate/v3?content=http://192.168.43.79:3000/review',
        name: '阳光评廉',
        formLayout: 'horizontal',
        model: {},
        rules: {
          note: [{required: true, message: 'Please input your note!'}],
          gender:[{ required: true, message: 'Please select your gender!' }]
        },
        areaOptions:[]
      }
    },
    methods: {
      initQrCode(){
        var aa = document.getElementById('aa');
        var bb = aa.getContext('2d');

        bb.fillStyle = '#99f';    //   填充颜色
        bb.fillRect(0,0,450,480);

        var img = new Image;
        img.src = this.url;

        img.onload = function () {
            bb.drawImage(img, 70,70);
        }

        bb.fillStyle = '#000';//字体颜色
        bb.font = '20px Adobe Ming Std';//字体样式大小
        bb.fillText(this.name,180,450);//位置

        bb.stroke();
      }
    },
    mounted() {
      this.initQrCode()
    },

    /*created (){
      console.log('============= online href common props ============= ');
      console.log('props sex: ',this.sex);
      console.log('props name: ',this.name);

    },
    watch: {
      $route: {
        immediate: true,
        handler() {
          console.log('============= online href  $route props ============= ');
          let sex = this.$route.query.sex
          console.log('$route sex: ', sex);
        }
      }
    },*/

  }
</script>