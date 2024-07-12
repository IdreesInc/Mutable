#!/bin/bash
# Build Mutable for Firefox and Chrome (but not Safari)
# python ./replace.py ./settings/settings.html
zip -r mutable-packaged.zip . -x "Mutable/*" -x "*/.DS_Store" -x ".DS_Store" -x "build.sh" -x "replace.py" -x "mutable-packaged.zip" -x "node_modules/*" -x "Mutable.code-workspace" -x ".git/*" -x ".gitignore" -x ".gitattributes"
# python ./replace.py ./settings/settings.html true