var Thread = java.lang.Thread;
var File = java.io.File;
var RandomAccessFile = java.io.RandomAccessFile;
var OverlappingFileLockException = java.nio.channels.OverlappingFileLockException;

// !!! rm /tmp/state

var stateFile = new File("/tmp/state");

var created = stateFile.createNewFile();

if (created)  // Write initial sequence.
	writeAndClose(new RandomAccessFile(stateFile, "rw"), 1, 2, 3);

function writeAndClose(stateRaf, min, mid, max) {
	stateRaf.seek(0);

	stateRaf.writeLong(min);
	stateRaf.writeLong(mid);
	stateRaf.writeLong(max);

	stateRaf.getChannel().force(true);

	stateRaf.close();
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
				Thread.sleep(10);

				var stateRaf = new RandomAccessFile(stateFile, "rw");

				stateRaf.seek(0);

				var min = stateRaf.readLong();
				var mid = stateRaf.readLong();
				var max = stateRaf.readLong();

				// java.lang.System.out.println("  --> " + max + " = " + mid + " + " + min);

				if (max < 3 || max > 23416728348467684)
					throw "Error: " + max + ", " + mid + ", " + min;

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

					min = oldMid;
					mid = oldMax;
					max = oldMax + oldMid;
				}

				writeAndClose(stateRaf, min, mid, max);
			})
	}));
}

for each(var fut in futs)
	fut.get();

print('OK');