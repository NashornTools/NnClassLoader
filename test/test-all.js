print("Running tests...")
print(__DIR__, __FILE__, __LINE__);

var tests = [
	'test-urls.js',
	'test-loading.js',
	'test-mvn.js',
];

function runTest(test) {
	print('>>>>>>>>>>>>>> Test begin: ' + test + ' >>>>>>>>>>>>>>>');
	load(test);
	print('<<<<<<<<<<<<<< Test end:   ' + test + ' <<<<<<<<<<<<<<<');
}


for each (var test in tests)
	runTest(test);