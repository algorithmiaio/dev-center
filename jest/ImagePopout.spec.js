import { mount } from '@vue/test-utils'
import ImagePopout from '@/components/ImagePopout'

describe('ImagePopout', () => {
  test('should fill slot in container and modal with image provided', () => {
    const wrapper = mount(ImagePopout, {
      slots: {
        default: `<img>`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should display caption if provided', () => {
    const wrapper = mount(ImagePopout, {
      propsData: {
        caption: "Image Caption"
      },
      slots: {
        default: `<img>`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should open modal when image is clicked', () => {
    const wrapper = mount(ImagePopout, {
      slots: {
        default: `<img>`
      }
    })

    wrapper.find('.syn-image-shadowed').trigger('click')

    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should close modal when modal image is clicked', () => {
    const wrapper = mount(ImagePopout, {
      slots: {
        default: `<img>`
      }
    })

    wrapper.find('.syn-image-shadowed').trigger('click')
    wrapper.find('.syn-modal-card div').trigger('click')

    expect(wrapper.html()).toMatchSnapshot()
  })
})
