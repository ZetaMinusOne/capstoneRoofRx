import boto3
import sagemaker.image_uris as image_uris

# Specify the location of the model in S3
model_url = 's3://bitbusters-images-and-mlmodel-data/saved_model/saved_model_versionTwo.tar.gz'

# Specify the name of the model
model_name = 'bitbusters-model-version-one'

# Specify the region
region = 'us-east-1'  # Update with your desired region

#Role to give SageMaker permission to access AWS services.
sagemaker_role = 'arn:aws:iam::136169402703:role/service-role/AmazonSageMaker-ExecutionRole-20231027T190324'

# Get the URI of the training image for TensorFlow
framework = 'tensorflow'
framework_version = '2.14'
py_version = '3.10.11'
instance_type = 'ml.t2.medium'  # Update with your desired instance type

client = boto3.client("sagemaker", region_name=region)

#Get container image (prebuilt example)
container = image_uris.retrieve(framework, region, framework_version, py_version, instance_type, image_scope="inference")

response = client.create_model(
    ModelName = model_name,
    ExecutionRoleArn = sagemaker_role,
    Containers = [{
        "Image": container,
        "Mode": "SingleModel",
        "ModelDataUrl": model_url,
    }]
)
