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
jjs> // Work with imported classes as usual.
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

## Supported configuration properties

`NnClassLoader` constructor accepts single object with any of the following configuration properties:

- `urls` - JS array of URL strings (may refer to remote Jars as well, e.g. `{urls: ['http://example.com/bla.jar']}`)
- `jars` - JS array of Jar file path strings (`{jars: ['libs/bla.jar']}`)
- `dirs` - JS array of directory path strings to be recursively scanned in order to find all the Jar files there (`{dirs: ['libs']}`)
- `filter` - JS function which accepts single argument of type `java.io.File` and returns boolean; makes sense only if `dirs` is defined and allows to filter scanned files and directories (`{dirs: ['libs'], filter: function(f) {return f.isDirectory() || f.getName().endsWith('.jar')}}`)
- `classes` - JS array of directory path strings to be added to classpath as is (`{classes:['target/classes']}`)
- `maven` - JS array of Maven dependencies to be loaded (`{maven: ['org.apache.ignite:ignite-core:1.7.0']}`)
- `parent` - parent Java class loader (must be of `java.lang.ClassLoader` type)


## API methods of `NnClassLoader` instances

- `type(className)` - loads the requested type by name the same way as `Java.type('...')` does
- `getUrls()` - returnes JS array of actual URL strings used by this class loader instance
- `getJavaClassLoader()` - returns internal `java.net.URLClassLoader` instance which actually does the class loading (it is often useful to set it as a thread context class loader by `java.lang.Thread.setContextClassLoader` method)









