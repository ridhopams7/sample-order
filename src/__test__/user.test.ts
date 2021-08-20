
import * as instance from '../server';

const mockLoginData = {
  username: "ridho",
  password: "P@ssword"
};

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpZGhvIiwidXNlcklkIjoyLCJsb2dpblRpbWUiOiIyMDIxLTA4LTEwVDA3OjQ2OjA2Ljg5N1oiLCJuYW1lIjoicmlkaG8uY2F0dXJAZWNvbWluZG8uY29tIiwiaWF0IjoxNjI4NTgxNTY2fQ.5foG2y1YoQWnHSG8Ny1Lt2AkHv1cVtett-l9VA8-3jc";
jest.setTimeout(12000);
let server: any;
beforeAll(async () => {
  server = await instance.createServer();
});

describe('server test', () => {

  test("GET returns 200", async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
      headers: {
        'Authorization': token
      }
    });
    expect(response.statusCode).toBe(200);
    expect(response.payload).toBe('{"hello":"world"}');

  });

});

describe('user: getAll', () => {

  test("GET returns 200", async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/user/model/getAll',
      headers: {
        'Authorization': token
      }
    });
    expect(response.statusCode).toBe(200);
    // expect(response.payload).toBe('{"hello":"world"}');

  });

});

describe('user: insert', () => {

  const dataMock = {
    "username": "mockDataUsername",
    "password": "mockDataPassword",
    "email": "mockDataPassword.com",
    "address": "test",
  }

  const dataMockResp = {
    "success": "true",
    "message": "Insert successful!",
    "data": {
      ...dataMock,
      "createdBy": mockLoginData.username
    }
}

  test("POST returns 200", async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/user/model/insert',
      headers: {
        'Authorization': token
      },
      body: dataMock
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).message).toBe('Insert successful!');

  });

});

