

<template>
  <div class="datetime-picker">
    <div @click="show = !show" >
      <slot>
        <div class="datetime-input-wrapper">
          <input
            type="text"
            v-bind="inputAttr"
            :name="name"
            :style="inputStyle"
            :readonly="readonly"
            :value="pickedValue"
          >
          <CalendarOutlined class="input-icon"/>
        </div>
      </slot>
    </div>
    <div
      class="picker-wrap"
      v-bind="calendarAttr"
      :style="calendarStyle"
      :class="calendarClass"
      v-show="show">
      <table class="date-picker">
        <thead>
          <tr class="date-head">
            <th colspan="3">
              <div class="header-date-text">
                <span class="show-month">{{months[now.getMonth()]}}</span>
                <span span class="show-year">{{now.getFullYear()}}</span>
              </div>
            </th>
            <th colspan="4">
              <div class="header-date-icon">
                <div class="btn-prev" @click="monthClick(-1)"></div>
                <div class="btn-next" @click="monthClick(1)"></div>
              </div>
            </th>
          </tr>
          <tr class="date-days">
            <th v-for="day in days" :key="day">{{day}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, i) in 6" :key="i">
            <td v-for="(v, j) in 7"
                :key="j"
                :date="date[i * 7 + j] && date[i * 7 + j].date"
                @click="date[i * 7 + j] && !date[i * 7 + j].disabled && pickDate(i * 7 + j)">
              <div class="td-wrapper">
                <div :class="[
                  date[i * 7 + j] ? date[i * 7 + j].status : '',
                  { 'date-disabled': date[i * 7 + j] && date[i * 7 + j].disabled },
                  'td-block']">
                  {{date[i * 7 + j] && date[i * 7 + j].text}}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { CalendarOutlined } from '@ant-design/icons-vue';
export default {
  props: {
    readonly: { type: Boolean, default: false },
    value: { type: String, default: '' },
    format: { type: String, default: 'YYYY-MM-DD' },
    name: { type: String, default: '' },
    inputAttr: Object,
    inputStyle: [Object, Array],
    inputClass: [Object, Array],
    calendarAttr: Object,
    calendarStyle: [Object, Array],
    calendarClass: [Object, Array],
    disabledDate: { type: Function, default: () => false }
  },
  components: {
    CalendarOutlined
  },
  data() {
    return {
      show: false,
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      date: [],
      now: new Date(),
      pickedValue: ''
    };
  },
  watch: {
    now() {
      this.update();
    },
    show() {
      this.update();
    },
    value: {
      handle(val) {
        this.pickedValue = val;
      },
      immediate: true
    }
  },
  methods: {
    close() {
      this.show = false;
    },
    update() {
      const arr = [];
      const time = new Date(this.now);
      time.setMonth(time.getMonth(), 1); // the first day
      let curFirstDay = time.getDay();
      curFirstDay === 0 && (curFirstDay = 7);
      time.setDate(0); // the last day
      const lastDayCount = time.getDate();
      for (let i = curFirstDay; i > 0; i--) {
        const tmpTime = new Date(time.getFullYear(), time.getMonth(), lastDayCount - i + 1);
        arr.push({
          text: lastDayCount - i + 1,
          time: tmpTime,
          status: 'date-pass',
          disabled: this.disabledDate(tmpTime)
        });
      }
      time.setMonth(time.getMonth() + 2, 0); // the last day of this month
      const curDayCount = time.getDate();
      time.setDate(1); // fix bug when month change
      const value = this.pickedValue || this.stringify(new Date());
      for (let i = 0; i < curDayCount; i++) {
        const tmpTime = new Date(time.getFullYear(), time.getMonth(), i + 1);

        let status = '';
        this.stringify(tmpTime) === value && (status = 'date-active');
        arr.push({
          text: i + 1,
          time: tmpTime,
          status,
          disabled: this.disabledDate(tmpTime)
        });
      }
      let j = 1;
      while (arr.length < 42) {
        const tmpTime = new Date(time.getFullYear(), time.getMonth() + 1, j);
        arr.push({
          text: j,
          time: tmpTime,
          status: 'date-future',
          disabled: this.disabledDate(tmpTime)
        });
        j++;
      }
      this.date = arr;
    },
    yearClick(flag) {
      this.now.setFullYear(this.now.getFullYear() + flag);
      this.now = new Date(this.now);
    },
    monthClick(flag) {
      this.now.setMonth(this.now.getMonth() + flag, 1);
      this.now = new Date(this.now);
    },
    pickDate(index) {
      this.show = false;
      this.now = new Date(this.date[index].time);
      this.pickedValue = this.stringify();
      this.$emit('update:value', this.pickedValue);
    },
    parse(str) {
      const time = new Date(str);
      return isNaN(time.getTime()) ? null : time;
    },
    stringify(time = this.now, format = this.format) {
      const year = time.getFullYear();
      const month = time.getMonth() + 1;
      const date = time.getDate();
      const monthName = this.months[time.getMonth()];
      const map = {
        YYYY: year,
        MMM: monthName,
        MM: ('0' + month).slice(-2),
        M: month,
        DD: ('0' + date).slice(-2),
        D: date
      };
      return format.replace(/Y+|M+|D+/g, function(str) {
        return map[str];
      });
    },
    leave(e) {
      if (!this.$el.contains(e.target)) {
        this.close();
      }
    }
  },
  mounted() {
    this.pickedValue = this.value;
    this.$nextTick(() => {
      this.now = this.parse(this.pickedValue) || new Date();
      document.addEventListener('click', this.leave, false);
    });
  },
  beforeUnmount() {
    document.removeEventListener('click', this.leave, false);
  }
};
</script>

