import fp from 'fastify-plugin'
import { sendApmError } from '../../utils'

const authPlugin = (server, opts, next) => {
  server.decorate('decoded', null)

  server.addHook('preHandler', async (request, reply) => {
    try {
      if (request.routerPath) {
        if (!request.routerPath.includes('swagger') && !request.routerPath.includes('login')) {
          const authHeader = request.headers.authorization
          const token = authHeader.split(' ')[1]

          server.jwt.verify(token, (err, decodedJwt) => {
            if (err) {
              sendApmError(server, request, err)
              server.log.error(err)
            } else {
              server.log.info('decoded : ' + JSON.stringify(decodedJwt))
              server.decoded = decodedJwt
              next()
            }
          })
        }
      }
    } catch (err) {
      sendApmError(server, request, err)
      throw new Error('Failed to validate token')
    }
  })

  next()
}

export default fp(authPlugin)
