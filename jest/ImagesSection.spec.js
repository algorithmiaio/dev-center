import { mount } from '@vue/test-utils'
import ImagesSection from '@/components/ImagesSection'

describe('ImagesSection', () => {
  test('should fill slot with content provided', () => {
    const wrapper = mount(ImagesSection, {
      slots: {
        default: `<div class="image-popout-stub"></div>`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
