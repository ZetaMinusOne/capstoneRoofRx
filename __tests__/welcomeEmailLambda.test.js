const lambdaFunction = require('../amplify/backend/function/bitbustersUserpoolDevPreSignup/src/custom');
const AWS = require('aws-sdk');

jest.mock('aws-sdk');

describe('Verification Email Lambda Function', () => {
    test('should send verification email with token', async () => {
        const event = {
            request: {
                userAttributes: {
                    email: 'test@example.com',
                    'custom:userType': 'admin',
                },
            },
        };

        const mockSendEmail = jest.fn().mockReturnValue({ promise: jest.fn() });
        lambdaFunction.ses_client.sendEmail = mockSendEmail;

        const result = await lambdaFunction.handler(event, null);

        expect(result).toBeDefined();
        expect(mockSendEmail).toHaveBeenCalledTimes(1);

        const sentEmailParams = mockSendEmail.mock.calls[0][0];
        expect(sentEmailParams).toHaveProperty('Source', 'no-reply@verificationemail.com');
        expect(sentEmailParams).toHaveProperty('Destination.ToAddresses', ['test@example.com']);

        const emailMessage = sentEmailParams.Message.Body.Text.Data;
        const verificationTokenRegex = /Your verification token is: ([a-f0-9-]+)/;
        expect(emailMessage).toMatch(verificationTokenRegex);
    });
});
