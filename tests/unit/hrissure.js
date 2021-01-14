import { mount } from '@vue/test-utils';
import  hrIssue from '@/views/HRIssue/index.vue';

test('hrIssue.vue enter router', async() => {

  const mockRoute = {
    params: {
      id: 1
    },
    href: '/hrissue/template/list'
  };

  const mockRouter = {
    push: jest.fn()
  };

  let wrapper = mount(hrIssue, {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  });



  expect(wrapper.vm.activeKey).toBe('2');

  wrapper = mount(hrIssue, {
    global: {
      mocks: {
        $route: {
          params: {
            id: 1
          },
          href: '/hrissue/employee'
        },
        $router: mockRouter
      }
    }
  });

  expect(wrapper.vm.activeKey).toBe('0');

});


test('hrIssue.vue change router', async() => {

  const mockRoute = {
    params: {
      id: 1
    },
    href: '/hrissue/template/list'
  };

  const mockRouter = {
    push: jest.fn()
  };

  const wrapper = mount(hrIssue, {
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  });

  await wrapper.get('[data-test="2"]').trigger('click');

  expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/template/list');

  await wrapper.get('[data-test="0"]').trigger('click');

  expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/employee');

  await wrapper.get('[data-test="1"]').trigger('click');

  expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/employee');

});
