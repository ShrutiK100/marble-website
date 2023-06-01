import requests
from constants import NM_NODE_REGISTRY_URL, NM_NODE_INFO_URL
import json
import itertools
from bs4 import BeautifulSoup

class Tools:

    """
    Contains functions for retrieving information from the github node registry
    """

    # Gets node_registry.json from github and returns the content

    # Gets node_registry.json from github and returns the content
    @staticmethod
    def get_node_registry():
        """
        Gets information from the node registry repository at the given url.
        Returns the information in json format
        """

        node_registry_url = NM_NODE_REGISTRY_URL
        node_registry_file = requests.get(node_registry_url, allow_redirects=True)
        node_registry_json = node_registry_file.json()

        return node_registry_json

    @staticmethod
    def get_node_info():

        """
        Gets information from the node info repository at the given url.
        Returns the information in json format
        """

        node_info_url = NM_NODE_INFO_URL
        node_info_file = requests.get(node_info_url, allow_redirects=True)
        node_info_json = node_info_file.json()

        return node_info_json



    def read_template(self, filename):
        with open(filename, 'r') as html_file:
            content = html_file.read()

        return content




    def test_read_json(self):
        """
        Reads node_registry.json to build functions for formatting node info in Bootstrap
        Returns the information in json format
        """
        with open('node_registry.json', 'r') as json_file:
            content = json.load(json_file)

        return content


    def save_html(self, filename, content):

        with open(filename, 'w') as new_html_file:

            new_html_file.write(content)
            new_html_file.close()









    def build_node_section(self,start, end):

        node_group = ""

        node_item = 1

        json_tree = self.test_read_json()
        json_tree_subset = dict(itertools.islice(json_tree.items(), start, end))


        for key, value in json_tree_subset.items():
            node_section_template = self.read_template('node-section-template.html')

            node_section_template = node_section_template.replace("NODE_CONTENT_ID", "nodeContent" + str(node_item))
            node_section_template = node_section_template.replace("NODE_LOGO_COLUMN_ID", "nodeLogoColumn" + str(node_item))
            node_section_template = node_section_template.replace("NODE_LOGO_ID",  "nodeLogo" + str(node_item))
            node_section_template = node_section_template.replace("NODE_DESCRIPTION_COLUMN_ID", "nodeDescriptionColumn" + str(node_item))
            node_section_template = node_section_template.replace("NODE_NAME_ID", "nodeName" + str(node_item))
            node_section_template = node_section_template.replace("NODE_DESCRIPTION_ID", "nodeDescription" + str(node_item))
            node_section_template = node_section_template.replace("NODE_LINK_ID", "nodeLink" + str(node_item))


            node_name = key
            url = value['url']
            affiliation = value['affiliation']
            description = value['description']
            icon_url = value['icon_url']
            services_array = value['services']

            node_section_template = node_section_template.replace('NODE_NAME', node_name)
            node_section_template = node_section_template.replace('NODE_DESCRIPTION', description)
            node_section_template = node_section_template.replace('NODE_LINK', url)
            node_section_template = node_section_template.replace('NODE_LOGO_PATH', icon_url)

            node_group = node_group + node_section_template

            node_item = node_item + 1
            # start=start = 1


        return node_group




    def build_row_section(self, accordion:bool, json_tree_length):

        if accordion:
            if json_tree_length >4:
                row_num = json_tree_length / 4
                for x in range(0,int(row_num)):
                    node_accordion_row_template = self.read_template('row-accordion-section-template.html')

                    node_row = node_accordion_row_template.replace('ACCORDION_ID', 'accordion' + str(x+1))
                    node_row = node_row.replace('ACCORDION_HEADER_ID', 'accordionHeader' + str(x+1))
                    node_row = node_row.replace('ACCORDION_COLLAPSE_ID','accordionCollapse' + str(x+1))
            else:
                for x in range(0, json_tree_length):
                    node_accordion_row_template = self.read_template('row-accordion-section-template.html')

                    node_row = node_accordion_row_template.replace('ACCORDION_ID', 'accordion' + str(x + 1))
                    node_row = node_row.replace('ACCORDION_HEADER_ID', 'accordionHeader' + str(x + 1))
                    node_row = node_row.replace('ACCORDION_COLLAPSE_ID', 'accordionCollapse' + str(x + 1))


        else:
            node_intro_row_template = self.read_template('row-section-template.html')
            node_row = node_intro_row_template.replace("NODE_INTRO_ROW_ID", "nodeRow1")

        return node_row

    def build_node_content(self):

        json_tree = self.test_read_json()

        tree_length = len(json_tree)

        # node_intro_row_template = self.read_template('row_section_template.html')
        node_accordion_row = ""
        node_remainder_row = ""

        if len(json_tree) < 5:
            node_group = self.build_node_section(0, len(json_tree))
            node_row_section = self.build_row_section(False, len(json_tree) )
            node_intro_row = node_row_section.replace('NODE_GROUP', node_group)

        else:
            node_intro_group = self.build_node_section(0, 4)
            node_row = self.build_row_section(False, 4)
            node_intro_row = node_row.replace('NODE_GROUP', node_intro_group)

            for x in range(0, int(len(json_tree)/4) ):
                node_accordion_row_section = self.build_row_section(True, len(json_tree))

                for y in range(4, len(json_tree)):

                    node_accordion_group = self.build_node_section(y, y+4)

                node_accordion_row = node_accordion_row_section.replace("ACCORDION_BODY_CONTENT", node_accordion_group)

        if len(json_tree) % 4 > 0:
            node_remainder_row_section = self.build_row_section(True, len(json_tree) % 4)
            node_remainder_group = self.build_node_section(len(json_tree)  - (len(json_tree) % 4), len(json_tree) )

            node_remainder_row = node_remainder_row_section.replace("ACCORDION_BODY_CONTENT", node_remainder_group)

        node_content = node_intro_row + node_accordion_row + node_remainder_row

        return node_content



    def build_homepage(self):
        homepage_template = self.read_template('index-template.html')
        node_content = self.build_node_content()

        homepage_template = homepage_template.replace('NODE_CONTENT', node_content)

        homepage_bs4 = BeautifulSoup(homepage_template, 'html.parser')

        homepage = homepage_bs4.prettify()

        self.save_html("index-test.html", homepage)





    def parse_json(self):
        json_tree = self.test_read_json()
        for key, value in json_tree.items():


            print("key=" + key)
            print("value=" + value['url'])