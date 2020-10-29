import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export enum DeviceType {
  Mobile,
  Desktop,
}



export interface LoadState {
  isloading: boolean;
}



@Module({ dynamic: true, store, name: 'load' })
class Loading extends VuexModule implements LoadState {
  public isloading = false;

  @Mutation
  CHANGE_STATUS(data: boolean) {
    this.isloading = data;
  }

  @Action
  asyncChangeStatus(value: boolean) {
    this.CHANGE_STATUS(value);
  }
}

export const LoadingModule = getModule(Loading);
