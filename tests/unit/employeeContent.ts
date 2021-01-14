import { mount, } from '@vue/test-utils';
import  EmployeeContent from '@/views/HRIssue/Employee/EmployeeContent.vue';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import flushPromises from 'flush-promises';
import { HRIssueModule } from '@/store/modules/hrissue';
import Antd from 'ant-design-vue';

test('EmployeeContent.vue test', async() => {
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
  console.log(wrapper.vm.employeeInfo);
  expect(wrapper.text()).toContain('jest');
});