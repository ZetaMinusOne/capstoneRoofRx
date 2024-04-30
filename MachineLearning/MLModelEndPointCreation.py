import boto3

region = 'us-east-1'

client = boto3.client("sagemaker", region_name=region)

response_config = client.create_endpoint_config(
   EndpointConfigName="bitbusters-mlmodel-endpoint-config",
   ProductionVariants=[
        {
            "ModelName": "bitbusters-model-version-one",
            "VariantName": "AllTraffic",
            "ServerlessConfig": {
                "MemorySizeInMB": 2048,
                "MaxConcurrency": 20,
                "ProvisionedConcurrency": 10,
            }
        } 
    ]
)

response_creation = client.create_endpoint(
    EndpointName="bitbusters-mlmodel-endpoint",
    EndpointConfigName="bitbusters-mlmodel-endpoint-config"
)

# Store information from response_config and response_creation into a text file
with open("endpoint_info.txt", "w+") as file:
    # Write information about endpoint configuration response
    file.write("Endpoint Configuration ARN: {}\n".format(response_config["EndpointConfigArn"]))
    
    # Write information about endpoint creation response
    file.write("Endpoint ARN: {}\n".format(response_creation["EndpointArn"]))
    file.write("Endpoint Status: {}\n".format(response_creation["EndpointStatus"]))

print("Information saved to endpoint_info.txt")
