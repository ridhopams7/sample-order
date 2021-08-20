
import * as instance from '../server';
import  SequelizeMock  from 'sequelize-mock';
import { UserService } from '../modules/services/user-service';


describe('user: insert', () => {
    const dbMock = new SequelizeMock();
  const dataMock = {
    "username": "mockUsername",
    "password": "mockPassword",
    "email": "mockPassword.com",
    "address": "test",
    "createdBy": "mockLogin",
  }

  const userService = new UserService(dbMock);

  jest.spyOn(userService, 'insert')

  it('should insert data', async () => {
      const inserData = await userService.insert(dataMock);
      expect(inserData).toEqual('mockUsername');
      expect(userService.insert).toHaveBeenCalledTimes(1);
  })

});

