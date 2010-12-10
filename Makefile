test:
	@./support/expresso/bin/expresso \
		-I support \
		-I lib \
		$(TESTFLAGS) tests/*.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test