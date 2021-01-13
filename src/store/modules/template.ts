import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { get } from '@/utils/httpUtils';
// import { LoadingModule } from './loading';
import store from '@/store';

export enum DeviceType {
  Mobile,
  Desktop,
}



export interface AppState {
  managerList: string[];
  companyList: {title: string; context: string; value: string}[];
}



@Module({ dynamic: true, store, name: 'template' })
export class Template extends VuexModule implements AppState {


  public managerList: string[] = [];

  public companyList = [{
    title: 'DAI',
    context: 'Data Analysis, Inc.',
    value: 'DAI - Data Analysis, Inc.'
  }, {
    title: 'IBD',
    context: 'Investor\'s Business Daily',
    value: 'IBD - Investor\'s Business Daily'
  }, {
    title: 'OCM',
    context: 'O\'Neil Capital Management',
    value: 'OCM - O\'Neil Capital Management'
  }, {
    title: 'ODS',
    context: 'O\'Neil Digital Solutions',
    value: 'ODS - O\'Neil Digital Solutions'
  }, {
    title: 'OGA',
    context: 'O\'Neil Global Advisors',
    value: 'OGA - O\'Neil Global Advisors'
  }, {
    title: 'ONS',
    context: 'O\'Neil Securities',
    value: 'ONS - O\'Neil Securities'
  }, {
    title: 'ONV',
    context: 'O\'Neil Ventures',
    value: 'ONV - O\'Neil Ventures'
  }, {
    title: 'WJO Foundation',
    context: '',
    value: 'WJO Foundation'
  }, {
    title: 'WON',
    context: 'William O\'Neil + Co., Inc.',
    value: 'WON - William O\'Neil + Co., Inc.'
  }, {
    title: 'WONCN',
    context: 'William O\'Neil China PVT Limited',
    value: 'WONCN - William O\'Neil China PVT Limited'
  }, {
    title: 'WONSH',
    context: 'William O\'Neil (Shanghai) Limited',
    value: 'WONSH - William O\'Neil (Shanghai) Limited'
  }, {
    title: 'WONIMSH',
    context: 'William O\'Neil Investment Management (Shanghai) Limited',
    value: 'WONIMSH - William O\'Neil Investment Management (Shanghai) Limited'
  }, {
    title: 'WON India',
    context: '',
    value: 'WON India'
  }];



  @Mutation
  changeManagerList(data: string[]) {
    this.managerList = data;
  }

  @Action
  asyncGetManagerList() {
    get('/api/list-manager').then(res => {
      if (res) {
        this.changeManagerList(res);
      }
    });
  }

}

export const TemplateModule = getModule(Template);
