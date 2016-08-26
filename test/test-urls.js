load('../NnClassLoader.js');

var L = new NnClassLoader({
	urls: [
		'http://www.example.com/my.jar',
		'http://www.example.ru/my-ru.jar'
	],

	jars: [
		'my-test.jar',
		'/some/path/to/some-else.jar'
	],

	dirs: [
		'dir1', 'dir2/', 'dir3-bad'
	],

	classes: [
		'classes1', 'classes2-bad'
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

	url('my-test.jar'),

	url('dir1/my-fake-test1.jar'),
	url('dir1/my-fake-test2.jar'),
	url('dir1/myJars/my-fake-4.jar'),
	url('dir2/my-fake-8.jar'),

	url('classes1'),
	url('classes2-bad'),
];

var urls = L.getUrls();

if (expected.length !== urls.length)
	throw "Wrong length: " + urls;

for each (var url in expected) {
	if (urls.indexOf(url) === -1)
		throw "Not found '" + url + "' in " + urls;
}


print('--------');
for each (var url in urls)
	print(url);
print('--------');

print('OK');