import { UserFactory } from "../../plugins/db/models";


export const insert = (server, body) => new Promise((resolve: any, reject: any) => {
    const userDb = UserFactory(server.db);
    const { username, password, email, address } = body;
    userDb.create({ username, password, email, address, createdBy: 'test' })
        .then((data: any) => {
            resolve({ userId: data.userId, username: data.username, createdBy: data.createdBy })
        }).catch((err): any => {
            reject(err)
        })
})