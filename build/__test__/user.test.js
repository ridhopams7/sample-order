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
    username: "ridho",
    password: "P@ssword"
};
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpZGhvIiwidXNlcklkIjoyLCJsb2dpblRpbWUiOiIyMDIxLTA4LTEwVDA3OjQ2OjA2Ljg5N1oiLCJuYW1lIjoicmlkaG8uY2F0dXJAZWNvbWluZG8uY29tIiwiaWF0IjoxNjI4NTgxNTY2fQ.5foG2y1YoQWnHSG8Ny1Lt2AkHv1cVtett-l9VA8-3jc";
jest.setTimeout(12000);
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = yield instance.createServer();
}));
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
        "password": "mockDataPassword",
        "email": "mockDataPassword.com",
        "address": "test",
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
//# sourceMappingURL=user.test.js.map