# Marble Website

This repository hosts the website content for the Marble Project. This website contains information about the
project as well as tutorials (as a submodule under `marble-tutorials/`).

### To build the site

```shell
python3 -m pip install -r requirements.txt -r marble-tutorials/tutorials/requirements.txt
python3 build.py
```

By default, all files will be written to the `build/` directory. To specify a different directory use the `-b` option
when calling `build.py`.

By default, node information will be read from 
[the default DACCS node registry](
    https://raw.githubusercontent.com/DACCS-Climate/Marble-node-registry/current-registry/node_registry.json
). To specify a different URL use the `-u` option when calling `build.py`

> [!NOTE]
> If you've just cloned the repository, ensure that the marble-tutorials submodule has been cloned as well:
> ```shell
> git submodule init
> git submodule update
> ```

> If pulling changes from the main repository, run the following to ensure the submodule is picked up as well:
> ```shell
> git pull --recurse-submodules
> ```

### To view the site

The files in build directory can be served as a static website. For example:

```shell
cd build/
python3 -m http.server 8000
```

This will start a basic http server that can be accessed at http://localhost:8000

(Note that this is recommended for development only)

### Development

This is how the files are arranged in this repo and how to update them in order to develop this website.

- Files in the `static/` directory will be copied to the build directory without modification.
- Files in the `templates/site/` directory will be copied to the build directory after being updated by the template engine
- All other directories in the `templates/` directory will not be copied to the build directory but _will_ be used by the templating engine
  - `templates/layouts/` contains files that should be extended by other template files
  - `templates/partials/` contain files that should be included by other template files

The template engine used is [Jinja](https://jinja.palletsprojects.com/en/3.1.x/).
