# NnClassLoader (Nashorn ClassLoader)[![Build Status](https://travis-ci.org/NashornTools/NnClassLoader.svg?branch=master)](https://travis-ci.org/NashornTools/NnClassLoader)
Simple and convenient Java ClassLoader for Nashorn scripts. Allows to define Java dependencies (jars, class directories, URLs, Maven or any combination of them) directly in the Nashorn script or right in `jjs` REPL.

Example of usage from `jjs` REPL without having any local jars or scripts and even without manual Maven installation:

```bash
jjs> // Load script with NnClassLoader from GitHub.
jjs> load('https://raw.githubusercontent.com/NashornTools/NnClassLoader/master/NnClassLoader.js');
jjs>
jjs> // Define Maven dependencies for the script.
jjs> var MAVEN_DEPENDENCIES = ['com.h2database:h2:1.4.192', 'org.apache.commons:commons-dbcp2:2.1.1'];
jjs>
jjs> // Create class loader instance.
jjs> var L = new NnClassLoader({ maven: MAVEN_DEPENDENCIES });
jjs>
jjs> // Look at the actual list of jars resolved by the class loader.
jjs> for each(var url in L.getUrls()) print(url);
file:/Users/xxx/.m2/repository/com/h2database/h2/1.4.192/h2-1.4.192.jar
file:/Users/xxx/.m2/repository/org/apache/commons/commons-pool2/2.4.2/commons-pool2-2.4.2.jar
file:/Users/xxx/.m2/repository/commons-logging/commons-logging/1.2/commons-logging-1.2.jar
file:/Users/xxx/.m2/repository/org/apache/commons/commons-dbcp2/2.1.1/commons-dbcp2-2.1.1.jar
jjs>
jjs> // Import class similarly to Java.type('com.example.MyType').
jjs> var BasicDataSource = L.type('org.apache.commons.dbcp2.BasicDataSource');
jjs>
jjs> // Work with inported classes as usual.
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
BMW
Volvo
Lexus

```




