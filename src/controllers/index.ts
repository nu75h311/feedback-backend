// const usingMockDb = (process.env.USE_MOCK_DB || '').toLowerCase();
// let userControllerPath = './User/UserController';

// if (usingMockDb === 'true') {
//     userControllerPath += '.mock';
// }

// // tslint:disable:no-var-requires
// export const { UserController } = require(userControllerPath);
export * from './users.controller';