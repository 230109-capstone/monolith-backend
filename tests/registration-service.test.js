const { retrieveUserByUsername, addUser } = require('../dao/user-dao');
const RegistrationError = require('../errors/registration-error');
const { register } = require('../service/auth-service');

jest.mock('../dao/user-dao', function () {
    return {
        addUser: jest.fn(),
    };
});
jest.mock('../dao/user-dao', function () {
    return {
        retrieveUserByUsername: jest.fn(),
    };
});

describe('Registration Tests', () => {
    test('Username Provided is not proper length', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        await expect(register('iam', 'thisissufficient!')).rejects.toThrow(RegistrationError);
    });

    test('Password Provided is not proper length', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        await expect(register('iam8characters', 'this')).rejects.toThrow(RegistrationError);
    });

    test('Password does not contain special character', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        await expect(register('iam8characters', 'thisissufficient')).rejects.toThrow(RegistrationError);
    });

    test('Username exists', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({
                Item: {
                    username: 'iam8characters',
                    password: 'thisissufficient!',
                }
            })
        );
        await expect(register('iam8characters', 'thisissufficient!')).rejects.toThrow(RegistrationError);
    });

    test('Successful Registration', async() => {
        retrieveUserByUsername.mockReturnValueOnce(
            Promise.resolve({})
        );
        await expect(register('iam8characters', 'thisissufficient!'));
    });
})