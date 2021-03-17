import { mount } from '@vue/test-utils';
import NewTemplate from '@/views/HRIssue/Template/NewTemplate.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import Antd from 'ant-design-vue';
import _ from 'lodash';

test('NewTemplate.vue test', async() => {
  jest.useFakeTimers();
  jest.mock('lodash', () => ({
    debounce: jest.fn((fn => fn))
  }));
  const mockRoute = {
    params: {
        templateId:'test',
        company: '999',
        job_title: '888',
        manager: '888'
    },
    query:{
        templateId:'test',
        company: 'ggg',
        job_title: 'fff',
        manager: 'ttt'
    },
    href: '/hrissue/template/list'
  };

  const mockRouter = {
    push: jest.fn(),
    go:jest.fn()
  };

  
  const mock = new MockAdapter(axios);
  let data = {
    access:['1','2','3'],
    sop:['4','5','6'],
    phase:'sop'
  }

  mock.onPost('/api/get-template-info').reply(200, data);
  mock.onPost('/api/check-duplicate').reply(200, true);
  mock.onGet('/api/get-sop-list').reply(200, data);
  mock.onGet('/api/get-access-list').reply(200, data);
  mock.onPost('/api/create-template').reply(200, true);
  mock.onPost('/api/update-template').reply(200, true);
  let wrapper = mount(NewTemplate, {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      },
      plugins:[Antd],
    },
    // data(){
    //     return{
    //         templateId:'777'
    //     }
    // }
  });
  const vm = wrapper.vm as any;

  await flushPromises();
  expect(vm.showManagerPrompt).toBe(false);

  await wrapper.setData({
    form:{
      manager: 'jest', company: 'teste', templateName: '9999',
    }
  })
  await vm.changeManagerShow('jest');
  expect(vm.showManagerPrompt).toBe(true);
  
  await vm.closeMamagerPrompt()
  expect(vm.showManagerPrompt).toBe(false);
  const mockFn2 = jest.fn();
  vm.watchForm = mockFn2;
  vm.watchForm({manager:'123', templateName:'456'});
  expect(mockFn2).toHaveBeenCalledTimes(1);


  await vm.allowEditChange(false);
  expect(vm.form).toHaveProperty('company','ggg')

  await vm.chooseManager('123')
  expect(vm.form).toHaveProperty('manager','123')

  await vm.goBack()
  expect(mockRouter.go).toHaveBeenCalledTimes(1)

  const beforeEdit = vm.allowEdit
  await vm.enterEdit()
  expect(vm.allowEdit).toBe(!beforeEdit)

  wrapper.setData({
    allowEdit: true
  })
  vm.openSelect();
  expect(vm.showSelect).toBe(true)
  wrapper.setData({
    allowEdit: false
  })
  vm.openSelect();


  vm.closeSelect();
  expect(vm.showSelect).toBe(false)

  vm.chooseSelect({title:'123', value:'456'})
  expect(vm.form.company).toBe('456')

  vm.createMethod()
  await flushPromises()
  expect(mockRouter.go).toHaveBeenCalled()

  vm.updataTemplateData()
  const mockRoute2 = {
    params: {
      type:'create'
    },
    query:{
      templateId:'test',
      company: 'ggg',
      job_title: 'fff',
      manager: 'ttt'
    },
  }
  wrapper = mount(NewTemplate, {
    global: {
      mocks: {
        $route: mockRoute2,
        $router: mockRouter
      },
      plugins:[Antd],
    },
    // data(){
    //     return{
    //         templateId:'777'
    //     }
    // }
  });
  vm.checkDataLegal({templateName: '123', company: '456', manager: '789', accessValue: ['10', '20'], sopValue: ['30', '40'], checkRepeat: false})
  vm.checkDataLegal({templateName: '123', company: '456', manager: '789', accessValue: ['10', '20'], sopValue: ['30', '40'], checkRepeat: true})
  wrapper.get('[data-test="change-pane"]').trigger('click')
//   vm.getTemplateData({jobTitle:'123', manager:'456', company: '789'})
//   await flushPromises();
//   expect(vm.tableDatas).toContainEqual({job_title:'test1',
//   company:'test1',
//   manager:'test1',
//   creator:'test1',
//   created_time:'19993-2-1 23:00:00',})

//   for(let i = 0; i < 11; i++){
//     data = data.concat(data)
//   }
//   mock.onPost('/api/search-template').reply(200, data);
//   vm.getTemplateData({jobTitle:'123', manager:'456', company: '789'})
//   await flushPromises();
//   expect(vm.filterTableData.length).toBe(20)

//   // test router
//   vm.openTemplate('123', {id: '777', company: 'test', job_title: 'apple', manager: 'li'})
//   expect(mockRouter.push).toHaveBeenCalledTimes(1);
//   wrapper.setData({
//     searchInput:'123'
//   })
//   vm.jumpToDetail()
//   expect(mockRouter.push).toHaveBeenCalledWith({ path: '/hrissue/template/detail/create', query: { templateName: '123' }})
//   vm.searchList()
//   await vm.showConfirm()
//   await flushPromises();

});


