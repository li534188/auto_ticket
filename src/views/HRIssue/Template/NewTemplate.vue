<template>
  <div class="template-wrapper">
    <div class="spin-wrapper">
      <a-spin :spinning='showLoading'>
        <template v-slot:indicator>
          <loading-outlined style="font-size: 35px" spin />
        </template>
      </a-spin>
    </div>
    <div class="template-title">
      <left-outlined @click="goBack" class="template-title-icon" />
      <span class="template-title-info">{{templateModel==='create'?'New Template':temPlateTitle}}</span>
      <span v-if="templateModel === 'edit'">
        <span v-if="allowEdit">
          <span  @click="enterEdit" ><img  class='edit-img'  src='@/assets/img/pen.svg'></span>
          <span class='template-title-edit'>edit</span>
        </span>
        <span v-else>
          <span @click="enterEdit"><img  class='edit-img'  src='@/assets/img/penBlack.svg'></span>
          <delete-filled  @click="showConfirm" class="delete-icon"  />
        </span>
      </span>
    </div>
    <div class="form-wrapper">
      <section class="input-wrapper">
        <div class="input-lebal">Name *</div>
        <a-input :class="['search-name',(onCreateDown&&(!form.templateName))?'error-style':'']" :disabled="!allowEdit" v-model:value="form.templateName" placeholder="Template Name" />
        <div class="error-info" v-if="onCreateDown&&(!form.templateName)">pleace enter name</div>
      </section>
      <section class="input-wrapper company-select">
        <div class="input-lebal">Company *</div>
        <div @click.stop="openSelect" :class="['select-parent',allowEdit?'':'select-disabled',(onCreateDown&&!form.company)?'error-style':'']">
          <div  :class="['company-color','select-label', 'select-value', companyLebal]">{{form.company||'company'}}</div>
          <down-outlined :class="['select-prefix-icon',showSelect?'rotate-icon':'']"/>
        </div>
        <div v-if="showSelect" class="select-arr">
          <div @click="chooseSelect(item)" class="select-children"  v-for="(item,) in companyList" :key="item.title">
            <span  :class="['company-color','select-label',item.title]">{{item.title}}</span><br>
            <span class="select-item">{{item.context}}</span>
          </div>
        </div>
        <div class="error-info" v-if="onCreateDown&&(!form.company)">pleace enter company</div>
      </section>
      <section class="input-wrapper search-manager-wrapper">
        <div class="input-lebal">Manager *</div>
        <a-input :class="['search-manager',(onCreateDown&&!form.manager)?'error-style':'']" :disabled="!allowEdit" v-model:value="form.manager" placeholder="Manager">
          <template #prefix> <search-outlined /></template>
        </a-input>
        <div v-if="showManagerPrompt" class="prompt-wrapper">
          <div @click.stop="chooseManager(item,)" class="prompt-item" v-for="(item) in managerList" :key="item">
            {{item}}
          </div>
          <div @click.stop="chooseManager('')" class="prompt-item" v-if="managerList&&managerList.length < 1" :key="item">
            null
          </div>
        </div>
        <div class="error-info" v-if="onCreateDown&&(!form.manager)">pleace enter manager</div>
      </section>
    </div>
    <div v-if="checkRepeat" class="warning-info">This template is already existed. Please change the name, the company or the manager.</div>
    <a-tabs class="tab-style">
      <a-tab-pane key="1">
        <template  v-slot:tab>
          <span class="tab-title">
            Access
          </span>
        </template>
        <access v-model:accessValue="accessValue" :allowEdit="allowEdit" :exitAcess="exitAcess" :templateModel="templateModel" />
        <div class="error-info" v-if="onCreateDown&&(accessValue.length === 0)">please choose at least one item</div>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template v-slot:tab>
          <span class="tab-title">
            SOP
          </span>
        </template>
        <sop v-model:sopValue="sopValue" :allData="sopCheckboxData" :templateModel="templateModel" v-model:phase="phase" :exitSop='exitSop' :sopDefaultSelect="sopDefaultSelect" :allowEdit="allowEdit" :exitPhase="exitPhase" />
      </a-tab-pane>
    </a-tabs>
    <div class="template-button-wrapper">
      <a-button v-if="templateModel==='edit'" @click="updataTemplateData" :disabled="!allowEdit||showLoading" :class="['template-buttons','save', allowEdit?'auto-button':'auto-button-disable']">Save</a-button>
      <a-button v-if="templateModel==='edit'" @click="enterEdit" :disabled="!allowEdit||showLoading" :class="['template-buttons', allowEdit?'auto-button':'auto-button-disable']">Cancel</a-button>
      <a-button v-if="templateModel==='create'" class="auto-button template-buttons" :disabled="showLoading" @click="createMethod">Create</a-button>
    </div>
  </div>
