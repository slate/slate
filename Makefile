
C8 = ./node_modules/.bin/component
SRC = $(wildcard lib/*/*.js)
APP = /tmp/slate.nw

run: build
	@rm -f $(APP)
	zip -rq $(APP) *
ifeq ($(shell uname), Linux)
	`which nw` $(APP)
else
	open -n -a node-webkit $(APP)
endif

build: node_modules components $(SRC)
	@$(C8) build --standalone slate

components:
	@$(C8) install

node_modules: package.json
	@npm install

clean:
	rm -fr build

distclean: clean
	rm -fr components

.PHONY: clean distclean run
