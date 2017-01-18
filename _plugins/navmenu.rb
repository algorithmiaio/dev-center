module Jekyll
  class NavMenuTag < Liquid::Tag

    def initialize(tag_name, markup, options)
      super
    end

    def render(context)
      contents = super
      current_url = context['page']['url']
      @baseurl = context['site']['baseurl']

      @@items ||= context['site']['data']['toc'].map do |item|
        pages ||= context['site']['pages'].select{|p| p.data['categories'].count > 0 }.group_by{ |p| p.data['categories'].first }
        item_cat = item['category']
        unless item_cat.nil?
          item['children'] = pages[item_cat].map{|p| doc_to_item(pages, p) }
        end
        item
      end

      render_list(current_url, @@items)

    end

    def render_list(page_url, items)
      html = []
      html << '<ul id="sidebar" class="nav">'
      items.each do |item|
        prefix = item['url'].chomp('/') + '/'

        is_active = is_ancestor(page_url, prefix)
        if is_active
          html << '<li class="active">'
        else
          html << '<li>'
        end

        if item['children'] and item['children'].count > 0
          icon = ' <i class="fa fa-angle-down"></i>'
        elsif item['url'].start_with?('http://', 'https://')
          icon = ' <i class="fa fa-external-link" aria-hidden="true"></i>'
        end

        html << "<a href='#{@baseurl}#{item['url']}'>#{item['title']}#{icon}</a>"

        if is_active and item['children']
          html << render_list(page_url, item['children'])
        end

        html << "</li>"
      end

      html << '</ul>'
      html.join("\n")
    end

    def doc_to_item(pages, document)
      children = []
      nav_children = document.data['nav_children']
      if nav_children
        children = pages[nav_children].map{|p| doc_to_item(pages, p) }
      end

      {
        'url' => document.url,
        'title' => document.data['title'],
        'children' => children
      }
    end

    def is_ancestor(page_url, prefix)
      if prefix == '/' and page_url == '/'
        true
      elsif prefix == '/'
        false
      elsif page_url.start_with? prefix
        true
      else
        false
      end
    end
  end

end

Liquid::Template.register_tag('navmenu', Jekyll::NavMenuTag)