</template>

<script lang="ts">
interface FormType{
  manager: string;
  company: string;
  templateName: string;
}


import { Options, Vue, } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { SearchOutlined, LeftOutlined, DeleteFilled, DownOutlined, LoadingOutlined  } from '@ant-design/icons-vue';
import * as _ from 'lodash';
import { TemplateModule } from '@/store/modules/template';
import { checkDuplicate, createTemplate, getSopList, getTemplateInfo, updateTeplate, deleteTemplate, getSop } from '@/utils/server';
import Sop from './Sop.vue';
import Access from './Access.vue';
import { message, Modal } from 'ant-design-vue';
@Options({
  components: {
    Sop,
    Access,
    SearchOutlined,
    LeftOutlined,
    DeleteFilled,
    DownOutlined,
    LoadingOutlined
  },
})
export default class NewTemplate extends Vue {

  private form: FormType = { manager: '', company: '', templateName: '' };
  private managerList: string[] = TemplateModule.managerList;
  private showManagerPrompt = false;
  private templateModel = 'create';
  private allowEdit = false;
  // 控制是否显示select;
  private showSelect = false;
  // 用来显示前面的圆环
  private companyLebal = '';
  private checkRepeat = false;
  private accessValue: string[] = [];
  private sopValue: string[] = [];
  private phase: string[] = [];
  private onCreateDown = false;
  private showLoading = false;
  private sopDefaultSelect: {[key: string]: string[]} = {};
  private templateId = '';
  private exitSop: string[] = [];
  private temPlateTitle = '';
  private exitAcess: string[] = [];
  private exitPhase: string[] = [];
  private sopCheckboxData: string[] = [];
  mounted() {
    this.templateModel = this.$route.params.type as string;
    const res = getSop();
    res.then((data: string[]) => {
      this.sopCheckboxData = data;
    });
    if (this.templateModel ==='create') {
      this.allowEdit = true;
      this.form.templateName = this.$route.query.templateName as string;
      const query = this.$route.query as {templateName: string; manager?: string; company?: string};
      const { templateName, manager, company } = query;
      if (templateName)
        this.form.templateName = templateName;
      if (manager)
        this.form.manager = manager;
      if (company) {
        this.companyList.map((item) => {
          if (item.value===company) {
            this.form.company = item.value;
            this.companyLebal =item.title;
          }
        });
      }


      getSopList().then(data => {
        this.sopDefaultSelect = data;
      });
    } else {
      const options = this.$route.query as {templateId: string; company: string; job_title: string; manager: string};
      const { templateId, company, job_title, manager } = options;
      this.form = { company, manager, templateName: job_title };
      this.templateId = templateId;
      this.temPlateTitle = job_title;
      getTemplateInfo({ templateId  }).then(res => {
        if (res) {
          const { access, sop, phase } =res;
          if (access&& sop&&phase) {
            this.exitPhase = phase;
            this.exitSop = sop;
            this.exitAcess = access;
          }
        }
      });
      this.allowEdit = false;
    }
  }

  @Watch('form.manager')
  private changeManagerShow(value: string) {
    const options = this.$route.query as {templateId: string; company: string; job_title: string; manager: string};
    const { manager } = options;
    if (manager === value) {
      return;
    }
    if (value) {
      this.showManagerPrompt = true;
      const newArr = JSON.parse(JSON.stringify(TemplateModule.managerList));
      this.managerList = newArr.filter((item: string) => item.toLowerCase().indexOf(value.toLowerCase())>-1);
      window.addEventListener('click', this.closeMamagerPrompt);
    } else {
      this.closeMamagerPrompt();
      this.managerList = TemplateModule.managerList;
    }
  }

