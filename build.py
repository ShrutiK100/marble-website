import os
import subprocess
import shutil
import argparse

from jinja2 import FileSystemLoader, Environment, select_autoescape

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
BUILD_DIR = os.path.abspath(os.getenv("BUILD_DIR", os.path.join(THIS_DIR, "build")))
TEMPLATE_PATH = os.path.join(THIS_DIR, "templates")
SITE_PATH = os.path.join(TEMPLATE_PATH, "site")
TUTORIALS_PATH = os.path.join(THIS_DIR, 'marble-tutorials')


def filter_site_templates(template):
    abs_filepath = os.path.join(TEMPLATE_PATH, template)
    return SITE_PATH == os.path.commonpath((abs_filepath, SITE_PATH))


def build_tutorials():
    subprocess.run(["jupyter-book", "build", os.path.join(TUTORIALS_PATH, "tutorials"), "--path-output",
                    os.path.join(BUILD_DIR, "tutorials")], check=True)


def build(build_directory, node_registry_url):
    env = Environment(loader=FileSystemLoader(TEMPLATE_PATH),
                      autoescape=select_autoescape(enabled_extensions=("html", "js", "css")))

    shutil.copytree(os.path.join(THIS_DIR, "static"), build_directory, dirs_exist_ok=True)

    for template in env.list_templates(filter_func=filter_site_templates):
        build_destination = os.path.join(build_directory,
                                         os.path.relpath(os.path.join(TEMPLATE_PATH, template), SITE_PATH))
        os.makedirs(os.path.dirname(build_destination), exist_ok=True)
        with open(build_destination, 'w') as f:
            f.write(env.get_template(template).render(node_registry_url=node_registry_url))
    build_tutorials()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-u",
        "--node-registry-url",
        default="https://raw.githubusercontent.com/"
                "DACCS-Climate/DACCS-node-registry/current-registry/node_registry.json",
        help="node registry URL")
    parser.add_argument("-b", "--build-directory", default=os.path.join(THIS_DIR, "build"),
                        help="location on disk to write built templates to.")
    args = parser.parse_args()
    build(args.build_directory, args.node_registry_url)
