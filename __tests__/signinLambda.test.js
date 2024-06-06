const signInLambda = require('../amplify/backend/function/bitbustersUserpoolDevPreAuthentication/src/custom');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');

//jest.mock('node-fetch');


let testPasswordHash;

beforeAll(async () => {
    testPasswordHash = await new Promise((resolve, reject) => {
      bcrypt.hash('testpassword', 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });


describe('Authentication Lambda Function', () => {
    test('should authenticate user with correct credentials', async () => {
        const event = {
            userName: 'kevinvalentin@example.com',
            request: {
                userAttributes: {
                    email_verified: true,
                },
                password: 'MyVerySecurePass543',
            },
        };

        // Mock the fetch method to return a mock response with passwordHash
        /*fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ passwordHash: testPasswordHash }),
        });*/

        const result = await signInLambda.handler(event, null);

        expect(result).toBeDefined();
        expect(result).toHaveProperty('userName', 'kevinvalentin@example.com');
        // Add more assertions as needed based on the expected behavior of your Lambda function
    });

    test('should throw error for invalid credentials', async () => {
        const event = {
            userName: 'kevinvalentin@example.com',
            request: {
                userAttributes: {
                    email_verified: true,
                },
                password: 'wrongpassword',
            },
        };

        /*// Mock the fetch method to return a mock response with passwordHash
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ passwordHash: testPasswordHash }),
        });*/

        await expect(signInLambda.handler(event, null)).rejects.toThrow('Invalid credentials');
    });

    // Add more test cases as needed
});