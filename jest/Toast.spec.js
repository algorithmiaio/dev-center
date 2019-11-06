import { mount } from '@vue/test-utils'
import Toast from '@/components/Toast'

describe('Toast', () => {
  test('should default to hidden', () => {
    const wrapper = mount(Toast)
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should show toast if show event is emitted from root', () => {
    const wrapper = mount(Toast)
    wrapper.vm.$root.$emit('show-toast')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should hide toast if hide event is emitted from root', () => {
    const wrapper = mount(Toast)
    wrapper.vm.$root.$emit('show-toast')
    wrapper.vm.$root.$emit('hide-toast')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should hide toast if close button is clicked', () => {
    const wrapper = mount(Toast)
    wrapper.vm.$root.$emit('show-toast')
    wrapper.find('.syn-btn').trigger('click')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should show message provided in show-toast event', () => {
    const wrapper = mount(Toast)
    wrapper.vm.$root.$emit('show-toast', 'Hello, world!')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