  private closeMamagerPrompt() {
    this.showManagerPrompt = false;
    window.removeEventListener('click', this.closeMamagerPrompt);
  }


  @Watch('form', { deep: true })
  private watchForm= _.debounce((value) => {
    this.onCreateDown = false;
    const { manager, templateName,  } = value;
    if (manager && templateName) {
      const res = checkDuplicate({ jobTitle: templateName, manager, templateId: this.templateId });
      res.then(data => {
        if (data) {
          this.checkRepeat = true;
        } else {
          this.checkRepeat = false;
        }
      });
    }
  }, 300);

  @Watch('allowEdit')
  private allowEditChange(value: boolean) {
    if (!value) {
      const options = this.$route.query as {templateId: string; company: string; job_title: string; manager: string};
      const { templateId, company, job_title, manager } = options;
      if (templateId) {
        this.form = { company, manager, templateName: job_title };
      }
    }
  }


  chooseManager(value: string,) {
    this.form.manager = value;
    setTimeout(() => {
      this.showManagerPrompt = false;
    }, 100);
  }

  goBack() {
    this.$router.push('/hrissue/template/list');
  }

  private enterEdit() {
    this.allowEdit = !this.allowEdit;
  }

  private openSelect() {
    if (!this.allowEdit)
      return;
    this.showSelect = true;
    window.addEventListener('click', this.closeSelect);
  }

  private closeSelect() {
    this.showSelect = false;
    window.removeEventListener('click', this.closeSelect);
  }

  private chooseSelect(obj: {title: string; value: string}) {
    this.form.company = obj.value;
    this.companyLebal = obj.title;
    this.showSelect = false;
  }

  private createMethod() {
    this.onCreateDown = true;
    const { form, accessValue, phase, sopValue, checkRepeat } = this;
    const { templateName, company, manager } = form && form;
    if (!this.checkDataLegal({ accessValue, sopValue, checkRepeat, templateName, company, manager })) {
      return;
    }
    this.showLoading = true;
    const storage = window.localStorage;
    const userName = storage.getItem('userName');
    const res = createTemplate({ jobTitle: templateName, company, manager, phase, access: accessValue, sop: sopValue, creator: userName });
    res.then(data => {
      this.showLoading = false;
      if (data) {
        message.success(data);
      }
      this.onCreateDown = false;
      this.$router.push('/hrissue/template/list');
    });
  }

  private updataTemplateData() {
    const { templateId, form, phase, accessValue, sopValue, checkRepeat } = this;
    const { manager, templateName, company } = form;
    if (!this.checkDataLegal({ accessValue, sopValue, checkRepeat, templateName, company, manager })) {
      return;
    }
    this.showLoading = true;
    templateId&&updateTeplate({ templateId, jobTitle: templateName, company, manager, phase, access: accessValue, sop: sopValue }).then(res => {
      res&&message.success(res);
      this.showLoading = false;
    });
  }


  private showConfirm() {
    Modal.confirm({
      title: 'Do you want to delete these item?',
      onOk: () => {
        if (this.templateId) {
          const result = deleteTemplate({ templateId: this.templateId });
          result.then(data => {
            if (data === 'Template Deleted') {
              message.info('Templates  Deleted!');
            } else {
              message.info('Failed To Deleted!');
            }
            this.$router.go(-1);
          });
        }

      },
    });
  }

  private checkDataLegal(data: {templateName: string; company: string; manager: string;accessValue: string[];sopValue: string[];checkRepeat: boolean}) {
    const { templateName, company, manager, accessValue, sopValue, checkRepeat } = data;
    if (!templateName||!company||!manager||(accessValue.length ===0 && sopValue.length===0) || checkRepeat) {
      return false;
    } else {
      return true;
    }
  }

  get companyList() {
    return TemplateModule.companyList;
  }

}
</script>


