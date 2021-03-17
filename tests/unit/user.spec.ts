import { mount } from '@vue/test-utils';
import User from '@/views/User.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
// import mockAxios from '../__mocks__/axios';


test('user.vue login', async() => {

  const mock = new MockAdapter(axios);
  const data = { message: 'false',
    userName: '123' };
  mock.onPost('/api/login').reply(200, data);
  const wrapper = mount(User, {
    data() {
      return {
          userName: 'tset',
          passWord: 'tset',
        test: 789
      };
    }
  });

  wrapper.setData({
      userName: '',
      passWord: 'tset',
  });

  await wrapper.find('.login-button').trigger('click');

  expect(wrapper.text()).toContain('username required');
  


  await wrapper.setData({
      userName: 'test',
      passWord: 'tset',
      test:'999'
  });

  // test click
  wrapper.find('.login-button').trigger('click');

  await flushPromises();

  expect(wrapper.text()).toContain('false');

  // test key down
  await wrapper.find('.login-wrapper').trigger('keydown.enter');

  await flushPromises();

  expect(wrapper.text()).toContain('false');

});


// 登陆成功路由跳转
test('user.vue keyword', async() => {

  const mockRoute = {
    params: {
      id: 1
    }
  };

  const mockRouter = {
    push: jest.fn()
  };

  const mock = new MockAdapter(axios);
  const data = { message: 'Success',
    userName: '123' };
  mock.onPost('/api/login').reply(200, data);
  const wrapper = mount(User, {
    data() {
      return {
          userName: 'tset',
          passWord: 'tset',
        test: 789
      };
    },
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  });
    // test key down
  await wrapper.find('.login-wrapper').trigger('keydown.enter');

  await flushPromises();
  console.log(wrapper.vm.$router);
  console.log(mockRouter.push);
  expect(mockRouter.push).toHaveBeenCalledWith('/hrissue');
});
