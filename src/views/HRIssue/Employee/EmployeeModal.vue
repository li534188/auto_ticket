<template>
  <ModalAuto
    :show="show"
    :changeShow="changeShow"
    comfileText="Confirm"
    :confirmMethod="confirm"
    :showFooter="false"
  >
    <template v-slot:content>
      <section class="content-wrapper">
        <header class="modal-heraer">
          {{`You are about to create the following tickets (${hrInfo&&hrInfo['Job Title']}):`}}
        </header>
        <section>
          <!-- <a-tabs class="special-tab" v-model="activeKey">
            <a-tab-pane key="2">
              <template v-slot:tab>
                <span>
                  Access
                </span>
              </template>
              <EmployeeModalTab />
            </a-tab-pane>
            <a-tab-pane key="1">
              <template v-slot:tab>
                <span>
                  SOP
                </span>
              </template>
              <EmployeeModalTab />
            </a-tab-pane>
          </a-tabs> -->
          <div class="pop-table-wraper special-tab wrapper-parent">
            <EmployeeModalTab
              type="Access"
              :showLoading="showLoading"
              :modalData="sonData.Access"
              :selectChangeMethod="changeSelectIds"
              :selectData="selectData.Access"
            />
            <EmployeeModalTab
              type="SOP"
              :showLoading="showLoading"
              :modalData="sonData.SOP"
              :selectChangeMethod="changeSelectIds"
              :selectData="selectData.SOP"
            />
            <div v-if="popStatus" class="pop-mask">
              <div  class="wrapper-son">
                <ExclamationCircleFilled class="title-icon" fill="FA6400"/>
                <span class="first-title">Are you sure?</span>
                <div class="second-title">
                  <div>You are going to sync all the changes</div>
                  <div>{{`to the template  "${hrInfo&&hrInfo['Job Title']}"`}}</div>
                </div>
                <div class="button-wrapper">
                  <a-button @click="confirmCheck('no')" class="button-cancal">
                    <span>No</span>
                    <img class="img-style" src="@/assets/img/no_face.png">
                  </a-button>
                  <a-button @click="confirmCheck('yes')" class="button-confirm">
                    <span>Yes</span>
                    <img class="img-style" src="@/assets/img/yes_hand.png">
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </template>
    <template v-slot:footer>
      <div class="footer-wrapper">
        <div v-if="showFooterCheked">
          <a-checkbox class="special-tab footer-checkbox special-box"  v-model:checked="footerCheked">{{`Also sync the changes to the template "${hrInfo&&hrInfo['Job Title']}"`}}</a-checkbox>
        </div>
        <a-button @click="confirm" class="special-button">Start Auto-Create</a-button>
      </div>
    </template>
  </ModalAuto>
</template>
<script lang="ts">
export interface ModalDataObj{
  summary: string;
  usercode?: string;
  phase?: string;
  RealTask?: string;
  specialStatus?: string;
}
import { Options, Vue, } from 'vue-class-component';
import { RedoOutlined, CheckCircleOutlined, LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';
// import { Watch } from 'vue-property-decorator';
import EmployeeModalTab, { ModalType } from './EmployeeModalTab.vue';
// import { HRIssueModule } from '@/store/modules/hrissue';
import { getTicketInfo, getListExtra, } from '@/utils/server';
import ModalAuto from '@/components/ModalAuto.vue';
import { Prop, Watch } from 'vue-property-decorator';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    EmployeeModalTab,
    ModalAuto,
    ExclamationCircleFilled
  },
})
export default class EmployeeModal extends Vue {
    @Prop({ require: true }) private show!: boolean;
    @Prop({ require: true }) private changeShow!: {(even: boolean): void};
    @Prop({ require: true }) private hrInfo!: {Company: string; 'Perfered Name': string; 'Job Title': string; Manager: string};
    @Prop({ require: true }) private confirCallback!: {(param: {access: string[]; sop: string[]; footerCheck: boolean}): void};
    private activeKey = '1';
    private SOPSelectIds: string[] = [];
    private AccessSelectIds: string[]  = [];
    private showLoading = false;
    private sonData: {SOP: ModalDataObj[];Access: ModalDataObj[]} = { SOP: [], Access: []};
    private selectData: {SOP: ModalDataObj[];Access: ModalDataObj[]} = { SOP: [], Access: []};
    private footerCheked = false;
    private showFooterCheked = false;
    private ticketText = ''
    private popStatus = false;

