<template>
  <div class="jira-list-wrapper">
    <a-row class="row-wrapper">
      <a-col class="left-label" :span="4">
        <div>Group</div>
      </a-col>
      <a-col push='1' :span="20">
        <AutoSelect style="width:217px" :options="groupData" class="company-select" v-model:value="form.groupValue" selectType="group"/>
      </a-col>
    </a-row>
    <a-row class="row-wrapper">
      <a-col class="left-label" :span="4">
        <div>Sub-group</div>
      </a-col>
      <a-col push='1'  :span="20">
        <AutoSelect style="width:217px" :options="subgroupData" class="company-select" v-model:value="form.subGroupValue" selectType="group"/>
      </a-col>
    </a-row>
    <a-row class="row-wrapper">
      <a-col class="left-label" :span="4">
        <div>Company</div>
      </a-col>
      <a-col push='1'  :span="20">
        <AutoSelect style="width:217px" :options="companyList" class="company-select" v-model:value="form.company" selectType="company"/>
      </a-col>
    </a-row>
    <a-row class="row-wrapper">
      <a-col class="left-label" :span="4">
        <div>Job Summary</div>
      </a-col>
      <a-col push='1'  :span="20">
        <a-input class="input-wrapper" v-model:value="form.name" />
      </a-col>
    </a-row>
    <PreCron :exitValue="cronData" ref="preCronRef" />
    <a-row class="row-wrapper">
      <a-col class="left-label" :span="4">
        <div>When To Start</div>
      </a-col>
      <a-col push='1' :span="20">
        <section class="checklist-item-wrapper">
          <AutoDatePicker v-model:value="form.startTime"/>
          <div class="center-lable">to</div>
          <!-- <a-date-picker
            v-model:value="form.date2"
            type="date"
            placeholder="Pick a date"
            style="width: 25%;"
          /> -->
          <AutoDatePicker v-model:value="form.endTime"/>
        </section>
      </a-col>
    </a-row>
    <!-- <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="Job Summary">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="Date & Time">
        <section class="checklist-item-wrapper">
          <a-date-picker
            v-model:value="form.date1"
            type="date"
            placeholder="Pick a date"
            style="width: 25%;"
          />
          <div class="center-lable">to</div>
          <a-date-picker
            v-model:value="form.date2"
            type="date"
            placeholder="Pick a date"
            style="width: 25%;"
          />
        </section>
        <section class="checklist-item-wrapper">
          <a-time-picker style="width: 25%;" use12-hours format="h:mm a" v-model:value="form.date3" />
          <div class="center-lable">to</div>
          <a-time-picker style="width: 25%;" use12-hours format="h:mm a" v-model:value="form.date4" />
        </section>
      </a-form-item>
    </a-form> -->
    <a-row class="row-wrapper">
      <a-col class="left-label" :span="4">
        <div>Job Details</div>
      </a-col>
      <a-col push='1'  :span="18">
        <Ckeditor :exitValue="jobDetail" ref="ckeditorRef"/>
      </a-col>
    </a-row>
    <a-button class="auto-button create-button" @click="createTicket">Create New Item</a-button>
  </div>
</template>
<script lang="ts">
interface FormType{
    company: string;
    name: string;
    startTime: string;
    endTime: string;
    time?: string;
    groupValue: string;
    subGroupValue: string;
  }
import { Options, Vue, } from 'vue-class-component';
import { TemplateModule } from '@/store/modules/template';
import { CheckedTag, AutoSelect, } from '@/components';
import AutoDatePicker from '@/components/AutoDatePicker.vue';

import { UserOutlined } from '@ant-design/icons-vue';
import Ckeditor from './components/Ckeditor.vue';
import PreCron from './components/cron/PreCron.vue';
import { Watch } from 'vue-property-decorator';
import { getJiraInfo } from '@/utils/server';
import { PickerFormType } from './components/cron/DatePicker.vue';


@Options({
  components: {
    CheckedTag,
    UserOutlined,
    Ckeditor,
    AutoSelect,
    PreCron,
    AutoDatePicker
  },
})
export default class CheckList extends Vue {

