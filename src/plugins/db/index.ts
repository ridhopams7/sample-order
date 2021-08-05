import fp from 'fastify-plugin'
import * as dbSequel from 'sequelize'
import { UserFactory, SkillsFactory, OrdersFactory, OrderDetailsFactory } from './models'


const dbPlugin = async (server, opts, next) => {
    // database
    const dbSequelize = new dbSequel.Sequelize(server.conf.db, server.conf.dbUsername, server.conf.dbPassword, {
        // other sequelize config goes here
        dialect: server.conf.dbDialect,
        host: server.conf.dbHost,
        port: Number.parseInt(server.conf.dbPort),
        dialectOptions: {
            options: { encrypt: false }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    })

    // // SOMETHING VERY IMPORTANT them Factory functions expect a
    // // sequelize instance as parameter give them `dbSequelize`
    // export const User = UserFactory(dbSequelize);
    // export const Skills = SkillsFactory(dbSequelize);

    // decorators
    server.decorate('db', dbSequelize)

    server.addHook('onClose', (fastifyInstance, done) => {
        dbSequelize.close()
            .then(() => done())
            .catch((error) => {
                const { message, stack } = error
                const err = {

                    method: 'DB Connection Closing',
                    message,
                    stack
                }

                server.apm.captureError(JSON.stringify(err));
                done()
            })
    })

    server.log.info('Checking Connection.')
    const authDB = await server.db.authenticate()
    if (authDB) {
        server.apm.captureError({
            method: 'Connecting to database',
            error: authDB
        })

        server.log.error('Unable to connect to the database:', authDB)
    }
    server.log.info('Database Connection has been established successfully.')

    const skill = SkillsFactory(dbSequelize)
    const user = UserFactory(dbSequelize)
    const order = OrdersFactory(dbSequelize)
    const orderDetail = OrderDetailsFactory(dbSequelize)


    // await skill.sync({ force: true })
    // server.db.sync({ force: true });
    // server.db.sync();
}

export default fp(dbPlugin)
