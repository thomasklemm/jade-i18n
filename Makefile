test:
	./support/expresso/bin/expresso -I lib $(TESTFLAGS) tests/*.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test