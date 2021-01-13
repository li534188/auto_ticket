import { shallowMount } from '@vue/test-utils';
import User from '@/views/User.vue';

test('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(User, {
      props: { msg }
    });
    console.log('+++++++++');
    console.log(wrapper);
  });
});
