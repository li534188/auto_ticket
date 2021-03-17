<template>
  <section :class="['cron-item',{'minute-type':type==='minute'}]" >
    <a-input v-model:value="inputValue" class="cron-input" />
    <div class="item-title title-error" v-if="!checkStatus">error</div>
    <div :class="['item-title',{'minute-title':type==='minute'}]" v-else>{{type}}</div>
  </section>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { CronType } from './PreCron.vue';
@Options({
})
export default class CornInputItem extends Vue {
    @Prop() type!: CronType;
    @Prop() itemValue!: string;
    @Prop() validateCorn!: {(value: string, type: CronType): void};
    @Prop() checkStatus!: boolean;
    private inputValue = ''
    @Watch('itemValue', { immediate: true })
    private setValue(value: string) {
      this.inputValue = value;
    }
    @Watch('inputValue')
    private valueChange(value: string) {
      console.log(this.itemValue, this.type);
      //   if (value) {
      //     switch (this.type) {
      //     // 正则表达式被弃用
      //     // /^(?:[1-5]?\d|\*|-|\/)|([1-5]?\d?(\*|-|\/)?)$/
      //     case CronType.minute:
      //       console.log(value);
      //       break;
      //     default :
      //       break;
      //     }
      //   }
      this.validateCorn(value, this.type);
    }
}
</script>
<style lang="scss" scoped>
  .cron-item{
    display: flex;
    flex-direction: column;
    width: 43px;
    align-items: center;
    justify-content: center;
    .item-title{
        font-size: 8px;
        color: #5D656F;
        line-height: 15px;
        text-align: center;
    }
    .title-error{
        color: rgb(216, 7, 7);
    }
  }
  .cron-input{
    width: 23px;
    padding:unset;
    text-align: center;
  }
  .minute-type{
      margin-left: -10px;
  }
</style>