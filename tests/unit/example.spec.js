import { mount } from '@vue/test-utils';
import User from '@/views/User.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
// import mockAxios from '../__mocks__/axios';


test('HelloWorld.vue', async() => {

  beforeEach(() => {
    const mock = new MockAdapter(axios);
    const data = { mseeage: 'false',
      userName: '123' };
    mock.onPost('/api/login').reply(200, data);
  });
  const msg = 'new message';
  const wrapper = mount(User, {
    props: { msg },
    data() {
      return {
        form: {
          userName: 'tset',
          passWord: 'tset',
        }
      };
    }
  });



  await wrapper.find('.login-button').trigger('click');


  // mockAxios.post.mockImplementationOnce(() => {
  //   return Promise.resolve({
  //     mseeage: 'false',
  //     userName: '123'
  //   });
  // });

  // Wait until the DOM updates.
  await flushPromises();
  expect(wrapper.text()).toContain('Wrong username or password');
});
