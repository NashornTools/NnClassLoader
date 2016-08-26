load('../NnClassLoader.js');
var L = new NnClassLoader({urls:['http://repo1.maven.org/maven2/com/h2database/h2/1.4.192/h2-1.4.192.jar']});
var Driver = L.type('org.h2.Driver');
var c = Driver.load().connect('jdbc:h2:mem:',null);
var s = c.createStatement();

if (s.executeUpdate('CREATE TABLE cars(name VARCHAR)') !== 0)
	throw "Unexpected CREATE reuslt.";

if (s.executeUpdate("INSERT INTO cars VALUES ('BMW'),('Volvo'),('Lexus')") !== 3)
	throw "Unexpected INSERT reuslt.";	

var rs = s.executeQuery('SELECT * FROM cars');

var arr = ['BMW','Volvo','Lexus'];

var i = 0;


while (rs.next()) {
	var x = rs.getString(1);

	if (x != arr[i])
		throw "Result mismatch: " + x + " != " + arr[i];

	i++;

	print(x);
}

print('================');
print('OK');
