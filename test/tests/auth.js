const common = require('../common')
let logger = require('./../../src/Log/Logger')
const expect = common.expect
const mockMicroservice = common.mockMicroService
const mockSystem = common.mockSystem
const mockFunctions = common.mockFunctions
const http = require('http')

let snd
let rcv
let system
let cwd
let str = 'manipulated'

before(function (done) {
  let testSystem = common.init()
  snd = testSystem.snd
  rcv = testSystem.rcv
  system = testSystem.system
  cwd = testSystem.cwd

  setTimeout(done, 500)
})

it('Add auth on the fly', function (done) {
  snd.middlewares().transport.client.callDispatch.register(1, require('./../../src/Transport/Middlewares/global.dispatch.auth.basic.middleware'))
  rcv.middlewares().transport.server.callReceive.register(1, require('./../../src/Transport/Middlewares/global.receive.auth.basic.middleware'))

  snd.call('/mul', { x: 2, y: 10 }, (err, body, response) => {
    expect(body).to.equal(20)
    done()
  })
})

it('wrong auth', function (done) {
  snd.middlewares().transport.client.callDispatch.register(1, (params, next, done) => {
    let requestConfig = params[0]
    requestConfig.json.auth = '123wrong'
    next()
  })
  rcv.middlewares().transport.server.callReceive.register(1, require('./../../src/Transport/Middlewares/global.receive.auth.basic.middleware'))

  snd.call('/mul', { x: 2, y: 10 }, (err, body, response) => {
    expect(body).to.equal(null)
    expect(typeof (err)).to.equal('object')
    done()
  })
})

after(function () {
  snd.stop()
  rcv.stop()
})