<style lang="scss">
  $free-color: #e64856, #ff8c00, #47d040, #8864b8, #fff100, #36c2ef;
    @each $c in $free-color{
      $i:index($free-color,$c);
        .company-info-#{$i}::before{
          border: 2.5px $c solid;
          width: 12px;
          height: 12px;
          content:'';
          display: inline-block;
          border-radius: 50%;
          margin-right:5px
        }
    }
    .single-select{
      line-height: 12px;
    }
  h1{
    font-size: 30px;
  }
  .form-wrapper{
    font-family: HelveticaNeue;
    display: flex;
    font-size: 12px;
    input{
      font-size: 12px;
    }
    .input-lebal{
      height: 1.4rem;
      font-size: 12px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #3b4859;
      margin-bottom: 10px;
    }
    .search-name{
      width: 384px;
    }
    .search-select{
      width: 157px;
    }
    .search-manager-wrapper{
      position: relative;
      width: 122px;
      margin-right: unset;
      .prompt-wrapper{
        position: absolute;
        width: 122px;
        height: 158px;
        margin: 1px 0 0;
        padding: 0 0 1px;
        border-radius: 8px;
        overflow: scroll;
        background-color: #fff;
        z-index: 9;
        .prompt-item{
          line-height: 27px;
          color: #3b4859;
          padding-left: 5px;
          font-size: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 15px;
          &:hover{
            background-color: #f1f5fc;
          }
        }
      }
    }
  }
  .warning-info{
    font-family: HelveticaNeue;
    font-size: 11px;
    line-height: 13px;
    color: #C377F0;
  }
  .special-modal{
    .ant-modal-header{
      border: unset;
      text-align: center;
    }
    .ant-modal-body{
      display: none;
    }
    .ant-modal-footer{
      border: unset;
    }
  }
  .template-wrapper{
    padding: 26px 38px;
    position: relative;
    height: 100%;
    .spin-wrapper{
      position: absolute;
      top:40%;
      left: 45%;
      z-index: 9;
    }
    .template-title-icon{
      cursor: pointer;
    }
    .template-title{
      font-size: 16px;
      margin-left: -20px;
      color: #6a778b;
      margin-bottom: 16px;
    }
    .template-title-info{
      margin: 0 10px 0 5px;
    }
    .template-title-edit{
      color: #f05107;
      margin: 0 6px;
      font-size: 10px;
      cursor: pointer;
    }
    .edit-img{
      width: 16px;
      height: 16px;
      margin-bottom: 3px;
      cursor: pointer;
    }
    .delete-icon{
      color: #000;
      margin: 0 6px;
      cursor: pointer;
    }
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
    .tab-title{
      font-family: HelveticaNeue;
      color: #3b4859;
      font-size: 1.16rem;
    }
    .template-button-wrapper{
      float: right;
      margin-right: 100px;
      margin-top:20px;
      .template-buttons{
        height: 18px;
        line-height: 18px;
        font-size: 9px;
        &.save{
          margin-right: 10px;
        }
      }
    }
  }
  .select-parent{
    color:rgba(0, 0, 0, 0.65);
    cursor: pointer;
    width: 157px;
    height: 32px;
    padding:0 5px;
    border-radius: 2px;
    border: 1px solid rgba(151, 151, 151, 0.502732);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select-prefix-icon{
      transition: all .5s;
    }
    .rotate-icon{
      transform: rotate(180deg);
    }
  }
  .select-disabled{
    cursor:not-allowed;
    background-color: #f5f5f5;
    color:rgba(0, 0, 0, 0.25);
  }
  .error-style{
    border:1px solid red;
  }
  .error-info{
    color: red;
    font-size: 12px;
    font-family: HelveticaNeue;
    border-radius: 2px;
  }
  .input-wrapper{
      margin-right: 33px;
    }
    .company-select{
      position: relative;
      .select-value{
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .select-arr{
      position: absolute;
      border: 0.5px solid #D6D6D6;
      border-radius: 5px;
      width:157px;
      height:149px;
      overflow: auto;
      background: #FFFFFF;
      z-index: 5;
      .select-children{
        padding-left: 10px;
        &:hover{
          background: rgb(233, 230, 230);
        }
        .select-lebal{
          font-size: 10px;
        }
        .select-item{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 19px;
          font-size: 8px;
        }
      }
    }
    .tab-style{
      height: 550px;
      overflow: auto;
    }
</style>
