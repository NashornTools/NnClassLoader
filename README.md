# NnClassLoader (Nashorn ClassLoader)[![Build Status](https://travis-ci.org/NashornTools/NnClassLoader.svg?branch=master)](https://travis-ci.org/NashornTools/NnClassLoader)
Class loading facility for Nashorn scripts. Allows to define Java dependencies directly in the Nashorn script.

Example of usage from JS REPL without having any local jars or scripts:

```javascript
jjs> // Load script with NnClassLoader.
jjs> load('https://raw.githubusercontent.com/NashornTools/NnClassLoader/master/NnClassLoader.js');
jjs>
jjs> var MAVEN_DEPENDENCIES = ['com.h2database:h2:1.4.192', 'org.apache.commons:commons-dbcp2:2.1.1'];
jjs>
jjs> var L = new NnClassLoader({ maven: MAVEN_DEPENDENCIES });
jjs>
jjs> for each(var url in L.getUrls()) print(url);
```
```bash
file:/Users/xxx/.m2/repository/com/h2database/h2/1.4.192/h2-1.4.192.jar
file:/Users/xxx/.m2/repository/org/apache/commons/commons-pool2/2.4.2/commons-pool2-2.4.2.jar
file:/Users/xxx/.m2/repository/commons-logging/commons-logging/1.2/commons-logging-1.2.jar
file:/Users/xxx/.m2/repository/org/apache/commons/commons-dbcp2/2.1.1/commons-dbcp2-2.1.1.jar
```
```javascript
jjs>
jjs> // Import class.
jjs> var BasicDataSource = L.type('org.apache.commons.dbcp2.BasicDataSource');
jjs>
jjs> var ds = new BasicDataSource();
jjs>
jjs> ds.setDriverClassName('org.h2.Driver');
jjs> ds.setUrl('jdbc:h2:mem:MyTestDb');
jjs>
jjs> var c = ds.getConnection();
jjs> var s = c.createStatement();
jjs>
jjs> s.executeUpdate('CREATE TABLE cars(name VARCHAR)');
0
jjs> s.executeUpdate("INSERT INTO cars VALUES ('BMW'),('Volvo'),('Lexus')");
3
jjs> var rs = s.executeQuery('SELECT * FROM cars');
jjs> while (rs.next()) print(rs.getString(1));
```
```bash
BMW
Volvo
Lexus

```




