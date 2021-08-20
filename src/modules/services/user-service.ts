import { UserFactory } from "../../plugins/db/models";

export class UserService {
    db: any;
    userModel;

    constructor(db){
        this.db = db;
        this.userModel = UserFactory(this.db);

    }

    insert = (param) => new Promise((resolve: any, reject: any) => {
        // const userDb = UserFactory(server.db);
        const { username, password, email, address } = param;
        this.userModel.create({ username, password, email, address, createdBy: 'test' })
            .then((data: any) => {
                resolve(data.username)
            }).catch((err): any => {
                reject(err)
            })
    });
}

