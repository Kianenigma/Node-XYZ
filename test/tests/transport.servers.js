const common = require('../common')
const expect = common.expect
const mockNode = common.mockNode
const mockSystem = common.mockSystem
const mockFunctions = common.mockFunctions

let cwd, system, snd, rcv
before(function (done) {
  let testSystem = common.init()
  snd = testSystem.snd
  rcv = testSystem.rcv
  system = testSystem.system
  cwd = testSystem.cwd

  rcv.xyz.registerServer('HTTP', 2000, true)
  rcv.xyz.registerServerRoute(2000, 'http/2')
  rcv.xyz.middlewares().transport.server('http/2')(2000).register(0, require('./../../src/Transport/Middlewares/call/http.receive.event'))

  snd.xyz.registerClientRoute('http/2')
  snd.xyz.middlewares().transport.client('http/2').register(0, require('./../../src/Transport/Middlewares/call/http.export.middleware'))

  // console.log('ms', rcv.xyz.CONFIG.getSelfConf())
  setTimeout(done, 1000)
})

it('duplicate http server', function (done) {
  expect(rcv.xyz.CONFIG.getSelfConf().transport.length).to.equal(2)
  snd.call({servicePath: '/mul', route: 'http/2', redirect: true, payload: {x: 2, y: 3}}, (err, body) => {
    expect(body).to.equal(6)
    done()
  })
})

it('extra udp server on the fly', function (done) {
  rcv.xyz.registerServer('UDP', 2001, true)
  rcv.xyz.registerServerRoute(2001, 'udp')
  rcv.xyz.middlewares().transport.server('udp')(2001).register(0, require('./../../src/Transport/Middlewares/call/udp.receive.event'))

  snd.xyz.registerClientRoute('udp')
  snd.xyz.middlewares().transport.client('udp').register(0, require('./../../src/Transport/Middlewares/call/udp.export.middleware'))

  snd.call({servicePath: '/mul', route: 'udp', redirect: true, payload: {x: 2, y: 3}}, (err, body) => {
    expect(err).to.not.equal(null)
    // this is because redirect requires data that might need time to propagate
    setTimeout(() => {
      snd.call({servicePath: '/mul', route: 'udp', redirect: true, payload: {x: 2, y: 3}}, (err, body) => {
        expect(err).to.equal(null)
        done()
      })
    }, 3000)
  })
  this.timeout(4000)
})

after(function () {
  snd.stop()
  rcv.stop()
})