    private confirm() {
      this.sonData={ SOP: [], Access: []};
      const { AccessSelectIds, SOPSelectIds, footerCheked } = this;
      this.confirCallback({ access: AccessSelectIds, sop: SOPSelectIds, footerCheck: footerCheked });
      this.changeShow(false);
    }

    private changeSelectIds(value: string[], type: ModalType) {
      if (type===ModalType.SOP) {
        this.SOPSelectIds = value;
      } else {
        this.AccessSelectIds = value;
      }
      let flag = true;
      if (value.length !== this.sonData[type].length) {
        flag = false;
      }
      if (flag) {
        try {
          value.forEach((item: string) => {
            flag = this.sonData[type].some((element: ModalDataObj) => {
              return item === element.RealTask;
            });
            if (!flag) {
              throw new Error('ending');
            }
          });
        } catch (e) {
          console.log(e);
        }
      }

      this.showFooterCheked = !flag;
      if (flag) {
        this.footerCheked = false;
      }
    }

    private confirmCheck(type: string) {
      if (type === 'no') {
        this.footerCheked = false;
      }
      this.popStatus = false;
    }

    @Watch('show')
    private showPop(val: boolean) {
      if (val) {
        if (this.hrInfo['Job Title']&&this.hrInfo['Perfered Name']) {
          this.showLoading = true;
          getTicketInfo({ company: this.hrInfo.Company, preferredName: this.hrInfo['Perfered Name'], jobTitle: this.hrInfo['Job Title'], manager: this.hrInfo.Manager }).then(res => {
            this.showLoading = false;
            if (res) {
              this.sonData = res;
            }

          });
          getListExtra({ preferredName: this.hrInfo['Perfered Name'], company: this.hrInfo.Company }).then(res => {
            if (res) {
              this.selectData = res;
            }
          });
        }
      }
    }

    @Watch('footerCheked')
    private footerChekedChange(val: boolean) {
      if (val) {
        this.popStatus = true;
      }
    }
}
</script>
<style lang="scss">
    .modal-heraer{
        font-size: 15px;
        font-weight: 700;
        padding: 10px 0;
    }
    .pop-table-wraper{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
    .special-tab{
        .ant-checkbox:hover,.ant-checkbox-input:hover, .ant-checkbox-inner:hover{
            border-color: #fa6400 !important;
        }
        .ant-checkbox-checked .ant-checkbox-inner{
            background-color: unset;
            border-color: #fa6400;
            &::after{
              border-color: #fa6400;
            }
        }
    }
    .footer-wrapper{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .footer-checkbox{
        font-size: 11px;
      }
      .special-button{
        font-size: 11px;
        padding: 0 90px;
        background-color: #FA6400;
        color: #fff;
        border: 1px solid #fa6400!important;
        border-radius: 4px;
        height: 25px;
        line-height: 25px;
      }
    }

    .wrapper-parent{
      position: relative;
      .pop-mask{
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
      }
      .wrapper-son{
        position: absolute;
        width: 247px;
        height: 187px;
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 10px 0;
        left: 35%;
        top: 10%;
        .title-icon{
          font-size: 40px;
          color: #FA6400;
        }
        .first-title{
          color: #000000;
          font-size: 18px;
          line-height: 21px;
        }
        .second-title{
          font-size: 11px;
          line-height: 13px;
          color: #717070;
          text-align: center;
        }
        .button-wrapper{
          display: flex;
          width:100%;
          justify-content: center;
          .img-style{
            width: 15px;
            margin-left: 5px;
          }
          .button-confirm{
              background: #FA6400;
              margin-left: 10px;
            }
          button{
            width: 85px;
            height: 19px;
            line-height: 19px;
            border-radius: 12.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover{
              color: unset;
              span{
                color: unset;
              }
            }
          }
        }
      }
    }
</style>