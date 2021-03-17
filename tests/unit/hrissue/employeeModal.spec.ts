import { mount } from '@vue/test-utils';
import  EmployeeModal from '@/views/HRIssue/Employee/EmployeeModal.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import Antd from 'ant-design-vue';


test('employeemodal.vue test', async() => {

  const mock = new MockAdapter(axios);
  const data = { 
    Access: ['1', '2', '3'],
    SOP: ['7', '8']
  };
  mock.onPost('/api/get-ticket-info').reply(200, data);
  mock.onPost('/api/list-extra').reply(200, data);
  const wrapper = mount(EmployeeModal, {
    data() {
      return {
        form: {
          userName: 'tset',
          passWord: 'tset',
        },
        test: 789
      };
    },
    props: {
        show: false,
        hrInfo: {Company: 'test', 'Perfered Name': 'test', 'Job Title': 'test', Manager: 'teste'},
        changeShow: jest.fn(),
        confirCallback: jest.fn(),
    },
    global:{
      plugins:[Antd]
    }
  });

  wrapper.setData({
    form: {
      userName: '',
      passWord: 'tset',
    },
  });

  const vm = wrapper.vm as any;
  await vm.confirm();
  expect(wrapper.vm.changeShow).toHaveBeenCalled();
  await wrapper.setData({
    sonData:{
        SOP:['1', '2'],
        Access:['1', '2', '3'],
        popStatus: true
    }
  })

  await vm.changeSelectIds(['1', '2', '3'], 'SOP')
  expect(wrapper.vm.SOPSelectIds).toContain('1');
  await vm.changeSelectIds(['1', '2', '3'], 'Access')
  expect(wrapper.vm.AccessSelectIds).toContain('3');

  vm.confirmCheck('no')
  expect(wrapper.vm.popStatus).toBe(false);

  wrapper.setProps({
    show: true
  })

  await flushPromises();
  // expect(wrapper.vm.sonData).toHaveProperty('SOP',['7', '8']);

  
//   await wrapper.setData({
//     form: {
//       userName: 'test',
//       passWord: 'tset',
//     },
//   });

//   // test click
//   wrapper.find('.login-button').trigger('click');

//   await flushPromises();

//   expect(wrapper.text()).toContain('Wrong username or password');

//   // test key down
//   await wrapper.find('.wrapper').trigger('keydown.enter');

//   await flushPromises();

//   expect(wrapper.text()).toContain('Wrong username or password');

});


// 登陆成功路由跳转
// test('user.vue keyword', async() => {

//   const mockRoute = {
//     params: {
//       id: 1
//     }
//   };

//   const mockRouter = {
//     push: jest.fn()
//   };

//   const mock = new MockAdapter(axios);
//   const data = { mseeage: 'Success',
//     userName: '123' };
//   mock.onPost('/api/login').reply(200, data);
//   const wrapper = mount(User, {
//     data() {
//       return {
//         form: {
//           userName: 'tset',
//           passWord: 'tset',
//         },
//         test: 789
//       };
//     },
//     global: {
//       mocks: {
//         $route: mockRoute,
//         $router: mockRouter
//       }
//     }
//   });
//     // test key down
//   await wrapper.find('.wrapper').trigger('keydown.enter');

//   await flushPromises();
//   console.log(wrapper.vm.$router);
//   console.log(mockRouter.push);
//   expect(mockRouter.push).toHaveBeenCalledWith('/hrissue');
// });
