#!/usr/bin/env python
import sys
import os
import tempfile

template='<!-- end -->'
code='<div id="donations-window" class="window"><div class="window-top-bar"><div class="window-icon"></div><div class="window-title">donate</div><div class="window-controls"><div class="window-button left-window-button"></div><div class="window-button right-window-button"></div></div></div><div id="donations-window-content" class="window-content"><span>Want to support Mutable?</span><a id="donate-link" href="https://ko-fi.com/idrees" target="_blank"><div id="donate">Donate via Kofi!</div></a></div></div>'
tmp=tempfile.mkstemp()

with open(sys.argv[1]) as fd1, open(tmp[1],'w') as fd2:
	for line in fd1:
		if len(sys.argv) == 3:
			line = line.replace(code, template)
		else:
			line = line.replace(template, code)
		fd2.write(line)

os.rename(tmp[1],sys.argv[1])