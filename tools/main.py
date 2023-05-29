from tools import Tools


webtool = Tools()
# webtool.parse_json()

new_index_page = webtool.build_node_section()

webtool.save_html(new_index_page)
