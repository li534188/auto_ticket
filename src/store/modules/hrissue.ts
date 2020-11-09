import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
// import { get } from '@/utils/httpUtils'
import store from '@/store';

export enum DeviceType {
  Mobile,
  Desktop,
}



export interface AppState {
  hrIssueList: HrIssueListType[];
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
  [key: string]: any;
}

@Module({ dynamic: true, store, name: 'hrissue' })
export class HRIssue extends VuexModule implements AppState {
  public hrIssueList: HrIssueListType[] = [];
  public employeeInfo: EmployeeInfoType =
    {
      employee_name: '',
      preferred_name: '',
      job_title: '',
      company: '',
      location: '',
      department: '',
      start_date: '',
      manager: ''
    };

  @Mutation
  changeHrIssueList(data: HrIssueListType[]) {
    this.hrIssueList = data;
  }

  @Action
  asyncGetIssueList() {
    // 用 setTimeout 异步模拟访问 api
    setTimeout(() => {
      this.changeHrIssueList([{ name: 'EmployeeA', priority: 'false', time: '11/03/2020', issue_number: 'HR-112' }, { name: 'EmployeeB', priority: 'true', time: '11/03/2020', issue_number: 'HR-113' }]);
    }, 200);
    // get('/api/issue').then((data)=>{
    //   this.changeHrIssueList(data)
    // })
  }

  @Mutation
  changeEmployeeInfo(data: EmployeeInfoType) {
    this.employeeInfo = data;
  }

  @Action
  asyncGetEmployeeInfo() {
    this.changeEmployeeInfo({
      employee_name: 'Claire Sun',
      preferred_name: 'Claire Sun',
      job_title: 'Business Analyst',
      company: 'WONCN - William O’Neil China PVT Limited',
      location: 'Shanghai, China',
      department: 'Software Engineering',
      start_date: '2020.05.13',
      manager: 'Vincent Wen'
    });
    // get('/api//employee-info').then((data)=>{
    //   this.changeEmployeeInfo(data)
    // })
  }
}

export const HRIssueModule = getModule(HRIssue);
