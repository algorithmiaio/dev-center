import { mount } from '@vue/test-utils'
import ImagePopout from '@/components/ImagePopout'

describe('ImagePopout', () => {
  test('should fill slot in container and modal with image provided', () => {
    const wrapper = mount(ImagePopout, {
      slots: {
        default: `<img src="/test/image.jpg">`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
