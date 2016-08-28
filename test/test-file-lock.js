var Thread = java.lang.Thread;
var File = java.io.File;
var RandomAccessFile = java.io.RandomAccessFile;
var OverlappingFileLockException = java.nio.channels.OverlappingFileLockException;
var MapMode = java.nio.channels.FileChannel.MapMode;

var stateFile = new File("/tmp/state");

stateFile.createNewFile();

var stateRaf = new RandomAccessFile(stateFile, "rw");
var buf = stateRaf.getChannel().map(MapMode.READ_WRITE, 0, 24);

function put(idx, v) {
	buf.putLong(idx * 8, v);
}

function get(idx) {
	return buf.getLong(idx * 8);
}

if (stateRaf.length() === 0) {
	put(0, 1);
	put(1, 2);
	put(2, 3);
}

var lockFile = new File('/tmp/my_tmp_lock');
lockFile.createNewFile();

function withLock(fun) {
	var raf = new RandomAccessFile(lockFile, "rw");

	try {
		var lock = null;

		do {
			try {
				lock = raf.getChannel().lock();
			}
			catch(e if e instanceof OverlappingFileLockException) {
				Thread.sleep(1);
			}
		}
		while (lock === null)

		try {
			fun();
		}
		finally {
			lock.release();
		}
	}
	finally {
		raf.close();
	}
}

var THREADS = 16;
var ITERATIONS = 100000;

var pool = java.util.concurrent.Executors.newFixedThreadPool(THREADS);

var futs = [];

for (var i = 0; i < THREADS; i++) {
	futs.push(pool['submit(Runnable)'](function() {
		for (var j = 0; j < ITERATIONS; j++)
			withLock(function() {
				var min = get(0);
				var mid = get(1);
				var max = get(2);

				// java.lang.System.out.println("  --> " + max + " = " + mid + " + " + min);

				// Fibonacci sequence check
				if (max !== min + mid)
					throw "Error: " + max + " != " + mid + " + " + min;

				// Too big value - restart the sequence.
				if (max == 23416728348467684) { 
					min = 1;
					mid = 2;
					max = 3;
				}
				else {
					var oldMax = max;
					var oldMid = mid;

					max = max + mid;
					mid = oldMax;
					min = oldMid;
				}

				put(0, min);
				put(1, mid);
				put(2, max);

				// buf.force();
			})
	}));
}

for each( var fut in futs)
	fut.get();

print('OK');