import { mount, } from '@vue/test-utils';
import  EmployeeContent from '@/views/HRIssue/Employee/EmployeeContent.vue';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import flushPromises from 'flush-promises';
import { HRIssueModule } from '@/store/modules/hrissue';
import Antd from 'ant-design-vue';


test('EmployeeContent.vue test text', async() => {
  await HRIssueModule.asyncGetEmployeeInfo({
    name: 'jest',
    Department: 'fbi',
    employee_name: 'test',
    preferred_name: 'test',
    job_title: 'test',
    company: 'test',
    location: 'test',
    department: 'test',
    start_date: 'test',
    manager: 'test',
    issue_number: 'test',
    preferred_full_name: 'test',
    template_exist: false,
  });
  const wrapper =  mount(EmployeeContent, {
    global: {
      plugins: [Antd]
    }
  });
  expect(wrapper.text()).toContain('jest');
});


test('EmployeeContent.vue test router and test auto create', async()=>{

  const mockRoute = {
    params: {
      id: 1
    },
    href: '/hrissue/template/list'
  };

  const mockRouter = {
    push: jest.fn()
  };

  const wrapper =  mount(EmployeeContent, {
    global: {
      plugins: [Antd],
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    },
    data(){
      return {
        hasTemplate:false,
        ticketCreate:false,
        showLoading:false,
      }
    } 
  });

  await wrapper.setData({
    hasTemplate:false,
    ticketCreate:false,
    showLoading:false,
    accessData: [{title:'123', item:'456'}],
    sopData: [{title:'123', item:'456'}],
  })

  // wrapper.get('[data-test="jumpButton"]').trigger('click')
  const vm =  wrapper.vm as any
  await vm.jumpToTemplate()
  expect(mockRouter.push).toHaveBeenCalledWith({"path": "/hrissue/template/detail/create", "query": {"company": "test", "manager": "test", "templateName": "test"}});
})


test('EmployeeContent.vue test router and test auto create', async()=>{

  const mockRoute = {
    params: {
      id: 1
    },
    href: '/hrissue/template/list'
  };

  const mockRouter = {
    push: jest.fn()
  };

  const wrapper =  mount(EmployeeContent, {
    global: {
      plugins: [Antd],
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    },
    data(){
      return {
        ticketCreate:false,
        showLoading:false,
        hasTemplate:true,
        percentage:0,
      }
    } 
  });

  await wrapper.setData({
    ticketCreate:false,
    showLoading:false,
    hasTemplate:true,
  })

  wrapper.get('[data-test="create-button"]').trigger('click')

  expect(wrapper.vm.showModal).toBe(true)
  
})


test('EmployeeContent.vue test interval', async() => {
  jest.useFakeTimers();
  const mock = new MockAdapter(axios);
  let data:any = 100;
  mock.onPost('/api/get-percent').reply(200, data);
  data = {
    Sop:[{title:'123', item:'456', status:'789'}],
    Access:[{title:'123', item:'456', status:'789'}],
  }
  mock.onPost('/api/get-completed-jira-ticket').reply(200, data);
  mock.onPost('/api/check-duplicate').reply(200, data);
  mock.onPost('/api/auto-create').reply(200, data);
  mock.onPost('/api/sync-template').reply(200, data);
  await HRIssueModule.asyncGetEmployeeInfo({
    name: 'jest',
    Department: 'fbi',
    employee_name: 'test',
    preferred_name: 'test',
    job_title: 'test',
    company: '',
    location: 'None',
    department: 'test',
    start_date: 'test',
    manager: 'test',
    issue_number: 'tests',
    preferred_full_name: 'test',
    template_exist: false,
  });


  const wrapper =  mount(EmployeeContent, {
    global: {
      plugins: [Antd],
    },
  });
  await flushPromises();
  expect(wrapper.vm.ticketCreate).toBe(true);
  const vm:any  =   wrapper.vm 
  wrapper.setData({
    ticketNumber:'test99'
  })
  vm.confirCallback({access:'123',sop:'123', footerCheck:true})
  mock.onPost('/api/get-percent').reply(200, 88);
  jest.advanceTimersByTime(3000);
  await flushPromises();
  
  expect(wrapper.vm.percentage).toBe(88);

  mock.onPost('/api/get-percent').reply(200, 100);
  jest.advanceTimersByTime(3000);
  await flushPromises();
  expect(wrapper.vm.percentage).toBe(100);
  
});





