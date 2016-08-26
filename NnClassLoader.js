/*
   Copyright 2016 Sergi Vladykin (https://github.com/svladykin) 

   Version 0.2

   The latest version can be found at https://github.com/NashornTools

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/


var NnClassLoader = (function () {

var StaticClass = Java.type('jdk.internal.dynalink.beans.StaticClass'); // TODO fix for JDK9
var Class = java.lang.Class;
var URLClassLoader = java.net.URLClassLoader;
var URL = java.net.URL;
var File = java.io.File;
var HashSet = java.util.HashSet;
var UrlArray = Java.type('java.net.URL[]');


function isDefined(o) {
	return typeof(o) !== 'undefined';
}

function isObject(o) { // Will return true for arrays as well. 
	return typeof(o) === 'object';
}

function loadType(className, ldr) {
	var cls = Class.forName(className, true, ldr);
	return StaticClass.forClass(cls);
}

function scanDirForJars(f, filter, urls) {
	if (!f.exists())
		return;
	if (f.isDirectory()) {
		if (filter(f)) {
			for each (var x in f.listFiles())
				scanDirForJars(x, filter, urls);
		}
	}
	else if (f.isFile() && f.getName().endsWith('.jar') && filter(f))
		urls.add(f.toURI().toURL());
}

function collectAllJarUrls(cfg) {
	if (!isObject(cfg)) 
		throw "Class loader config is not provided.\nFor example: new NnClassLoader({jars:['/myapp/bla.jar'], urls:['http://.../bla.jar']})";

	var urls = new HashSet();

	if (isObject(cfg.urls)) {
		for each (var url in cfg.urls)
			urls.add(new URL(url));
	}

	if (isObject(cfg.jars)) {
		for each (var jar in cfg.jars)
			urls.add(new File(jar).toURI().toURL());
	}

	if (isObject(cfg.dirs)) {
		var filter = isDefined(cfg.filter) ? cfg.filter : function(f) {return true;};

		for each (var dir in cfg.dirs)
			scanDirForJars(new File(dir), filter, urls);
	}

	return urls.toArray(new UrlArray(0));
}

return function(cfg) {
	var jarUrls = collectAllJarUrls(cfg);
	var ldr = isObject(cfg.parent) ? 
		new URLClassLoader(jarUrls, cfg.parent):
		new URLClassLoader(jarUrls);

	this.type = function(className) {
		return loadType(className, ldr);
	}

	this.urls = [];

	for each (var url in jarUrls)
		this.urls.push(url.toString());
}	
})();
