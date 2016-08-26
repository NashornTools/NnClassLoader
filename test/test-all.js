var tests = [
	'test-urls.js'
];


function runTest(test) {
	print('>>>>>>>>>>>>>> Test begin: ' + test + ' >>>>>>>>>>>>>>>');
	load(test);
	print('>>>>>>>>>>>>>> Test end: ' + test + ' >>>>>>>>>>>>>>>');
}


for each (var test in tests)
	runTest(test);