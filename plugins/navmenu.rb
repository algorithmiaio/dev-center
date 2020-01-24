module Jekyll
  class NavMenuTag < Liquid::Tag

    def initialize(tag_name, markup, options)
      super
    end

    def render(context)
      contents = super
      current_url = context['page']['url']
      @baseurl = context['site']['baseurl']
      is_enterprise_documention = context['site']['enterprise']

      # For each nav item in toc.yaml
      @@items ||= context['site']['data']['toc'].select{
        |item| !(item["enterprise_only"] == true && !is_enterprise_documention)
      }.map do |item|

        # Get a map of pages grouped by category
        pages ||= context['site']['pages'].select{|p| p.data['categories'].count > 0 }.group_by{ |p| p.data['categories'].first }

        # Lookup extra metadata by page URL
        page = context['site']['pages'].find{ |p| p.url == item['url'] }
        if page
            item['nav_overview'] = page.data['nav_overview']
        end

        item['children'] = []
        item_cat = item['nav_category']
        if item['nav_overview']
          item['children'].push({ 'url' => item['url'], 'title' => item['nav_overview'], 'children' => [] })
        end
        unless item_cat.nil?
          item['children'].concat pages[item_cat].map{|p| doc_to_item(pages, p) }
        end
        item
      end

      render_list(current_url, @@items)

    end

    def render_list(page_url, items)
      html = []
      html << '<ul class="nav sidebar">'
      items.each do |item|
        prefix = item['url'].chomp('/')

        is_category = item['children'] && item['children'].count > 0
        is_active = is_ancestor(page_url.chomp('/'), prefix, is_category)

        if is_active && is_category
          html << '<li class="active category">'
        elsif is_active
          html << '<li class="active">'
        elsif is_category
          html << '<li class="category">'
        else
          html << '<li>'
        end

        if is_category
          icon = ' <i class="fa fa-angle-down"></i><i class="fa fa-angle-up"></i>'
        elsif item['url'].start_with?('http://', 'https://')
          target = "target='_blank'"
          icon = ' <i class="fa fa-external-link" aria-hidden="true"></i>'
        end

        href = if item['url'].start_with?('http://', 'https://')
          item['url']
        else
          "#{@baseurl}#{item['url'] == '/' ? '' : prefix}"
        end

        html << "<a href='#{href}' #{target}>#{item['title']}#{icon}</a>"

        if is_category
          html << render_list(page_url, item['children'])
        end

        html << "</li>"
      end

      html << '</ul>'
      html.join("\n")
    end

    def doc_to_item(pages, document)
      children = []
      if document.data['nav_overview']
        children.push({ 'url' => document.url, 'title' => document.data['nav_overview'], 'children' => [] })
      end
      nav_category = document.data['nav_category']
      if nav_category
        children.concat pages[nav_category]
          .map{ |p| doc_to_item(pages, p) }
          .sort_by{ |item| [item['nav_index'] || "99", item['nav_title'] || item['title']] }
      end

      {
        'url' => document.url,
        'title' => document.data['nav_title'] || document.data['title'],
        'children' => children
      }
    end

    def is_ancestor(page_url, prefix, is_category)
      if prefix == '' && page_url == ''
        true
      elsif prefix == ''
        false
      elsif page_url == prefix
        true
      elsif is_category && (page_url.start_with? prefix)
        true
      else
        false
      end
    end
  end

end

Liquid::Template.register_tag('navmenu', Jekyll::NavMenuTag)

