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



  expect(wrapper.vm.activeKey).toBe('/hrissue/template/list');

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

  expect(wrapper.vm.activeKey).toBe('/hrissue/employee');

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

  await wrapper.get('[data-test="/hrissue/template/list"]').trigger('click');

  expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/template/list');

  await wrapper.get('[data-test="/hrissue/employee"]').trigger('click');

  expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/employee');

  // await wrapper.get('[data-test="1"]').trigger('click');

  // expect(mockRouter.push).toHaveBeenCalledWith('/hrissue/employee');

});
