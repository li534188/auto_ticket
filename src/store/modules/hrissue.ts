import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export enum DeviceType {
  Mobile,
  Desktop,
}



export interface AppState {
  datas: DataType[];
}

interface DataType{
    title: string;
    value: string;
}

@Module({ dynamic: true, store, name: 'hrissue' })
export class HRIssue extends VuexModule implements AppState {
    public datas: DataType[] = [];

    @Mutation
    changeName(data: DataType[]) {
      this.datas = data;
    }

  @Action
    asyncChangeName() {
    // 用 setTimeout 异步模拟访问 api
      setTimeout(() => {
        this.changeName([{ title: 'name', value: '123' }]);
      }, 200);
    }
}

export const HRIssueModule = getModule(HRIssue);
