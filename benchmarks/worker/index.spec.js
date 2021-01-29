const greenletNode = require('./greenlet-node')

const { Worker } = require('worker_threads');

const { Benchmark } = require('benchmark')
const suite = new Benchmark.Suite()

const add = (a, b) => {
  return a + b
}

suite.add('Main thread', function (){
  add(10, 3)
})

// suite.add('Native worker thread', {
//   defer: true,
//   fn: async function (deferred) {
//     add(10, 3)
//     deferred.resolve()
//   }
// }).on('complete', function () {
//   console.log(this[0].stats)
// }).run()

// const addGreenlet = greenletNode(async (a, b) => {
//   return a + b;
// });

// addGreenlet()

suite.add('Greenlet-node', {
  defer: true,
  fn: function (deferred) {
    add(10, 3)
    deferred.resolve()
  }
})

suite.on('cycle', function (event) {
	if (event.target.error) {
		console.log(event.error)
	}
	console.log(String(event.target))
})

suite.on('complete', function () {
	console.log(`Fastest is ${this.filter('fastest').map('name')}`)
})

suite.run()
