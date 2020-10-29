<template>
  <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item >
      <a-radio-group style="width:100%" v-model:value="form.resource">
        <a-radio style="margin-right:3rem" v-for="(item,index) in  radioData" :key="index" :value="item">
          {{item}}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <div v-for="(item,index) in  checkData" :key="index" >
      <a-row>
        <a-col :span="24">
          <h3>
            {{item.title}}
          </h3>
        </a-col>
      </a-row>
      <a-row>
        <a-checkbox-group style="width:100%" v-model:value="form.type">
          <a-col :span="6" v-for="(subItem) in  item.data" :key="subItem" >
            <a-checkbox  :value="subItem">
              {{subItem}}
            </a-checkbox>
          </a-col>
        </a-checkbox-group>
      </a-row>
    </div>
  </a-form>
</template>
<script>
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      radioData: [
        'Print',
        'Bindery',
        'Fulfillment/HW',
        'Leadership',
        'Shipping/Receiving'
      ],
      checkData: [
        {
          title: 'Policies',
          data: [
            'test1', 'test2', 'test3', 'test4', 'test5',
          ]
        }, {
          title: 'Other Documents',
          data: [
            'item6', 'item7', 'item8', 'item9', 'item10',
          ]
        }, {
          title: 'Work Instructions',
          data: [
            'item11', 'item12', 'item13', 'item14', 'item15',
          ]
        },
      ]
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!', this.form);
    },
  },
  watch: {
    'form.type': {
      handler(val) {
        console.log('console.log(val)');
        console.log(val);
      },
      deep: true,
    },
    'form.resource'(val) {
      console.log(val);
    }
  }

};
</script>
<style>

</style>