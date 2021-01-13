<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <div>
      <a-checkbox-group class="special-box" :disabled="!allowEdit" style="width:100%" v-model:value="selectAccess">
        <a-row class="list-style">
          <a-col class="item-style" span="6" v-for="(value, key,) in checkData" :key="key" >
            <a-checkbox  :value="value" >
              {{key}}
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </div>
  </a-form>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { getAccessList } from '@/utils/server';
export default class Access extends Vue {
  @Prop() private accessValue!: string[];
  @Prop() private exitAcess!: string[];
  @Prop() private allowEdit!: boolean;
  @Prop() private templateModel!: string;


  private labelCol = { span: 4 };
  private wrapperCol =  { span: 14 };
  private selectAccess: string [] = [];
  private form = {
    name: '',
    region: undefined,
    date1: undefined,
    delivery: false,
    type: ['item16', 'item17'],
    resource: '',
    desc: '',
  };
  private radioData = [
    'Print',
    'Bindery',
    'Fulfillment/HW',
    'Leadership',
    'Shipping/Receiving'
  ];
  private checkData = [];
  private formateItem(item: string) {
    const res = item.replace(/_/g, ' ');
    return res;
  }

  mounted() {
    const res = getAccessList();
    res.then(data => {
      this.checkData = data;
    });
  }

  @Watch('selectAccess')
  private onItemChange(value: string[]) {
    this.$emit('update:accessValue', value);
  }

  @Watch('allowEdit')
  private allowEditChange(value: string) {
    if (!value && this.templateModel!=='create') {
      this.selectAccess = this.exitAcess;
    }
  }


  @Watch('exitAcess', { immediate: true })
  private exitAcessChange(val: string[]) {
    this.selectAccess = val;
  }

}
</script>
<style lang="scss" scoped>
  .list-style{
    line-height: 2.5rem;
    .item-style{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
