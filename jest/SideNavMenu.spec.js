import { mount } from '@vue/test-utils'
import SideNavMenu from '@/components/SideNavMenu'

describe('SideNavMenu', () => {
  test('should find open list item and store in data', () => {
    const wrapper = mount(SideNavMenu, {
      slots: {
        default: `<ul>
  <li class="cloak-closed-nav-item" id="devcenter-list-item"></li>
  <li class="cloak-open-nav-item" id="api-list-item"></li>
  <li class="cloak-closed-nav-item" id="home-list-item"></li>
</ul>`
      }
    })
    expect(wrapper.vm.$data.openSection).toEqual('api')
  })

  test('should update active section when toggle method called by slot', () => {
    const wrapper = mount(SideNavMenu, {
      scopedSlots: {
        default: `<ul slot-scope="{ toggle }">
  <li @click="toggle('devcenter')" class="cloak-closed-nav-item" id="devcenter-list-item"></li>
  <li @click="toggle('api')" class="cloak-open-nav-item" id="api-list-item"></li>
  <li class="cloak-closed-nav-item" id="home-list-item"></li>
</ul>`
      }
    })
    wrapper.find('#devcenter-list-item').trigger('click')
    expect(wrapper.vm.$data.openSection).toEqual('devcenter')
  })

  test('should pass open section as a slot prop', () => {
    const wrapper = mount(SideNavMenu, {
      scopedSlots: {
        default: `<ul slot-scope="{ openSection }">
  <li class="cloak-closed-nav-item" id="devcenter-list-item" :class="{'open-nav-item': openSection === 'devcenter'}"></li>
  <li class="cloak-open-nav-item" id="api-list-item" :class="{'open-nav-item': openSection === 'api'}"></li>
  <li class="cloak-closed-nav-item" id="home-list-item"></li>
</ul>`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
