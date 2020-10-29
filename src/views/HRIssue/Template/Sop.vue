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

    <!-- <a-form-item label="Activity name">
      <a-input v-model:value="form.name" />
    </a-form-item>
    <a-form-item label="Activity zone">
      <a-select v-model:value="form.region" placeholder="please select your zone">
        <a-select-option value="shanghai">
          Zone one
        </a-select-option>
        <a-select-option value="beijing">
          Zone two
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Activity time">
      <a-date-picker
        v-model:value="form.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%;"
      />
    </a-form-item>
    <a-form-item label="Instant delivery">
      <a-switch v-model:checked="form.delivery" />
    </a-form-item>
    <a-form-item label="Activity type">
      <a-checkbox-group v-model:value="form.type">
        <a-checkbox value="1" name="type">
          Online
        </a-checkbox>
        <a-checkbox value="2" name="type">
          Promotion
        </a-checkbox>
        <a-checkbox value="3" name="type">
          Offline
        </a-checkbox>
      </a-checkbox-group>
    </a-form-item>

    <a-form-item label="Activity form">
      <a-input v-model:value="form.desc" type="textarea" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        Create
      </a-button>
      <a-button style="margin-left: 10px;">
        Cancel
      </a-button>
    </a-form-item> -->
  </a-form>
</template>
<script>
export default {
  mounted() {
    console.log(99999);
    const obj = new Proxy({}, {
      get(target, propKey, receiver) {
        console.log(`getting ${propKey}!`);
        return Reflect.get(target, propKey, receiver);
      },
      set(target, propKey, value, receiver) {
        console.log(`setting ${propKey}!`);
        return Reflect.set(target, propKey, value, receiver);
      }
    });
    obj.count = 1;
    ++obj.count;
  },
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
            'item1', 'item2', 'item3', 'item4', 'item5',
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