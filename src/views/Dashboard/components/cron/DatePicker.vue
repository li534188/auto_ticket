<template>
  <div>
    <header>
      <div class="header-wrapper">
        <div class="sub-module">Starting at</div>
        <a-time-picker style="width: 25%;" use12-hours format="h:mm a" v-model:value="form.inputTime" />
      </div>
      <div class="header-wrapper">
        <div class="sub-module">Every</div>
        <input
          class="sub-module input-number"
          v-model="form.rate"
          style="width: 50px; text-align: center"
        />
        <AutoSelect style="width:90px" class="line-select" :options="timeList" v-model:value="form.timeType" selectType="time"/>
        <a-radio-group class="date-radio-wrapper" v-show="form.timeType==='Month'" name="radioGroup" v-model:value="form.monthType">
          <a-radio value="dayMonth">Particular Date</a-radio>
          <a-radio value="dayWeek">Particular Day of The Week</a-radio>
        </a-radio-group>
        <span v-if="form.timeType==='Year'" class="picker-year-item">
          <a-date-picker v-model:value="form.inputYear" placeholder="Select Time" @ok="onOk">
            <CalendarOutlined />
          </a-date-picker>
        </span>
      </div>
    </header>
    <div :class="['picker-wrapper',{'picker-week':form.timeType==='Week'}, {'picker-month':form.timeType==='Month'&&form.monthType==='dayMonth'}]">
      <div v-if="form.timeType==='Week'||(form.timeType==='Month'&&form.monthType==='dayWeek')" class="picker-week">
        <AutoSelect style="width:90px" v-if="form.timeType==='Month'&&form.monthType==='dayWeek'"  class="line-select dayWeek-select" :options="dayweekSelect" v-model:value="form.dayHowWeek" selectType="time"/>
        <div @click="changeDateValue(item.value)" :class="['picker-week-item', {'picker-week-active':form.inputWeek===item.value}]" v-for="item in weekDate" :key="item">{{item.title}}</div>
      </div>
      <div v-else-if="form.timeType==='Month'&&form.monthType==='dayMonth'" class="picker-month">
        <div class="picker-month-item" v-for="n in 31" :key="n">
          <div @click="changeDateValue(n)" :class="[{'picker-month-active':form.inputMonth===n},'picker-month-normal', {'picker-month-unusual':n===31}]">{{n}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
interface FormType{
  timeType: string;
  monthType: string;
  rate: number;
  dayHowWeek: string;
  inputTime: Moment;
  inputDay: string;
  inputMonth: string;
  inputWeek: string;
  inputYear: Moment;
}
interface CronType{
  [key: string]: number|string;
  second: number;
  minute: number;
  hour: number;
  dayMonth: string|number;
  month: string|number;
  dayWeek: string;
  year: string;
}
import { Options, Vue, } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { AutoSelect } from '@/components';
import {
  CalendarOutlined,
} from '@ant-design/icons-vue';
import moment, { Moment, } from 'moment';
// import { isValidCron } from 'cron-validator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const  cronValidator = require('cron-expression-validator');
@Options({
  components: {
    CalendarOutlined,
    AutoSelect
  },
})
export default class DatePicker extends Vue {

    @Prop() private dateValue!: string;
    private weekDate = [
      { title: 'MON', value: 1 },
      { title: 'TUE', value: 2 },
      { title: 'WED', value: 3 },
      { title: 'THUR', value: 4 },
      { title: 'FRI', value: 5 },
      { title: 'SAT', value: 6 },
      { title: 'SUN', value: 7 },
    ]
    private timeList = [
      'Day',
      'Week',
      'Month',
      'Year',
    ]
    private dayweekSelect = [
      '1nd Week',
      '2nd Week',
      '3nd Week',
      '4nd Week',
    ]
    private cron: CronType = {
      second: 0,
      minute: 0,
      hour: 0,
      dayMonth: '',
      month: '',
      dayWeek: '',
      year: '*'
    }
    private form: FormType = {
      timeType: 'Day',
      monthType: 'dayMonth',
      rate: 0,
      dayHowWeek: '1nd Week',
      inputTime: moment('00:00', 'HH:mm'),
      inputDay: '',
      inputWeek: '',
      inputMonth: '',
      inputYear: moment(new Date())
    }
    private time = '';
    private changeDateValue(value: string|Moment) {
      switch (this.form.timeType) {
      case 'Day':
        break;
      case 'Week':
        this.form.inputWeek = value as string;
        break;
      case 'Month':
        this.form.inputMonth = value as string;
        break;
      case 'Year':
        this.form.inputYear = value as Moment;
        break;
      }
    }
    private debounceTime: any = null;

    @Watch('form', { deep: true })
    private formChange(value: FormType) {
      if (this.debounceTime) {
        clearTimeout(this.debounceTime);
        this.debounceTime=null;
      }
      this.debounceTime=setTimeout(() => {
        console.log(value);
        const { timeType, monthType, rate, dayHowWeek, inputTime, inputWeek, inputMonth, inputYear } = this.form;
        const hour  = moment(inputTime).hour();
        const minute = moment(inputTime).minute();
        const mon = inputYear&&moment(inputYear).month()+1;
        const day = inputYear&&moment(inputYear).day();
        const test = moment().startOf('isoWeek');
        console.log(test.format('YYYY/MM/DD'));
        console.log(inputTime);
        switch (timeType) {
        case 'Day':
          this.cron = { ...this.cron,
            ...{ minute: minute|0,
              hour: hour|0,
              dayMonth: `1/${rate}`,
              month: '*',
              dayWeek: '?', }
          };
          break;
        case 'Week':
          // every 3 weeks 暂时无法实现
          this.cron = { ...this.cron,
            ...{
              minute: minute|0,
              hour: hour|0,
              dayMonth: '*',
              month: '*',
              dayWeek: inputWeek,
            }
          };
          break;
        case 'Month':
          if (monthType === 'dayMonth') {
            this.cron = { ...this.cron,
              ...{
                minute: minute|0,
                hour: hour|0,
                dayMonth: inputMonth,
                month: '*',
                dayWeek: '?',
              }
            };
          } else {
            this.cron = { ...this.cron,
              ...{
                minute: minute|0,
                hour: hour|0,
                dayMonth: '?',
                month: '*',
                dayWeek: `${inputWeek}#${dayHowWeek}`,
              }
            };
          }
          break;
        case 'Year':
          console.log(mon);
          this.cron = { ...this.cron,
            ...{
              minute,
              hour,
              dayMonth: day,
              month: mon,
              dayWeek: '?',
            }
          };
          break;
        }
        const res = [];
        for (const key in this.cron) {
          // res = res+ ' ' + ;
          res.push(this.cron[key]);
        }
        console.log(this.cron);
        console.log(res.join(' '));
        if (cronValidator.isValidCronExpression(res.join(' '))) {
          console.log('数据合法');
        }
      }, 1000);

    }
}
</script>
<style lang="scss" scoped>
  .header-wrapper{
    display: flex;
    align-items: center;
    .input-number, .input-number:active, .input-number:hover{
      border: unset;
      border-bottom: solid 1px #EBECF0;
      outline: unset;
      height: 20px;
    }
    .sub-module{
      margin-right:10px;
    }
    .center-lable{
      width: 50px;
      text-align: center;
    }
    .date-radio-wrapper{
      margin-left:10px;
      .ant-radio-wrapper{
        font-size: 13px;
        color: #3B4859;
        vertical-align: text-bottom
      }
    }
    .picker-year-item{
      margin-left: 20px;
    }
  }
  .line-select{
      height: 20px;
    }
  .picker-wrapper{
    height: 100%;
    width: 100%;
    font-size: 13px;
    font-family: HelveticaNeue;
    .dayWeek-select{
      margin-right:20px;
      margin-left:30px;
    }
    .picker-week{
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 55%;
        .picker-week-item{
            flex: 1 1 13%;
            border: 1px dashed rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin-right: 5px;
        }
        .picker-week-active{
          background: #50A7AF;
        }
    }
    .picker-month{
        display: flex;
        position: relative;
        flex-direction: row;
        justify-content: space-around;
        width: 85%;
        flex-wrap: wrap;
        height: 80px;
        font-size: 12px;
        color: #7C86A2;
        .picker-month-item{
            flex: 1 0 10%;
            height: 23px;
            text-align:center;
            cursor: pointer;
            .picker-month-active {
              background: #50A7AF;
              border-radius: 50%;
              color: #fff;
            }
            .picker-month-normal{
              width: 27px;
              height: 27px;
              line-height: 27px;
               display:inline-block;
            }
            .picker-month-unusual{
              position: absolute;
              bottom: 0px;
              right:-30px;
            }
        }
    }
  }
  .picker-week{
    margin-top:10px;
  }
  .picker-month{
    margin-left: -10px;
  }
</style>