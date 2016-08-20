# NnClassLoader (Nashorn ClassLoader)
Class loading facility for Nashorn scripts. Allows to define Java dependencies directly in the Nashorn script.

Example of usage from JS REPL without having any local jars or scripts:

```javascript

jjs> load('https://raw.githubusercontent.com/NashornTools/NnClassLoader/master/NnClassLoader.js');
jjs> var L = new NnClassLoader({urls:['http://repo1.maven.org/maven2/com/h2database/h2/1.4.192/h2-1.4.192.jar']});
jjs> var Driver = L.type('org.h2.Driver');
jjs> var c = Driver.load().connect('jdbc:h2:mem:',null);
jjs> var s = c.createStatement();
jjs> s.executeUpdate('CREATE TABLE cars(name VARCHAR)');
0
jjs> s.executeUpdate("INSERT INTO cars VALUES ('BMW'),('Volvo'),('Lexus')");
3
jjs> var rs = s.executeQuery('SELECT * FROM cars');
jjs> while (rs.next()) print(rs.getString(1));
BMW
Volvo
Lexus

```




