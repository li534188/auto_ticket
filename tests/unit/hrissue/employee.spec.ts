import { mount } from '@vue/test-utils';
import  EmplayeeHeader from '@/views/HRIssue/Employee/EmployeeHeader.vue';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import flushPromises from 'flush-promises';
import Antd from 'ant-design-vue';

test('hrIssue.vue enter router', async() => {
  const mock = new MockAdapter(axios);
  const data = [
    {
      issue_number: '6666',
      name: '123',
      start_date: '2019/03/03'
    },
    {
      issue_number: '8888',
      name: '123',
      start_date: '2019/03/03'
    }
  ];
  mock.onPost('/api/pending-issue').reply(200, data);

  const mockRoute = {
    params: {
      id: 1
    },
    href: '/hrissue/template/list'
  };

  const mockRouter = {
    push: jest.fn()
  };

  const wrapper = mount(EmplayeeHeader, {
    global: {
      plugins: [Antd],
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  });
  wrapper.get('[data-test="reloadButton"]').trigger('click');
  await flushPromises();
  console.log(wrapper.vm.hrIssueList);
  expect(wrapper.vm.hrIssueList[1]).toHaveProperty('issue_number', '8888');
  expect(wrapper.text()).toContain('2019/03/03');
  await wrapper.get('.list-item-meta').trigger('click');
  expect(wrapper.vm.activeKey).toBe('6666');
  
  const vm = wrapper.vm as any
  vm.closeTicket(5)
  wrapper.setData({
    thisStatus:[{
      issue_num:'6666',
      status:'in-progress'
    }]
  })
  vm.routeChange()
});

