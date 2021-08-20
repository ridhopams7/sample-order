"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const instance = __importStar(require("../server"));
const mockLoginData = {
    username: "testusername",
    password: "testpassword"
};
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VybmFtZSJ9.KLDiMFN3QkOAS8mprDbCoYu1t4yPcmvBZaqtQYti38I";
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = yield instance.createServer();
}));
// afterAll(async () => {
//   await server.close();
// });
describe('server test', () => {
    test("GET returns 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield server.inject({
            method: 'GET',
            url: '/',
            headers: {
                'Authorization': token
            }
        });
        expect(response.statusCode).toBe(200);
        expect(response.payload).toBe('{"hello":"world"}');
    }));
});
describe('user: getAll', () => {
    test("GET returns 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield server.inject({
            method: 'GET',
            url: '/user/model/getAll',
            headers: {
                'Authorization': token
            }
        });
        expect(response.statusCode).toBe(200);
        // expect(response.payload).toBe('{"hello":"world"}');
    }));
});
describe('user: insert', () => {
    const dataMock = {
        "username": "mockDataUsername",
        "password": "mockDataPassword"
    };
    const dataMockResp = {
        "success": "true",
        "message": "Insert successful!",
        "data": Object.assign(Object.assign({}, dataMock), { "createdBy": mockLoginData.username })
    };
    test("POST returns 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield server.inject({
            method: 'POST',
            url: '/user/model/insert',
            headers: {
                'Authorization': token
            },
            body: dataMock
        });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.payload).message).toBe('Insert successful!');
    }));
});
// describe('59650697', () => {
//   it('should create user with role', async () => {
//     const mUser: any = { setUserRole: jest.fn() };
//     jest.spyOn(models.User, 'create').mockResolvedValueOnce(mUser);
//     const mUserRole: any = { id: 1, role: 'admin' };
//     jest.spyOn(models.UserRole, 'create').mockResolvedValueOnce(mUserRole);
//     const email = 'example@gmail.com';
//     const encryptedPassword = '123';
//     await createUser(email, encryptedPassword);
//     expect(models.User.create).toBeCalledWith({ email, password: encryptedPassword });
//     expect(models.UserRole.create).toBeCalledWith({ role: 'admin' });
//     expect(mUser.setUserRole).toBeCalledWith(mUserRole);
//   });
// });
// describe("test add function", () => {
//   it("should return 15 for add(10,5)", () => {
//     expect(10 + 15).toBe(25);
//   });
//   it("should return 5 for add(2,3)", () => {
//     expect(2 + 3).toBe(5);
//   });
// });
// describe("test mul function", () => {
//   it("should return 15 for mul(3,5)", () => {
//     expect(3 * 5).toBe(15);
//   });
// });
//# sourceMappingURL=order.test.js.map