<style lang="scss" scoped>
.datetime-picker {
  position: relative;
  display: inline-block;
  font-family: "HelveticaNeue";
  -webkit-font-smoothing: antialiased;
  color: #333;
  cursor: pointer;
  th {
    font-weight: normal;
  }
}
.datetime-picker * {
  box-sizing: border-box;
}

.datetime-picker .picker-wrap {
  position: absolute;
  z-index: 1000;
  width: 328px;
  height: 274px;
  margin-top: 2px;
  background: #FFFFFF;
  box-shadow: 0px 2px 23px #EDEDED;
}
.datetime-picker table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  text-align: center;
  font-size: 13px;
}
.datetime-picker tr {
  height: 34px;
  border: 0 none;
}
.datetime-picker th, .datetime-picker td {
  overflow: hidden;
  user-select: none;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0 none;
  line-height: 34px;
  text-align: center;
}
.datetime-picker td {
  cursor: pointer;
}
.datetime-picker td:hover {
  background-color: #f0f0f0;
}
.datetime-picker .date-disabled:not(.date-active) {
  cursor: not-allowed;
  color: #ccc;
}
.datetime-picker .date-disabled:not(.date-active):hover {
  background-color: transparent;
}
.datetime-picker .date-pass, .datetime-picker .date-future {
  color: #aaa;
}
.datetime-picker .date-active,
.datetime-picker .date-active:hover {
  background-color: #50A7AF;
  color: #fff;
}
.datetime-picker .date-head {
  text-align: center;
  font-size: 15px;
  color:#6B7897;
  font-weight: normal;
  .header-date-text{
      text-align: left;
      padding-left: 20px;
  }
  .header-date-icon{
      display: flex;
      justify-content: flex-end;
      margin-right: 12px;
  }
}
.datetime-picker .date-days {
  color: #34485E;
  font-size: 14px;
}
.datetime-picker .show-year {
  display: inline-block;
  min-width: 66px;
}
.datetime-picker .show-month {
  display: inline-block;
  min-width: 32px;
}
.datetime-picker .btn-prev,
.datetime-picker .btn-next {
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #F7F8FC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left:20px;
}
.datetime-picker .btn-prev::after,
.datetime-picker .btn-next::after {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  border-top: 1px solid #8C96AB;
  border-left: 1px solid #8C96AB;
  transform: rotate(-45deg);
}
.datetime-picker .btn-next::after {
  left: -2px;
  border: 0 none;
  border-right: 1px solid #8C96AB;
  border-bottom: 1px solid #8C96AB;
}
.datetime-picker .btn-prev:hover,
.datetime-picker .btn-next:hover {
  background: rgba(16, 160, 234, 0.5);
}
.td-block{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: inline-block;
    line-height: 25px;
}
.td-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
}
.datetime-input-wrapper{
    display: flex;
    align-items: center;
    border-bottom: solid 1px #EBECF0;
    width: 150px;
    input{
      border: unset;
      outline: unset;
      width: 85%;
    }
}
</style>