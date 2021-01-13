import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';


export interface UserState {
  userName: string;
}



@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements UserState {
  public userName = '';

  @Mutation
  CHANGE_USERNAME(data: string) {
    this.userName = data;
  }

  @Action
  asyncChangeUserName(dataInfo: string) {
    const storage = window.localStorage;
    storage.userName = dataInfo;
    this.CHANGE_USERNAME(dataInfo);
  }
}

export const UserModule = getModule(User);
