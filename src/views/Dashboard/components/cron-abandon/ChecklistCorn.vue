<template>
  <div class="components-input-demo-presuffix">
    <a-input @click="openModal" placeholder="corn表达式" v-model:value="cron" >
      <tempalte v-solt:prefix>
        <a-icon type="schedule" title="corn控件"/>
      </tempalte>
      <tempalte v-solt:suffix>
        <a-icon v-if="cron" type="close-circle" @click="handleEmpty" title="清空"/>
      </tempalte>
    </a-input>
    <AutoCorn ref="innerVueCron" :propData="cron" :ok="handleOK"></AutoCorn>
  </div>
</template>
<script>
import AutoCorn from '@/components/AutoCorn.vue';
export default {
  name: 'ChecklistCorn',
  components: {
    AutoCorn,
  },
  props: {
    value: {
      required: false,
      type: String,
    }
  },
  data() {
    return {
      cron: this.value,
    };
  },
  watch: {
    value(val) {
      this.cron = val;
    }
  },
  methods: {
    openModal() {
      this.$refs.innerVueCron.show();
    },
    handleOK(val) {
      console.log('pppppppp');
      console.log(val);
      this.cron = val;
      // this.$emit("change", Object.assign({},  this.cron));
    },
    handleEmpty() {
      this.handleOK('');
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
};
</script>
<style scoped>
  .components-input-demo-presuffix .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }
  .components-input-demo-presuffix .anticon-close-circle:hover {
    color: #f5222d;
  }
  .components-input-demo-presuffix .anticon-close-circle:active {
    color: #666;
  }
</style>