  mounted() {
    console.log('ggggggg');
    getJiraInfo().then(res => {
      console.log(res);
      if (res.message==='success') {
        const { cronData, baseData, jobDetail } = res.data;

        this.cronData = cronData;
        console.log(this.cronData);
        this.form = baseData;
        this.jobDetail = jobDetail;
      }
    });

  }
  private groupData = [
    'US Checklists',
    'US Checklists',
    'US Checklists',
    'US Checklists'
  ]
  private subgroupData = [
    'subA',
    'subB',
    'subC',
    'subD'
  ]
  private cronData?: PickerFormType|string= '';
  private jobDetail?: string = '';
  private timeList = [
    'Day',
    'Week',
    'Month',
    'Year',
  ]
  searchValue = 'test'
  private form: FormType = { company: '', name: '', time: '', groupValue: '', subGroupValue: '', startTime: '', endTime: '' }
  // private datas: {title: string}[] = [
  //   {
  //     title: 'Ant Design Title 1',
  //   },
  //   {
  //     title: 'Ant Design Title 2',
  //   },
  //   {
  //     title: 'Ant Design Title 3',
  //   },
  //   {
  //     title: 'Ant Design Title 4',
  //   },
  // ];

  // private chooseTimeSelect(item: string) {
  //   this.form.time = item;
  //   console.log(item);
  //   this.showSelect = '';
  // }

  get companyList() {
    return TemplateModule.companyList;
  }

  private corn = '';

  @Watch('form', { deep: true })
  private formChange(value: FormType) {
    console.log(value);
  }

  private createTicket() {
    console.log('99999');
  }

}
// export default {
//   name:'checkList',
//   components:{
//      CheckedTag
//   },
//   data(){
//     return {
//       checked1:true,
//       listData:[
//         {
//           title:'All',
//           checked:true,
//         },{
//           title:'WON',
//           checked:false,
//         },{
//           title:'DAI',
//           checked:false,
//         },{
//           title:'ODS',
//           checked:false,
//         },{
//           title:'ONS',
//           checked:false,
//         },{
//           title:'IBD',
//           checked:false,
//         },
//       ]
//     }
//   },
//   methods:{
//       handleChange(checked){
//           console.log(checked)
//       },
//       change(val){
//           this.listData = this.listData.map(item=>{
//               if(item.title === val){
//                   item.checked = !item.checked
//               }
//               return item
//           })
//       }
//   },
// }
</script>
<style lang="scss">
  .jira-list-wrapper{
    padding: 50px 50px;
    .row-wrapper{
      line-height: 35px;
      margin-bottom: 15px;
      .input-wrapper{
        width: 520px;
      }
    }
      .label{
        text-align: right;
      }
      .header{
          .search-input{
            width: 70%;
          }
          .search-button{
            color:orange;
            border-color: orange;
            margin-left: 50px;
          }
      }
      .divider{
        width: 100%;
        border: 1px solid rgba($color: #000000, $alpha: .1);
      }
      .context{
        padding: 0 30px;
      }
      .ant-time-picker-input ,.ant-calendar-picker-input.ant-input{
        border:unset;
        border-bottom:1px solid #d9d9d9;
      }
      .create-button{
        float: right;
        margin-right: 30px;
        margin-top: 20px;
      }
  }
  .left-label{
    text-align: right;
  }
  $check-line-height:20px;
  .company-select{
    height: 40px;
    padding:4px 0;
  }
  .checklist-item-wrapper{
    display: flex;
    align-items: center;
    .input-number, .input-number:active, .input-number:hover{
      border: unset;
      border-bottom: solid 1px #EBECF0;
      outline: unset;
      height: $check-line-height;
    }
    .line-select{
      height: $check-line-height;
    }
    .sub-module{
      margin-right:10px;
    }
    .center-lable{
      width: 50px;
      text-align: center;
    }
  }
  .input-wrapper{
    margin-right: 33px;
    .check-select-parent{
      color:rgba(0, 0, 0, 0.65);
      cursor: pointer;
      width: 90px;
      height: 32px;
      padding:0 5px;
      border-radius: 2px;
      border: 1px solid rgba(151, 151, 151, 0.502732);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .select-prefix-icon{
        transition: all .5s;
      }
      .rotate-icon{
        transform: rotate(180deg);
      }
    }
  }
</style>