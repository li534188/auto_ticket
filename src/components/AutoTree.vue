<template>
  <div>
    <div v-for="item in treeData" :key="item.title" >
      <div :class="['parent-item',`sub-${deep}`, {'active-item':activeKey === item.title}]" @click="toggle(item.title)">
        <CaretDownOutlined  v-show="item.children && item.children.length>0" :class="['left-icon-style',{'open-item':!checkActive(item.title)}]"/>
        <span :class="[{'additional-width':!item.children}]">{{item.value}}</span>
      </div>
      <div v-if="checkActive(item.title)">
        <auto-tree
          v-if="item.children && item.children.length>0"
          :deep="deep+1"
          :parentkey="activeKey"
          :clickMethod="clickMethod"
          :changeParentKey="changeKey"
          :treeData="item.children">
        </auto-tree>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { DownOutlined } from '@ant-design/icons-vue';
import { Prop, Watch } from 'vue-property-decorator';
import { CaretDownOutlined } from '@ant-design/icons-vue';
@Options({
  components: {
    DownOutlined,
    CaretDownOutlined
  },
  name: 'auto-tree',
})
export default class AutoTree extends Vue {
  @Prop() private showCheckbox!: boolean;
  @Prop() private treeData!: any;
  @Prop({ default: 0 }) private deep?: number;
  @Prop({ default: '0' }) private parentkey?: string;
  @Prop() private changeParentKey!: {(item: string): void};
  @Prop() private clickMethod!: {(activeKey: string): void};
  private isOpen = false;
  private openKey: string[] = [];
  private activeKey = '0';

  private changeKey(item: string) {
    this.activeKey =item;
  }

  @Watch('parentkey')
  private parentKeyChange(value: string) {
    this.activeKey = value;
  }

  @Watch('activeKey')
  private keyChange(value: string) {
    if (this.changeParentKey) {
      this.changeParentKey(value);
    }
  }

  private toggle(title: string) {
    this.activeKey = title;
    this.clickMethod&&this.clickMethod(title);
    if (this.openKey.some(item => {
      return item === title;
    })) {
      this.openKey = this.openKey.filter(item => {
        return item !== title;
      });
    } else {
      this.openKey.push(title);
    }
  }

  private checkActive(title: string) {
    return this.openKey.some(item => {
      return item === title;
    });
  }
}
</script>

<style lang="scss" scoped>
  .parent-item{
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    font-family: HelveticaNeue;
    color: #6A778B;
    margin:1px
  }
  .active-item{
    // display: inline-block;
    // line-height: 20px;
    // height: 20px;
    // padding: 0 10px;
    background-color: #f5f7f7 !important;
  }
  .additional-width{
    margin-left:16px;
  }
  @for $i from 1 through 5{
    .sub-#{$i}{
      padding-left:20px * ($i+1);
      font-size: 11px;
    }
  }
  .sub-0{
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 2.4px;
    padding-left: 20px;
  }

  .left-icon-style{
    margin-right: 5px;
    color: #6A778B;
  }
  .open-item{
    transform: rotate(-90deg);
  }
</style>
