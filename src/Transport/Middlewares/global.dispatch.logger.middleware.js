const logger = require('./../../Log/Logger')
const wrapper = require('./../../Util/ansi.colors').wrapper

function globalDispatchLogger (params, next, end) {
  let requestConfig = params[0]

  logger.verbose(`${wrapper('bold','LOGGER')} | request being sent to ${wrapper('bold', requestConfig.hostname)}:${requestConfig.port}${requestConfig.path} with json ${JSON.stringify(requestConfig.json)}`)
  next()
}

module.exports = globalDispatchLogger