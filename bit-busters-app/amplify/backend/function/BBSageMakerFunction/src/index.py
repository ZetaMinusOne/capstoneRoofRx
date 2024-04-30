import json
import boto3
from PIL import Image
import numpy as np
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed

# Create a SageMaker runtime client
sagemaker_client = boto3.client('sagemaker-runtime', aws_access_key_id='AKIAR7NCUGFH5QXSLHUT', aws_secret_access_key='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')
s3_client = boto3.client('s3')

def download_and_preprocess_image(url):
    
    # Split the URL by the '/' character and get the list of parts
    parts = url.split('/')
    
    # The bucket name is the third part after the protocol (https://) and before '.s3.amazonaws.com'
    bucket_name = parts[2].split('.')[0]
    
    # The object key is the remaining parts after the bucket name
    object_key = '/'.join(parts[3:])

    # Download the image from S3
    response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
    
    # Check if the response is successful
    if response['ResponseMetadata']['HTTPStatusCode'] != 200:
        raise Exception(f"Failed to download image. Status code: {response['ResponseMetadata']['HTTPStatusCode']}")
        
    image_data = response['Body'].read()
    
    # Open the image using PIL
    image = Image.open(BytesIO(image_data))
    # Convert the image mode to RGB
    image = image.convert('RGB')
    # Resize the image to match the model's input size (200x200)
    image_resized = image.resize((200, 200))
    # Convert the image to numpy array and normalize pixel values
    image_array = np.array(image_resized) / 255.0
    
    return image_array
    
def invoke_endpoint(url):
    # Download and preprocess image from URL
    processed_image = download_and_preprocess_image(url)

    # Invoke the SageMaker endpoint with the processed image data
    response = sagemaker_client.invoke_endpoint(
        EndpointName='bitbusters-mlmodel-endpoint',
        Body=json.dumps({"instances": [processed_image.tolist()]}),
        ContentType='application/json',
        Accept='application/json'
    )

    # Parse and process the response
    result = json.loads(response['Body'].read().decode('utf-8'))
    
    # Create a dictionary for the current prediction
    prediction_dict = {"url": url, "predictions": result['predictions'][0]}

    return prediction_dict

def handler(event, context):
    try:
        print(f"This is the event: {event}")
        
        # Parse input JSON directly from the Lambda event
        input_data = json.loads(event['body'])

        http_method = event.get('httpMethod', '')

        if(http_method == 'POST'):
                
            # Initialize dictionary to store predictions
            predictions = {}
            
            # Create a thread pool
            with ThreadPoolExecutor() as executor:
                # Process each pipe
                for pipe, urls_dict in input_data.items():
                    # Initialize list to store predictions for each URL
                    predictions[pipe] = []

                    # Submit tasks for each URL to the thread pool
                    futures = [executor.submit(invoke_endpoint, url) for url in urls_dict.values()]

                    # Retrieve results from the completed tasks
                    for future in as_completed(futures):
                        result = future.result()
                        predictions[pipe].append(result)
                    
            print(f"This is the resulting JSON: {json.loads(json.dumps(predictions))}")

            # Return response with predictions
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(predictions)
            }
        else:
            return{
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': f'Invalid CRUD Operation: {http_method} (Expects POST)'})
            }

    except Exception as e:
        # Handle any exceptions and return an error response
        return {
            'statusCode': 500,
            'body': str(e)
        }
