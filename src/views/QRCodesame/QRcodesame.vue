<template>
  <div id="qrcode">
    <canvas id="aa" width="450" height="500"></canvas>
    <button v-show=false @click="initQrCode">生成二维码</button>
    <smart-reporting-information-detail />
  </div>

</template>

<!--显示纠治四风二维码-->

<script>
  import { getAction } from '@/api/manage'
  import SmartReportingInformationDetail from '../SmartReportingInformation/SmartReportingInformationDetail'
  export default {
    name: 'QRcodesame',
    //调用表格作为首页的表格
    components: { SmartReportingInformationDetail },
    //props: ['sex','name'],
    data () {
      return {
        url: 'http://192.168.1.101:8080/smart-system/qrCode/generate/v3?content=http://192.168.1.101:3000/InsertReportingInformation/InsertReportingInformationDetail',
        name: '纠治四风',
        formLayout: 'horizontal',
        model: {},
        rules: {
          note: [{required: true, message: 'Please input your note!'}],
          gender:[{ required: true, message: 'Please select your gender!' }]
        },
        areaOptions:[],

        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
        /*  {
            title:'被反映人姓名',
            align:"center",
            dataIndex: 'reflectedName'
          },
          {
            title:'被反映人单位',
            align:"center",
            dataIndex: 'reflectedDocumentid'
          },
          {
            title:'主要问题',
            align:"center",
            dataIndex: 'majorProblem'
          },
          {
            title:'附件',
            align:"center",
            dataIndex: 'description',
            scopedSlots: {customRender: 'fileSlot'}
          },
          {
            title:'举报人姓名',
            align:"center",
            dataIndex: 'reporterName'
          },
          {
            title:'联系电话',
            align:"center",
            dataIndex: 'contactNumber'
          },
          {
            title:'举报时间',
            align:"center",
            dataIndex: 'reportingTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }*/
        ],
      }
    },

    methods: {
      initQrCode(){ //二维码部分
        var aa = document.getElementById('aa');
        var bb = aa.getContext('2d');

        bb.fillStyle = '#fff';    //   填充背景框颜色
        bb.fillRect(0,0,450,470);//(背景框)

        var img = new Image;
        img.src = this.url;

        img.onload = function () {
            bb.drawImage(img, 70,70);
        }

        bb.fillStyle = '#000';//字体颜色
        bb.font = '20px Adobe Ming Std';//字体样式大小
        bb.fillText(this.name,180,450);//位置

        bb.stroke();
      },
      initDictConfig(){
      },
      /*getSuperFieldList(){//表
        let fieldList=[];
        fieldList.push({type:'string',value:'reflectedName',text:'被反映人姓名',dictCode:''})
        fieldList.push({type:'string',value:'reflectedDocumentid',text:'被反映人单位',dictCode:''})
        fieldList.push({type:'string',value:'majorProblem',text:'主要问题',dictCode:''})
        fieldList.push({type:'string',value:'description',text:'附件',dictCode:''})
        fieldList.push({type:'string',value:'reporterName',text:'举报人姓名',dictCode:''})
        fieldList.push({type:'string',value:'contactNumber',text:'联系电话',dictCode:''})
        fieldList.push({type:'datetime',value:'reportingTime',text:'举报时间'})
        this.superFieldList = fieldList
      }*/
    },
    mounted() {
      this.initQrCode()
      this.initDictConfig()
    },
    created (){
      console.log('============= online href common props ============= ');
      console.log('props sex: ',this.sex);
      console.log('props name: ',this.name);

      this.getSuperFieldList();

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
    },

  }
</script>

<style>
#qrcode {
  text-align: center;
}
</style>