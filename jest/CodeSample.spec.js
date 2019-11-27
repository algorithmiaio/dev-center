import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import CodeSample from '@/components/CodeSample'
import nock from 'nock'

describe('CodeSample', () => {
  const state = {}
  const getters = {
    preferredLanguage: () => ''
  }
  const actions = {
    setPreferredLanguage: () => {}
  }
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store({ state, getters, actions })


  test('should render default slot content if no custom content provided', () => {
    const wrapper = mount(CodeSample, {
      localVue,
      store,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should render provided content in slot', () => {
    const wrapper = mount(CodeSample, {
      localVue,
      store,
      slots: {
        default: `<figure class="highlight"><pre><code data-lang="bash" class="language-bash">POST https://api.algorithmia.com/v1/algo/:owner/:algoname</code></pre></figure>`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should show language dropdown and hide additional figures if multiple provided', () => {
    const wrapper = mount(CodeSample, {
      localVue,
      store,
      slots: {
        default: `<figure class="highlight python"><pre><code data-lang="python" class="language-python"><span class="kn">import</span> <span class="nn">Algorithmia</span></code></pre></figure>

        <figure class="highlight"><pre><code data-lang="javascript" class="language-javascript"><span class="kd">var</span> <span class="nx">input</span> <span class="o">=</span> <span class="s2">"YOUR_USERNAME"</span><span class="p">;</span></code></pre></figure>`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should change code sample to selected language if changed', () => {
    const wrapper = mount(CodeSample, {
      localVue,
      store,
      slots: {
        default: `<figure class="highlight python"><pre><code data-lang="python" class="language-python"><span class="kn">import</span> <span class="nn">Algorithmia</span></code></pre></figure>

        <figure class="highlight"><pre><code data-lang="javascript" class="language-javascript"><span class="kd">var</span> <span class="nx">input</span> <span class="o">=</span> <span class="s2">"YOUR_USERNAME"</span><span class="p">;</span></code></pre></figure>`
      }
    })
    wrapper.find('select').setValue('javascript')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should use code-sample-language instead of data-lang if provided', () => {
    const wrapper = mount(CodeSample, {
      localVue,
      store,
      slots: {
        default: `<figure class="highlight python"><pre><code data-lang="python" class="language-python"><span class="kn">import</span> <span class="nn">Algorithmia</span></code></pre></figure>

        <div code-sample-language="JavaScript"><figure class="highlight"><pre><code data-lang="javascript" class="language-javascript"><span class="kd">var</span> <span class="nx">input</span> <span class="o">=</span> <span class="s2">"YOUR_USERNAME"</span><span class="p">;</span></code></pre></figure></div>`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
