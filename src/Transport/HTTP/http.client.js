const querystring = require('querystring')
const CONSTANTS = require('../../Config/Constants')
const _RSA = require('./../../Config/rsa.global')
const logger = require('./../../Log/Logger')
const machineReport = require('./../../Util/machine.reporter')
const _CONFIGURATIONS = require('./../../Config/config.global')
let GenericMiddlewareHandler = require('./../../Middleware/generic.middleware.handler')

class HTTPClient {
  constructor () {
    this.callPostfix = CONSTANTS.url.CALL
    this.pingPrefix = CONSTANTS.url.PING

    this.callDispatchMidllewareStack = new GenericMiddlewareHandler()
    this.callDispatchMidllewareStack.register(-1, require('./../Middlewares/global.dispatch.logger.middleware'))
    this.callDispatchMidllewareStack.register(-1, require('./../Middlewares/call/call.dispatch.export.middleware'))

    this.pingDispatchMiddlewareStack = new GenericMiddlewareHandler()
    this.pingDispatchMiddlewareStack.register(-1, require('./../Middlewares/global.dispatch.logger.middleware'))
    this.pingDispatchMiddlewareStack.register(-1, require('./../Middlewares/global.dispatch.auth.basic.middleware'))
    this.pingDispatchMiddlewareStack.register(-1, require('./../Middlewares/ping/ping.dispatch.export.middleware'))
  }

  send (serviceName, microservice, userPayload, callResponseCallback) {
    let requestConfig = {
      hostname: `${microservice.split(':')[0]}`,
      port: microservice.split(':')[1],
      path: `/${this.callPostfix}?${querystring.stringify({service: serviceName})}`,
      method: 'POST',
      json: { userPayload: userPayload }
    }
    this.callDispatchMidllewareStack.apply([requestConfig, callResponseCallback], 0)
  }

  ping (microservice, pingResponseCallback) {
    let requestConfig = {
      hostname: `${microservice.host}`,
      port: microservice.port,
      path: `/${this.pingPrefix}`,
      method: 'POST',
      json: { sender: `${_CONFIGURATIONS.getServiceConf().host}:${_CONFIGURATIONS.getServiceConf().port}` }
    }
    this.pingDispatchMiddlewareStack.apply([requestConfig, pingResponseCallback], 0)
  }

}

module.exports = HTTPClient
