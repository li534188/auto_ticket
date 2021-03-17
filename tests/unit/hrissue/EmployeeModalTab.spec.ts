import { mount } from '@vue/test-utils';
import  EmployeeModalTab from '@/views/HRIssue/Employee/EmployeeModalTab.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import Antd from 'ant-design-vue';


test('user.vue login', async() => {

  const mock = new MockAdapter(axios);
  const data = { 
    Access: ['1', '2', '3'],
    SOP: ['7', '8']
  };
  mock.onPost('/api/get-ticket-info').reply(200, data);
  mock.onPost('/api/list-extra').reply(200, data);
  const wrapper = mount(EmployeeModalTab, {
    data(){
        return {
            selectIds:['1', '2']
        }
    },
    props: {
        modalData: [{
            summary: 'test1',
            phase: 'test2',
        },{
            summary: 'test3',
            phase: 'test4',
        }],
        selectData: [{
            summary: 'tests',
            phase: 'teste',
        },{
            summary: 'testp',
            phase: 'testu',
        },{
            summary: 'testm',
            phase: 'testn',
        },],
        type: 'Access',
        showLoading: false,
        selectChangeMethod: jest.fn(),
    },
    global:{
      plugins:[Antd]
    }
  });

  await wrapper.setProps({
    modalData: [{
        summary: 'test1',
        phase: 'test2',
    },{
        summary: 'testp',
        phase: 'test4',
    },{
        summary: 'tests',
        phase: 'test6',
    }],
  });

//   const vm = wrapper.vm as any;
//   await vm.confirm();
  expect(wrapper.vm.tableData).toContainEqual({summary: 'test1',phase: 'test2'});
  
  wrapper.get("[data-test='icon-add']").trigger('click');
  expect(wrapper.vm.tableData).toContainEqual({
    summary: '',
    usercode: '',
    RealTask: '',
    specialStatus: 'create',
  });
  await wrapper.setData({
    showManagerPrompt: true,
    filterText:'t'
  })

  const vm = wrapper.vm as any;
  vm.handleChange('tests', 3)
  expect(wrapper.vm.tableData[3]).toHaveProperty('specialStatus', 'modify');


  wrapper.setProps({
    type:'SOP'
  })
  expect(wrapper.vm.colum).toContainEqual(
    {
        title: 'Ticket Summary',
        dataIndex: 'summary',
        width: '190px',
        showText: true,
        showSort: false,
      }
  )
  vm.changeManagerShow(3)
  expect(wrapper.vm.activeIndex).toBe(3);

  vm.closeMamagerPrompt()
  expect(wrapper.vm.showManagerPrompt).toBe(false);

  vm.getText(['1', '2', '3']);
  vm.filterSelectData;
//   await wrapper.setData({
//     sonData:{

//         SOP:['1', '2'],
//         Access:['1', '2', '3'],
//         popStatus: true
//     }
//   })

//   await vm.changeSelectIds(['1', '2', '3'], 'SOP')
//   expect(wrapper.vm.SOPSelectIds).toContain('1');
//   await vm.changeSelectIds(['1', '2', '3'], 'Access')
//   expect(wrapper.vm.AccessSelectIds).toContain('3');

//   vm.confirmCheck('no')
//   expect(wrapper.vm.popStatus).toBe(false);

//   wrapper.setProps({
//     show: true
//   })

//   await flushPromises();
//   expect(wrapper.vm.sonData).toHaveProperty('SOP',['7', '8']);

  
});


