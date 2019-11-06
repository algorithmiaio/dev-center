import { mount } from '@vue/test-utils'
import CodeSample from '../src/components/CodeSample'

describe('CodeSample', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(CodeSample)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
