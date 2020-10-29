<template>
  <div class="wrapper">
    <h1>New Template</h1>
    <h3>Name</h3>
    <div class="search" >
      <a-input class="search-input" v-model:value="form.name" />
      <a-tag class="search-tag" color="orange">
        Check Duplicates
      </a-tag>
    </div>

    <a-tabs>
      <a-tab-pane key="1">
        <template v-slot:tab>
          <span>
            <apple-outlined />
            Access
          </span>
        </template>
        <access />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template v-slot:tab>
          <span>
            <android-outlined />
            Sop
          </span>
        </template>
        <sop />
      </a-tab-pane>
    </a-tabs>

  </div>

</template>

<script>
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons-vue';
import Sop from './Sop.vue';
import Access from './Access.vue';
export default {
  name: 'Template',
  components: {
    AppleOutlined,
    AndroidOutlined,
    Sop,
    Access
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
    };
  }
};
</script>
<style lang="scss" scoped>
*{
  text-align: left;
}
h1{
  font-size: 30px;
}
.wrapper{
  padding: 0 3rem;
  .search{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    .search-input{
      flex:0 0 60%;
    }
    .search-tag{
      flex:0 0 auto;
      margin-left: 2rem;
    }
  }
}


</style>>
