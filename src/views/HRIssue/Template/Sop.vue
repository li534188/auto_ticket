<template>
  <a-form>
    <a-form-item >
      <a-checkbox-group class="special-box" :disabled="!allowEdit" style="width:100%" v-model:value="selectRadio">
        <a-checkbox v-for="(item, key) in  radioData"  :key="key" :value="item" >
          {{formateLabel(item)}}
        </a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-checkbox-group class="special-box" style="width:100%" :disabled="!allowEdit" v-model:value="form">
      <div v-for="(item, key) in  selectDatas" :key="key" class="sop-phase" >
        <a-row >
          <a-col :span="24">
            <div class="phase-title">
              {{key}}
            </div>
          </a-col>
        </a-row >
        <a-row class="list-style">
          <a-col class="item-style" :title="key" :span="8" v-for="(subItem, key) in  item" :key="key" >
            <a-checkbox :value="subItem">
              {{key}}
            </a-checkbox>
          </a-col>
        </a-row>
      </div>
    </a-checkbox-group>
  </a-form>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';
export default class Sop extends Vue {

  @Prop({ required: true }) private sopValue!: any;
  @Prop({ required: true }) private phase!: string;
  @Prop({ required: true }) private templateModel!: string;
  @Prop({ required: true }) private exitSop!: string[];
  @Prop({ required: true }) private exitPhase!: string[];
  @Prop({ required: true }) private sopDefaultSelect!: {[key: string]: string[]};
  @Prop() private allowEdit!: boolean;
  @Prop({ required: true }) private allData!: any;
  private radioData = [
    'Print',
    'Bindery',
    'Fulfillment_HW',
    'Leadership',
    'Shipping_Receiving',
  ];

  private sopStructure: any = {
    Policies: ['No Touch Policy', 'One Touch Policy', 'Peer to Peer Policy'],
    'Work Instructions': ['Tap Test Procedure', 'Centene Hand Bind Quality Assurance', 'Production Schedules', 'Automated Daily Shift Log'],
    'Other Documents': ['Poor Quality of Centene NCR Form', 'NAV Customer Inventory Guidelines'],
  }

  private selectRadio: string[] = [];

  private form: any[] = [];

  private formateItem(item: string) {
    const res = item.replace(/_/g, ' ');
    return res;
  }

  private formateLabel(item: string) {
    const res = item.replace(/_/g, '/');
    return res;
  }


  get selectDatas() {
    const data = this.allData;
    // {sop:{sop1:123,sop2:456}}
    const newData: {[key: string]: {[key: string]: string}} = { 'Policies': {}, 'Other Documents': {}, 'Work Instructions': {}, sop: {}};
    let sopFlag = true;
    for (const element in data) {
      sopFlag = true;
      for (const key in this.sopStructure) {
        for (let i = 0; i< this.sopStructure[key].length; i++) {
          if (this.sopStructure[key][i].toLowerCase() === element.toLowerCase()) {
            newData[key][element] = data[element];
            sopFlag = false;
            break;
          }
        }
        if (!sopFlag) {
          break;
        }
      }
      if (sopFlag) {
        newData.sop[element] =  data[element];
      }
    }
    return newData;
  }
  // data&&data.forEach((element: string) => {
  //   sopFlag = true;
  //   for (const key in this.sopStructure) {
  //     for (let i = 0; i< this.sopStructure[key].length; i++) {
  //       if (this.sopStructure[key][i].toLowerCase() === element) {
  //         newData[key].push(element);
  //         sopFlag = false;
  //         break;
  //       }
  //     }
  //     if (!sopFlag) {
  //       break;
  //     }
  //   }
  //   if (sopFlag) {
  //     newData.sop.push(element);
  //   }
  // });
  // return newData;

  @Watch('selectRadio', { immediate: true })
  private onRadioChange(value: string[]) {
    const { sopDefaultSelect, templateModel } = this;
    let arr: string[] = [];
    if (templateModel==='create') {
      if (Array.isArray(value)&&value.length > 0) {
        value.map(item => {
          arr = arr.concat(sopDefaultSelect[item]);
        });
      }
      const newarr = arr.filter((item, index, arr) => {
        return arr.indexOf(item, 0) === index;
      });
      this.form = newarr;
    }
    this.$emit('update:phase', value);
  }

  @Watch('form')
  private onitemChange() {
    const { selectRadio, form } = this;
    console.log(form);
    this.$emit('update:sopValue', selectRadio?form:[]);
  }

  @Watch('allowEdit')
  private allowEditChange(value: string) {
    if (!value&&this.templateModel!=='create') {
      this.form = this.exitSop;
      this.selectRadio = this.exitPhase;
    }
  }

  @Watch('exitSop', { deep: true, immediate: true })
  private exitSopChange(value: string[]) {
    this.form = value;
  }

  @Watch('exitPhase',  { immediate: true })
  private exitPhaseChange(value: string[]) {
    console.log(value);
    this.selectRadio = value;
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
  .ant-radio-wrapper{
    font-size: 12px!important;
  }
  .phase-title{
    font-family: HelveticaNeue;
    font-size: 13px;
    color: #3B4859;
  }
  .sop-phase{
    margin-bottom: 20px;
  }
</style>