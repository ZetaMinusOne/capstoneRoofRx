// Import the Lambda function you want to test
const forgotPasswordLambda = require('../amplify/backend/function/bitbustersUserpoolDevCustomMessage/src/custom');

describe('Forgot Password Lambda Function', () => {
  test('should send password reset email', async () => {
    const event = {
      triggerSource: 'ForgotPassword',
      request: {
        userAttributes: {
          email: 'jeremy.marquez@upr.edu'
        }
      }
    };

    // Mock the AWS SDK SES sendEmail method to prevent actual email sending during tests
    const mockSendEmail = jest.fn().mockResolvedValue({});
    forgotPasswordLambda.sesClient.sendEmail = mockSendEmail;
    

    const result = await forgotPasswordLambda.handler(event, null);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('request');
    expect(result.request.userAttributes.email).toBe('jeremy.marquez@upr.edu');
    // Add more assertions as needed based on the expected behavior of your Lambda function

    // Check if reset token was generated and included in the email message
    expect(mockSendEmail).toHaveBeenCalledTimes(1); // Ensure sendEmail method was called
    const sentEmailParams = mockSendEmail.mock.calls[0][0]; // Get the parameters passed to sendEmail
    expect(sentEmailParams).toHaveProperty('Message');
    const emailMessage = sentEmailParams.Message.Body.Text.Data;
    const resetTokenRegex = /Your reset token is: ([a-f0-9-]+)/; // Regular expression to match reset token
    expect(emailMessage).toMatch(resetTokenRegex); // Check if reset token is present in email message
  });
});
