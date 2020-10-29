<template>
  <div class="wrapper">
    <div class="sloid">
      <header>
        pending hr issue
        <div>
          <span>order by</span>
          <a-radio-group v-model:value="ridaoValue">
            <a-radio style="margin-right:3rem"  value="0">
              Time
            </a-radio>
            <a-radio style="margin-right:3rem"  value="1">
              Priority
            </a-radio>
          </a-radio-group>
        </div>
      </header>
      <section>
        <a-list item-layout="horizontal" :data-source="datas">
          <template v-slot:renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              >
                <template v-slot:title>
                  <a href="https://www.antdv.com/">{{ item.title }}</a>
                </template>
                <template v-slot:avatar>
                  <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </section>
    </div>
    <div class="divider"/>
    <div class="content">
      <header>
        HR-113
      </header>
      <section class="content-details">
        <a-row v-for="(item, index) in info" :key="index">
          <a-col  :span="4">
            <span class="lable">{{item.title}}</span>
          </a-col>
          <a-col  :span="16">
            <span class="content">{{item.value}}</span>
          </a-col>
        </a-row>
      </section>
      <div class="content-divider"/>
      <div>
        <span>Creating tickets and confluence page for</span>
        <div class="content-progress">
          <a-progress :percent="50" status="active" />
        </div>
      </div>
      <div class="content-divider"/>
      <section class="content-list">
        <div  class="content-list-details">
          <header>Access Tickets</header>
          <section>
            <a-list item-layout="horizontal" :data-source="datas">
              <template v-slot:renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  >
                    <template v-slot:title>
                      <a href="https://www.antdv.com/">{{ item.title }}</a>
                    </template>
                    <template v-slot:avatar>
                      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
interface InfoType{
  title: string;
  value: string;
}
import { Options, Vue, } from 'vue-class-component';
// import { Watch } from 'vue-property-decorator';
// import SloidLayout from '@/components/layout/SloidLayout.vue';

import SloidLayout from '@/components/layout/SloidLayout.vue';
@Options({
  components: {
    SloidLayout,
  },
})
export default class Employee extends Vue {
  private ridaoValue = '1';
  private datas: {title: string}[] = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  private info: InfoType[] = [
    {
      title: 'Name',
      value: 'Lyt',
    }, {
      title: 'Perfered Name',
      value: 'Job Title',
    }, {
      title: 'Company',
      value: 'Lyt',
    }, {
      title: 'Location',
      value: 'Lyt',
    }, {
      title: 'Department',
      value: 'Lyt',
    },
  ]
}

</script>
<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    height: 100%;
    padding:0 50px;
    padding-top: 1%;
    .sloid{
      width:20%;
      float: left;
    }
    .content{
      width:78%;
      float: right;
      .content-divider{
        border: 1px solid rgba($color: #000000, $alpha: .1);
        width: 80%;
      }
      .content-progress{
        display: inline-block;
        width: 50%;
      }
    }
    .divider{
      border: 1px solid rgba($color: #000000, $alpha: .1);
      float: left;
      height: 85%;
    }
  }
</style>>