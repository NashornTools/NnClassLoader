load('../NnClassLoader.js');

var L = new NnClassLoader({
	maven:[
		'com.h2database:h2:1.4.192', 
		'org.apache.commons:commons-dbcp2:2.1.1'
	]
});

print('--------');
for each(var url in L.getUrls())
	print(" " + url);
print('--------');

if (L.getUrls().length < 2)
	throw "Wrong classpath.";

var BasicDataSource = L.type('org.apache.commons.dbcp2.BasicDataSource');

var ds = new BasicDataSource();

ds.setDriverClassName('org.h2.Driver');
ds.setUrl('jdbc:h2:mem:MyTestDb');

var c = ds.getConnection();
var s = c.createStatement();

if (s.executeUpdate('CREATE TABLE cars(name VARCHAR)') !== 0)
	throw "Unexpected CREATE reuslt.";

if (s.executeUpdate("INSERT INTO cars VALUES ('BMW'),('Volvo'),('Lexus')") !== 3)
	throw "Unexpected INSERT reuslt.";	

var rs = s.executeQuery('SELECT * FROM cars');

var arr = ['BMW','Volvo','Lexus'];

var i = 0;

print('--------');
while (rs.next()) {
	var x = rs.getString(1);

	if (x != arr[i])
		throw "Result mismatch: " + x + " != " + arr[i];

	i++;

	print(x);
}
print('--------');

print('OK');
