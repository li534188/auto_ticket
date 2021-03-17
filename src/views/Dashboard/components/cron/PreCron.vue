<template>
  <a-row class="row-wrapper">
    <a-col class="col-wrapper left-label" :span="4">
      <div class="main-title">Recurrence</div>
      <div class="sub-title">cron expression on</div>
      <div class="switch-wrapper">
        <AutoSwitch v-model:value="switchModel"/>
      </div>
    </a-col>
    <a-col push='1' class="col-wrapper" :span="20">
      <div v-if="switchModel" class="checklist-date-wrapper cron-exception">
        <CornInputItem
          :type="item.name"
          v-for="item in cron"
          :key="item.name"
          :checkStatus="item.status"
          :validateCorn="validateCorn"
          :itemValue='item.value' />
      </div>
      <div v-else>
        <DatePicker  v-if="!switchModel" :timeType="(form&&form.time)||''" v-model:dateValue="dateValue"/>
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts">
export enum CronType{
    minute='minute',
    hour='hour',
    dayMonth='day (month)',
    month='month',
    dayWeek='day (week)',

}
interface CronItemType {
    name: CronType;
    value: string;
    status: boolean;
}
interface CronValueType{
    [index: number]: CronItemType;
    reduce<U>(callbackfn: (previousValue: U, currentValue: CronItemType, currentIndex?: number, array?: readonly CronItemType[]) => U, initialValue: U): U;
    map(callbackfn: (item: CronItemType) => CronItemType): CronItemType[];
}
import { Options, Vue, } from 'vue-class-component';
import DatePicker from './DatePicker.vue';
import { AutoSelect, AutoSwitch } from '@/components';
import CornInputItem from './CornInputItem.vue';
import { Watch } from 'vue-property-decorator';
import { message } from 'ant-design-vue';
// import { isValidCron } from 'cron-validator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const  cronValidator = require('cron-expression-validator');
@Options({
  components: {
    DatePicker,
    AutoSelect,
    CornInputItem,
    AutoSwitch
  },
})
export default class PreCron extends Vue {
    private form: {time: string} = { time: 'Day' }
    private timeNumber = 1;
    private switchModel = false;
    private cron: CronValueType = [
      {
        name: CronType.minute,
        value: '*',
        status: true,
      }, {
        name: CronType.hour,
        value: '*',
        status: true,
      }, {
        name: CronType.dayMonth,
        value: '*',
        status: true,
      }, {
        name: CronType.month,
        value: '*',
        status: true,
      }, {
        name: CronType.dayWeek,
        value: '?',
        status: true,
      }
    ]

    @Watch('timeNumber')
    private checkTimeNumber(value: string|number, old: number) {
      if (value&&!Number(value)) {
        message.info('Please Enter Number');
        this.timeNumber = old|1;
      }
    }

    //   @Watch('corn', { deep: true })
    //   private watchCornChange(value: CronValueType) {
    //     console.log(value);
    //     const res = value.reduce<string>((pre: string, cur: CronItemType,) => {
    //       return `${pre} ${cur.value}`;
    //     }, '');
    //     console.log(res);
    //     if (isValidCron(res)) {
    //       console.log('通过校验');
    //     }
    //   }

    private validateCorn(value: string, type: CronType) {
      let checkFlag = false;
      const cronArr = JSON.parse(JSON.stringify(this.cron)) as CronValueType;
      const arr = cronArr.map(item => {
        if (item.name===type) {
          item.value = value;
        }
        return item;
      });

      // check
      let dayMonth = '';
      let dayWeek = '';
      let res = arr.reduce<string>((pre: string, cur: CronItemType,) => {
        // When item.value does not exist or item.state is false, it is handled as the '*' in the cron expression
        if (cur.name===CronType.dayMonth) {
          dayMonth = cur.value;
        } else if (cur.name===CronType.dayWeek)(
          dayWeek= cur.value
        );
        const value = (!cur.value)?' ':cur.value;
        return `${pre} ${value}`;
      }, '');
      res = `0${res} *`;
      console.log(res);
      if (dayMonth&&dayWeek) {
        if ((dayMonth==='?'&&dayWeek==='?')||(dayMonth!=='?'&&dayWeek!=='?')) {
          message.error('Specifying both Day of Week and Day of Month is not supported');
        }
      }
      if (cronValidator.isValidCronExpression(res)) {
        console.log('是合法的');
        checkFlag = true;
      } else {
        checkFlag = false;
      }
      const afterValidateArr = arr.map(item => {
        if (checkFlag) {
          item.status = true;
        } else if (item.name===type&&!checkFlag) {
          item.status = false;
        }
        return item;
      });
      this.cron = afterValidateArr;
    }

}
</script>
<style lang="scss" scoped>
$check-line-height:20px;
.row-wrapper{
    line-height: 40px;
    margin-bottom: 20px;
}
.col-wrapper{
    display: flex;
    flex-direction: column;
}
.left-label{
    align-items: flex-end;
    line-height: 20px;
    margin-top: 9px;
        // .main-title{
        //     line-height: 20px;
        // }
        .sub-title{
            font-size: 10px;
            color: #5D656F;
            line-height: 20px;
        }
        .switch-wrapper{
            width:20%;
            float:right;
            margin-right: 5px;
        }

    }
.checklist-date-wrapper{
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
.cron-exception{
    margin-top: 12px;
}
</style>