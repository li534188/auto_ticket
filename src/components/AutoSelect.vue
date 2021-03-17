<template>
  <section class="auto-select-wrapper">
    <div @click.stop="openSelect" :class="['select-parent',{'time-style':selectType==='time'}, {'company-style': selectType==='company'}]">
      <div :class="[selectType==='company'?'company-color':'select-value','select-label', companyLebal,]" >{{value}}</div>
      <DownOutlined :class="['select-prefix-icon',{'rotate-icon':showSelect}]"/>
    </div>
    <div @click="chooseSelect($event)" v-if="showSelect&&selectType==='company'" class="select-arr">
      <div :data-value="item.value" :data-title="item.title" class="select-children sub-select-children-style"  v-for="(item,) in options" :key="item.title">
        <span :data-value="item.value" :data-title="item.title" :class="['company-color','select-label',item.title]">{{item.title}}</span><br>
        <div :data-value="item.value" :data-title="item.title" class="company-select-item">{{item.context}}</div>
      </div>
    </div>
    <div @click="chooseSelect($event)" v-if="showSelect&&selectType!=='company'" class="select-arr">
      <div :data-item="item"  :class="['select-children',{'time-children-style':selectType==='time'}]"  v-for="(item,) in options" :key="item.title">
        <span :data-item="item" class="select-item">{{item}}</span>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { DownOutlined } from '@ant-design/icons-vue';
import { Prop, } from 'vue-property-decorator';
@Options({
  components: {
    DownOutlined
  }
})
export default class AutoSelect extends Vue {
  @Prop() private options!: any[];
  @Prop() private value!: string;
  @Prop() private selectType!: string;
  private showSelect =false;
  private companyLebal = ''
  private openSelect() {
    this.showSelect = true;
    window.addEventListener('click', this.closeSelect);
  }

  private closeSelect() {
    this.showSelect = false;
    window.removeEventListener('click', this.closeSelect);
  }

  private chooseSelect(event: Event) {
    const target = event.target as HTMLElement;
    const { item, value, title } = target.dataset;
    if (item) {
      this.$emit('update:value', item);
    } else if (value&&title) {
      this.$emit('update:value', value);
      this.companyLebal = title;
      this.showSelect = false;
    }

  }
}
</script>

<style lang="scss" scoped>
.auto-select-wrapper{
    position: relative;
    height: 100%;
    .select-parent{
      color:rgba(0, 0, 0, 0.65);
      border: 1px solid rgba(0, 0, 0, 0.25);
      cursor: pointer;
      width: 100%;
      height: 30px;
      padding:0 5px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .select-label{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .select-prefix-icon{
        font-size: 10px;
        transition: all .5s;
      }
      .rotate-icon{
        transform: rotate(180deg);
      }
    }
    .time-style{
      text-align: center;
      height: 20px;
      border: 1px dashed rgba(0, 0, 0, 0.25);
    }
  }
  .select-value{
    width: 100%;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .company-select{
    position: relative;
  }
  .sub-select-children-style{
    text-align: left !important;
  }
  .select-arr{
    position: absolute;
    border: 0.5px solid #D6D6D6;
    border-radius: 5px;
    width:100%;
    height:99px;
    overflow: auto;
    background: #FFFFFF;
    z-index: 5;
    .select-children{
      line-height: 23px;
      padding: 0 10px;
      border-bottom: 1px solid rgba(151, 151, 151, 0.198345);
      &:hover{
        background: rgb(233, 230, 230);
      }
      .select-item{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .company-select-item{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 19px;
        width: 100%;
        font-size: 8px;
      }
    }
    .time-children-style{
      text-align: center;
    }
}
</style>
