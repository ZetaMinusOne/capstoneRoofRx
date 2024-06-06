/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event, context) => {
  try {
    // Determine the trigger source (e.g., 'ForgotPassword')
    const triggerSource = event.triggerSource;

    if (triggerSource === "CustomMessage_SignUp") {
      const message = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <p style="color: #666666;">Thank you for signing up!</p>
        <p style="color: #666666;">Your confirmation code is: <strong>${event.request.codeParameter}</strong></p>
        <p style="color: #666666;"><strong>THIS TOKEN EXPIRES AFTER 24 HOURS</strong></p>
      </div>
    `;
      //event.response.smsMessage = message;
      event.response.emailMessage = message;
      event.response.emailSubject = "Welcome to RoofRX Roof Pipes Inspection App";
    }
    // Check if the trigger source is 'ForgotPassword'
    if (triggerSource === 'CustomMessage_ForgotPassword') {

        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333333;">Password Reset Request</h2>
          <p style="color: #666666;">You have requested to reset your password.</p>
          <p style="color: #666666;">Your reset token is: <strong>${event.request.codeParameter}</strong></p>
          <p style="color: #666666;"><strong>THIS TOKEN EXPIRES AFTER 1 HOUR</strong></p>
        </div>
      `;

        event.response.emailMessage = message;
        event.response.emailSubject = 'Password Reset Request';

        console.log('Password reset email sent successfully.');
    }

    if (triggerSource === "CustomMessage_ResendCode") {
      const message = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h2 style="color: #333333;">Confirmation Code</h2>
        <p style="color: #666666;">Your confirmation code is: <strong>${event.request.codeParameter}</strong></p>
        <p style="color: #666666;"><strong>THIS TOKEN EXPIRES AFTER 30 MINUTES</strong></p>
      </div>
    `;
      //event.response.smsMessage = message;
      event.response.emailMessage = message;
      event.response.emailSubject = "Confirmation Code";
    }
    // For other trigger sources, simply return the event
    return event;

  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};