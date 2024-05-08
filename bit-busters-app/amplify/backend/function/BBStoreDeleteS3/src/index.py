import json
import boto3
import uuid
import mimetypes
import base64
import re

s3 = boto3.client('s3')

bucket_name = 'bbbucket193521-dev'

def upload_to_s3(bucket_name, file_content, target_folder, file_extension):
    try:
        # Generate a unique file key with the specified file extension
        file_key = f'public/{target_folder}/{uuid.uuid4().hex}.{file_extension}'
        
        # Determine the MIME type based on file extension
        mime_type, _ = mimetypes.guess_type(f'file.{file_extension}')
        # Fallback to a generic type if the MIME type can't be determined
        if not mime_type:
            mime_type = 'application/octet-stream'

        # Upload the file to S3 with the specified MIME type
        s3.put_object(
            Body=file_content,
            Bucket=bucket_name,
            Key=file_key,
            ContentType=mime_type
        )
        
        # Construct the URL of the uploaded file
        uploaded_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"
        return uploaded_url
    except Exception as e:
        print(f"Error uploading file to S3: {e}")
        raise e

def delete_from_s3(bucket_name, file_key):
    try:
        s3.delete_object(Bucket=bucket_name, Key=file_key)
        # Check if the object still exists
        head_response = s3.head_object(Bucket=bucket_name, Key=file_key)
        if head_response:
            print(f"Error: The object {file_key} still exists in the bucket.")
        else:
            print(f"Successfully deleted object {file_key} from bucket {bucket_name}.")
    except Exception as e:
        print(f"Error deleting object {file_key} from bucket {bucket_name}: {e}")

