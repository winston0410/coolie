const { Worker } = require('worker_threads');

module.exports = function greenlet(fn) {
	let w,
		ids = 0;
	return (...args) =>
		new Promise((resolve, reject) => {
			if (!w) {
				w = new Worker(
					`((p, fn) => p.on('message',async([id,args]) => {
						try { p.postMessage([id, true, await fn.apply(null, args)]) }
						catch (e) { p.postMessage([id, false, String(e && e.stack || e)]) }
					}))(require('worker_threads').parentPort, ${fn})`,
					{ eval: true }
				);
			}
			let id = ++ids;
			w.on('message', function h([rid, success, result]) {
				if (rid == id) w.removeListener('message', h), (success ? resolve : reject)(result);
			});
			w.postMessage([id, args]);
		});
}
