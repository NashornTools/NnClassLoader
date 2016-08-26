load('../NnClassLoader.js');

var L = new NnClassLoader({
	urls: [
		'http://www.example.com/my.jar',
		'http://www.example.ru/my-ru.jar'
	],

	jars: [
		'/some/path/to/some.jar',
		'/some/path/to/some-else.jar'
	],

	dirs: [
		'dir1', 'dir2/', 'dir3-bad'
	],

	filter: function(f) {
		return !f.getName().contains('-bad');
	}
});


function url(f) {
	var File = java.io.File;
	return new File(f).getAbsoluteFile().toURI().toURL().toString();
}

var expected = [
	'http://www.example.com/my.jar',
	'http://www.example.ru/my-ru.jar',

	url('/some/path/to/some.jar'),
	url('/some/path/to/some-else.jar'),

	
	url('dir1/my-fake-test1.jar'),
	url('dir1/my-fake-test2.jar'),
	url('dir1/myJars/my-fake-4.jar'),
	url('dir2/my-fake-8.jar')
];

if (expected.length !== L.urls.length)
	throw "Wrong length: " + L.urls;

for each (var url in expected) {
	if (L.urls.indexOf(url) === -1)
		throw "Not found '" + url + "' in " + L.urls;		
}


print('--------');
for each (var url in L.urls)
	print(url);
print('--------');

print('OK');