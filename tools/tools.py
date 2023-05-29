import requests
from constants import NM_NODE_REGISTRY_URL, NM_NODE_INFO_URL
import json
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


    def test_read_json(self):
        """
        Reads node_registry.json to build functions for formatting node info in Bootstrap
        Returns the information in json format
        """
        with open('node_registry.json', 'r') as json_file:
            content = json.load(json_file)

        return content



    def parse_json(self):
        json_tree = self.test_read_json()

        for key, value in json_tree.items():
            print ("key=" + key)
            print("value=" + value)



    def build_node_section(self):
        node_section = BeautifulSoup('<div class ="col-lg-2">', 'html.parser')
        node_section_container = BeautifulSoup('<div class="container">', 'html.parser')
        node_section_row = BeautifulSoup('<div class ="row">', 'html.parser')
        node_section_col3 = BeautifulSoup('<div class ="col-3  col-sm-4 ">', 'html.parser')
        node_section_imgdiv = BeautifulSoup('<div>','html.parser')
        node_section_img = BeautifulSoup('<img src = "" class =" img-fluid" />', 'html.parser')
        node_section_col9 = BeautifulSoup('<div class=" col-9 col-sm-8">', 'html.parser')


        node_section_start_tag = node_section.div
        node_section_container_start_tag = node_section_container.div
        node_section_row_start_tag = node_section_row.div
        node_section_col3_start_tag = node_section_col3.div
        node_section_imgdiv_start_tag = node_section_imgdiv.div

        node_section_start_tag.insert(1, node_section_container)
        node_section_container_start_tag.insert(1, node_section_row)
        node_section_row_start_tag.insert(1, node_section_col3)
        node_section_col3_start_tag.insert(1, node_section_imgdiv)
        node_section_imgdiv_start_tag.insert(1, node_section_img)

        node_section_col3_start_tag.insert_after(node_section_col9)




        node_section_html = node_section.prettify()

        return node_section_html

    def save_html(self, input):

        new_html = open("test_index.html", "w")
        new_html.write(input)
        new_html.close()