def handler(event, context):
    try:
        http_method = event.get('httpMethod')
        path = event.get('path')

        if not http_method or not path:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                }, 
                'body': json.dumps({
                    'message': 'Invalid request'
                })
            }
        
        if path.startswith('/s3bucket/images'):
            if http_method == 'POST':
                # Parse the body of the request
                body = json.loads(event.get('body', '{}'))
                
                # Validate the request body
                if not body:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        },  
                        'body': json.dumps({
                            'message': 'Invalid request body'
                        })
                    }
                
                # Dictionary to store the response data
                response_data = {}
                
                # Iterate through the pipes and their associated image data
                for pipe, image_urls in body.items():
                    response_data[pipe] = {}
                    for key, image_url in image_urls.items():
                        try:
                            try:
                                # Split the data URL into header and encoded content
                                try:
                                    header, encoded = image_url.split(",", 1)
                                except ValueError:
                                    return {
                                        'statusCode': 400, 
                                        'headers': {
                                            'Access-Control-Allow-Headers': '*',
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                                        }, 
                                        'body': json.dumps({
                                            'message': 'Invalid image data format'
                                        })
                                    }

                                # Decode the Base64 content
                                try:
                                    decoded_content = base64.b64decode(encoded)
                                except base64.binascii.Error as b64_error:
                                    return {
                                        'statusCode': 400,
                                        'headers': {
                                            'Access-Control-Allow-Headers': '*',
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                                        },  
                                        'body': json.dumps({
                                            'message': f'Error decoding Base64 data: {b64_error}'
                                        })
                                    }
                                
                                # Process the MIME type and file extension 
                                mime_type_match = re.search(r'data:(image/[^;]+);', header)
                                if mime_type_match:
                                    mime_type = mime_type_match.group(1)
                                    file_extension = mime_type.split('/')[-1]
                                else:
                                    return {
                                        'statusCode': 400, 
                                        'headers': {
                                            'Access-Control-Allow-Headers': '*',
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                                        }, 
                                        'body': json.dumps({
                                            'message': 'Invalid MIME type in data'
                                        })
                                    }

                                # Upload the decoded content
                                uploaded_url = upload_to_s3(bucket_name, decoded_content, 'Images', file_extension)
                                
                                return {
                                    'statusCode': 200,
                                    'headers': {
                                        'Access-Control-Allow-Headers': '*',
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                                    }, 
                                    'body': json.dumps({
                                        'message': 'Image uploaded successfully',
                                        'uploaded_url': uploaded_url
                                    })
                                }
                            except Exception as e:
                                print(f"Error processing data URL: {e}")
                                return {
                                    'statusCode': 500,
                                    'headers': {
                                        'Access-Control-Allow-Headers': '*',
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                                    },  
                                    'body': json.dumps({
                                        'message': 'Internal server error'
                                    })
                                }

                        except Exception as e:
                            # Handle unexpected exceptions and log the error
                            print(f"Error processing image URL {image_url}: {e}")
                            response_data[pipe][key] = f"Error: {e}"
                
                # Return the response data as JSON
                return {
                    'statusCode': 200, 
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                    }, 
                    'body': json.dumps(response_data)
                }

            elif http_method == 'DELETE':
                body = json.loads(event.get('body', '{}'))
                if not body:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        },  
                        'body': json.dumps({
                            'message': 'Invalid request body'
                        })
                    }
                
                image_key = body.get('image_key')
                if not image_key:
                    return {
                        'statusCode': 400, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Missing image_key'
                        })
                    }
                
                try:
                    delete_from_s3(bucket_name, image_key)
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        },    
                        'body': json.dumps({'message': f'Image {image_key} deleted successfully'})
                    }
                except Exception as e:
                    print(f"Error deleting image: {e}")
                    return {
                        'statusCode': 500, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Error deleting image'
                        })
                    }
            
            else:
                return {
                    'statusCode': 400, 
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                    }, 
                    'body': json.dumps({
                        'message': 'Invalid operation'
                    })
                }
        
        elif path.startswith('/s3bucket/signatures'):
            if http_method == 'POST':
                body = json.loads(event.get('body', '{}'))
                if not body:
                    return {
                        'statusCode': 400, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Invalid request body'
                        })
                    }
                
                # Get the data URL from the body
                data_url = body.get('signature_data_url')
                if not data_url:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        },  
                        'body': json.dumps({
                            'message': 'Missing signature data URL'
                        })
                    }
                
                try:
                    # Split the data URL into header and encoded content
                    try:
                        header, encoded = data_url.split(",", 1)
                    except ValueError:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            },  
                            'body': json.dumps({
                                'message': 'Invalid signature data format'
                            })
                        }

                    # Decode the Base64 content
                    try:
                        decoded_content = base64.b64decode(encoded)
                    except base64.binascii.Error as b64_error:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            },  
                            'body': json.dumps({
                                'message': f'Error decoding Base64 data: {b64_error}'
                            })
                        }
                    
                    # Process the MIME type and file extension 
                    mime_type_match = re.search(r'data:(image/[^;]+);', header)
                    if mime_type_match:
                        mime_type = mime_type_match.group(1)
                        file_extension = mime_type.split('/')[-1]
                    else:
                        return {
                            'statusCode': 400, 
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            }, 
                            'body': json.dumps({
                                'message': 'Invalid MIME type in data URL'
                            })
                        }

                    # Upload the decoded content
                    uploaded_url = upload_to_s3(bucket_name, decoded_content, 'Signatures', file_extension)
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Signature uploaded successfully',
                            'uploaded_url': uploaded_url
                        })
                    }
                except Exception as e:
                    print(f"Error processing data URL: {e}")
                    return {
                        'statusCode': 500, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Internal server error'
                        })
                    }

            elif http_method == 'PUT':
                body = json.loads(event.get('body', '{}'))
                if not body:
                    return {
                        'statusCode': 400, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Invalid request body'
                        })
                    }
                
                old_signature_key = body.get('old_signature_key')
                new_signature_data_url = body.get('new_signature_data_url')
                
                if not old_signature_key or not new_signature_data_url:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        },  
                        'body': json.dumps({
                            'message': 'Missing old_signature_key or new_signature_data_url'
                        })
                    }
                
                try:
                    # Split the data URL into header and encoded content
                    try:
                        header, encoded = new_signature_data_url.split(",", 1)
                    except ValueError:
                        return {
                            'statusCode': 400, 
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            }, 
                            'body': json.dumps({
                                'message': 'Invalid signature data format'
                            })
                        }
                    try:
                        decoded_content = base64.b64decode(encoded)
                    except base64.binascii.Error as b64_error:
                        return {
                            'statusCode': 400, 
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            }, 
                            'body': json.dumps({
                                'message': f'Error decoding Base64 data: {b64_error}'
                            })
                        }
                    
                    # Determine the MIME type and file extension from the header
                    mime_type_match = re.search(r'data:(image/[^;]+);', header)
                    if mime_type_match:
                        mime_type = mime_type_match.group(1)
                        file_extension = mime_type.split('/')[-1]
                    else:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            },  
                            'body': json.dumps({
                                'message': 'Invalid MIME type in data URL'
                            })
                        }
                    
                    # Delete the old signature from S3
                    delete_from_s3(bucket_name, old_signature_key)
                    
                    # Upload the new signature to S3
                    new_uploaded_url = upload_to_s3(bucket_name, decoded_content, 'Signatures', file_extension)
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Signature updated successfully',
                            'updated_url': new_uploaded_url
                        })
                    }
                except Exception as e:
                    print(f"Error updating signature: {e}")
                    return {
                        'statusCode': 500, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': f'Internal server error: {e}'
                        })
                    }
            
            elif http_method == 'DELETE':
                body = json.loads(event.get('body', '{}'))
                if not body:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        },  
                        'body': json.dumps({
                            'message': 'Invalid request body'
                        })
                    }
                
                signature_key = body.get('signature_key')
                if not signature_key:
                    return {
                        'statusCode': 400, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Missing signature_key'
                        })
                    }
                
                try:
                    delete_from_s3(bucket_name, signature_key)
                    return {
                        'statusCode': 200, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({'message': f'Signature {signature_key} deleted successfully'})
                    }
                except Exception as e:
                    print(f"Error deleting image: {e}")
                    return {
                        'statusCode': 500, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Error deleting signature'
                        })
                    }

            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                    },  
                    'body': json.dumps({
                        'message': 'Invalid operation'
                    })
                }

        elif event['path'].startswith('/s3bucket/reports'):
            if event['httpMethod'] == 'POST': 
                body = json.loads(event.get('body', '{}'))
                if not body:
                    return {
                        'statusCode': 400, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Invalid request body'
                        })
                    }
                
                # Get the PDF data URL from the body
                pdf_data_url = body.get('pdf_data_url')
                if not pdf_data_url:
                    return {
                        'statusCode': 400, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Missing PDF data URL'
                        })
                    }
                try:
                    # Split the data URL into header and encoded content
                    try:
                        header, encoded = pdf_data_url.split(",", 1)
                    except ValueError:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            },  
                            'body': json.dumps({
                                'message': 'Invalid pdf data URL format'
                            })
                        }

                    # Decode the Base64 content
                    try:
                        decoded_content = base64.b64decode(encoded)
                    except base64.binascii.Error as b64_error:
                        return {
                            'statusCode': 400, 
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            }, 
                            'body': json.dumps({
                                'message': f'Error decoding Base64 data: {b64_error}'
                            })
                        }
                    
                    # Process the MIME type and file extension 
                    mime_type_match = re.search(r'data:(application/[^;]+);', header)
                    if mime_type_match:
                        mime_type = mime_type_match.group(1)
                        file_extension = mime_type.split('/')[-1]
                    else:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            },  
                            'body': json.dumps({
                                'message': 'Invalid MIME type in data URL'
                            })
                        }

                    # Upload the decoded content
                    uploaded_url = upload_to_s3(bucket_name, decoded_content, 'Reports', file_extension)

                    return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                            }, 
                            'body': json.dumps({
                                'message': 'Report uploaded successfully',
                                'uploaded_url': uploaded_url
                            })
                        }
                except Exception as e:
                    print(f"Error processing data URL: {e}")
                    return {
                        'statusCode': 500, 
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                        }, 
                        'body': json.dumps({
                            'message': 'Internal server error'
                        })
                    }
                
            else:
                return {
                    'statusCode': 400, 
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                    }, 
                    'body': json.dumps({
                        'message': 'Invalid operation'
                    })
                }

        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
                },  
                'body': json.dumps({
                    'message': 'Invalid path'
                })
            }
    
    except Exception as e:
        print(f"Unhandled error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
            },  
            'body': json.dumps({
                'message': 'Internal server error'
            })
        }
