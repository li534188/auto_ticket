import { mount } from '@vue/test-utils';
import List from '@/views/HRIssue/Template/List.vue';
import { TemplateModule } from '@/store/modules/template';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import Antd from 'ant-design-vue';
import { Modal } from 'ant-design-vue';

test('hrIssue.vue enter router', async() => {
  jest.useFakeTimers();
  TemplateModule.changeManagerList(['test1', 'test2', 'test3']);

  const mockRoute = {
    params: {
      id: 1
    },
    href: '/hrissue/template/list'
  };

  const mockRouter = {
    push: jest.fn()
  };

  const wrapper = mount(List, {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      },
      plugins:[Antd, Modal],
      components:{
        Modal
      }
    }
  });
  const vm = wrapper.vm as any;

  const mock = new MockAdapter(axios);
  let data = [{
    job_title:'test1',
    company:'test1',
    manager:'test1',
    creator:'test1',
    created_time:'19993-2-1 23:00:00',
  },{
    job_title:'test2',
    company:'test2',
    manager:'test2',
    creator:'test2',
    created_time:'19993-2-1 23:00:00',
  }];

  mock.onPost('/api/search-template').reply(200, data);

  vm.getTemplateData({jobTitle:'123', manager:'456', company: '789'})
  await flushPromises();
  expect(vm.tableDatas).toContainEqual({job_title:'test1',
  company:'test1',
  manager:'test1',
  creator:'test1',
  created_time:'19993-2-1 23:00:00',})

  for(let i = 0; i < 11; i++){
    data = data.concat(data)
  }
  mock.onPost('/api/search-template').reply(200, data);
  vm.getTemplateData({jobTitle:'123', manager:'456', company: '789'})
  await flushPromises();
  expect(vm.filterTableData.length).toBe(20)

  // test router
  vm.openTemplate('123', {id: '777', company: 'test', job_title: 'apple', manager: 'li'})
  expect(mockRouter.push).toHaveBeenCalledTimes(1);
  wrapper.setData({
    searchInput:'123'
  })
  vm.jumpToDetail()
  expect(mockRouter.push).toHaveBeenCalledWith({ path: '/hrissue/template/detail/create', query: { templateName: '123' }})
  vm.searchList()
  await vm.showConfirm()
  await flushPromises();
  // expect(wrapper.vm.getTemplateData).toHaveBeenCalledTimes(1)
  //   expect(wrapper.vm.activeKey).toBe('2');

  //   wrapper = mount(hrIssue, {
  //     global: {
  //       mocks: {
  //         $route: {
  //           params: {
  //             id: 1
  //           },
  //           href: '/hrissue/employee'
  //         },
  //         $router: mockRouter
  //       }
  //     }
  //   });

  //   expect(wrapper.vm.activeKey).toBe('0');

});


// test('hrIssue.vue change router', async() => {

//   const mockRoute = {
//     params: {
//       id: 1
//     },
//     href: '/hrissue/template/list'
//   };

//   const mockRouter = {
//     push: jest.fn()
//   };

//   const wrapper = mount(hrIssue, {
//     global: {
//       mocks: {
//         $route: mockRoute,
//         $router: mockRouter
//       }
//     }
//   });

//   await wrapper.get('[data-test="2"]').trigger('click');

//   expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/template/list');

//   await wrapper.get('[data-test="0"]').trigger('click');

//   expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/employee');

//   await wrapper.get('[data-test="1"]').trigger('click');

//   expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/employee');

// });
