import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { post } from '@/utils/httpUtils';
import { LoadingModule } from './loading';
import store from '@/store';

export enum DeviceType {
  Mobile,
  Desktop,
}



export interface AppState {
  hrIssueList: EmployeeInfoType[];
  employeeInfo: EmployeeInfoType;
}

interface HrIssueListType {
  name: string;
  priority: string;
  time: string;
  issue_number: string;
}

interface EmployeeInfoType {
  employee_name: string;
  preferred_name: string;
  job_title: string;
  company: string;
  location: string;
  department: string;
  start_date: string;
  manager: string;
  issue_number: string;
  template_exist: boolean;
  [key: string]: any;
}

@Module({ dynamic: true, store, name: 'hrissue' })
export class HRIssue extends VuexModule implements AppState {
  public hrIssueList: EmployeeInfoType[] = [];
  public employeeInfo: EmployeeInfoType =
    {
      employee_name: '',
      preferred_name: '',
      job_title: '',
      company: '',
      location: '',
      department: '',
      start_date: '',
      manager: '',
      issue_number: '',
      template_exist: false,
    };

  @Mutation
  changeHrIssueList(data: EmployeeInfoType[]) {
    this.hrIssueList = data;
  }

  @Action
  async asyncGetIssueList() {
    const data: {userName: string; password: string} = { userName: 'jason.yang', password: 'j3Pp4&C0' };
    LoadingModule.asyncChangeStatus(true);
    post('/api/pending-issue', data).then(res => {
      LoadingModule.asyncChangeStatus(false);
      if (res) {
        this.changeHrIssueList(res);
      }
    });
  }

  @Mutation
  changeEmployeeInfo(data: EmployeeInfoType) {
    this.employeeInfo = data;
  }

  @Action
  asyncGetEmployeeInfo(info: EmployeeInfoType) {
    this.changeEmployeeInfo(info);
  }

  // @Mutation
  // changeSelectHRIssueNumber(hrIssueNumber: string) {
  //   this.selectHRIssueNumber = hrIssueNumber;
  // }

  // @Action
  // setSelectNumber(number: string) {
  //   this.changeSelectHRIssueNumber(number);
  // }

}

export const HRIssueModule = getModule(HRIssue);
