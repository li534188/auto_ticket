<template>
  <div class="sop-wrapper">
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
          <a-row type="flex" align="top" class="list-style">
            <a-col class="item-style" :title="key" :span="8" v-for="(subItem, key) in  item" :key="key" >
              <a-checkbox :value="subItem">
                <div class="sop-item-wrapper">
                  <span class="sop-item">{{key}}</span>
                </div>
              </a-checkbox>
            </a-col>
          </a-row>
        </div>
      </a-checkbox-group>
    </a-form>
  </div>
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
    const newData: {[key: string]: {[key: string]: string}} = { 'Policies': {}, 'Other Documents': {}, 'Work Instructions': {}, SOP: {}};
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
        newData.SOP[element] =  data[element];
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

  @Watch('selectRadio')
  private onRadioChange(value: string[], oldValue: string[]) {
    const { sopDefaultSelect, templateModel } = this;
    // reduce
    if (templateModel==='create'||this.allowEdit) {
      const formValue = JSON.parse(JSON.stringify(this.form));
      oldValue.map(item => {
        sopDefaultSelect[item]&&sopDefaultSelect[item].map((val: string) => {
          const index = formValue.findIndex((sumbitem: string) => sumbitem === val);
          if (index > -1)
            formValue.splice(index, 1);
        });
      });
      // add
      value.map(item => {
        sopDefaultSelect[item]&&sopDefaultSelect[item].map((val: string) => {
          formValue.push(val);
        });
      });
      const newarr = formValue.filter((item: string, index: number, arr: string[]) => {
        return arr.indexOf(item, 0) === index;
      });
      this.form = newarr;
    }
    // let arr: string[] = [];
    // if (templateModel==='create'||this.allowEdit) {
    //   // reduce
    //   const formValue = JSON.parse(JSON.stringify(this.form));
    //   if (oldValue.length > value.length) {
    //     let reduceStr = '';
    //     oldValue.map(item => {
    //       if (value.indexOf(item) < 0) {
    //         reduceStr = item;
    //       }
    //       reduceStr&&sopDefaultSelect[reduceStr]&&sopDefaultSelect[reduceStr].map((val: string) => {
    //         const index = formValue.findIndex((sumbitem: string) => sumbitem === val);
    //         if (index > -1)
    //           formValue.splice(index, 1);
    //       });
    //       reduceStr = '';
    //     });
    //   } else {
    //     let addStr = '';
    //     value.map(item => {
    //       if (oldValue.indexOf(item) < 0) {
    //         addStr = item;
    //       }
    //       addStr&&sopDefaultSelect[addStr]&&sopDefaultSelect[addStr].map((val: string) => {
    //         formValue.push(val);
    //       });
    //       addStr = '';
    //     });
    //   }
    //   // add
    //   // reduce
    this.$emit('update:phase', value);
  }

  @Watch('form')
  private onitemChange() {
    const { selectRadio, form } = this;
    this.$emit('update:sopValue', selectRadio?form:[]);
  }

  @Watch('allowEdit')
  private allowEditChange(value: string) {
    if (!value&&this.templateModel!=='create') {
      this.form = JSON.parse(JSON.stringify(this.exitSop));
      this.selectRadio = this.exitPhase;
    }
  }

  @Watch('exitSop', { deep: true, immediate: true })
  private exitSopChange(value: string[]) {
    this.form = JSON.parse(JSON.stringify(value));
  }

  @Watch('exitPhase',  { immediate: true })
  private exitPhaseChange(value: string[]) {
    this.selectRadio = value;
  }

}
</script>
<style lang="scss" scoped>
  .sop-wrapper{
    height: 480px;
    overflow-y: scroll;
  }
  .list-style{
    line-height: 30px;
    .item-style{
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        .sop-item-wrapper{
          display: block;
          float: right;
          max-width: 250px;
          .sop-item{
            line-height: 15px;
            display: inline-block;
            vertical-align: text-top;
          }
        }
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