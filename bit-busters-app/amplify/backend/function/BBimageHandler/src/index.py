import json
import mysql.connector
from datetime import datetime

def handler(event, context):
    # Validate HTTP method
    http_method = event.get('httpMethod', '')
    if http_method not in {'GET', 'POST'}: # Changed this to remove PUT and DELETE methods
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
            },
            'body': json.dumps({'error': 'Unsupported HTTP method'})
        }

    # Connect to the database
    try:
        cnx = mysql.connector.connect(
            host='bb-database.cwxttscjfrje.us-east-1.rds.amazonaws.com',
            user='admin',
            password='v8Bdpo_41m',
            database='BitBustersDB'
        )

        cursor = cnx.cursor()

        if http_method == 'GET':
            # Handle GET request for images
            path = event.get('path', '')
            if path.startswith('/images/report'):
                path_params = event.get('pathParameters', {})
                if path_params:
                    # Fetch images by Report_ID
                    report_id = path_params.get('proxy')
                    if report_id:
                        # Verify if report_id exists
                        cursor.execute("SELECT * FROM Report WHERE Report_ID = %s", (report_id,))
                        report_data = cursor.fetchone()
                        if report_data:
                            query = "SELECT * FROM Image WHERE Report_ID = %s"
                            cursor.execute(query, (report_id,))
                            images_list = []
                            
                            for row in cursor.fetchall():
                                image_dict = {
                                    'Image_ID': row[0],
                                    'Report_ID': row[1],
                                    'i_URL': row[2],
                                    'is_Broken': bool(row[3]),
                                    'pipeName': row[4]
                                }
                                images_list.append(image_dict)

                            return {
                                'statusCode': 200,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'images': images_list})
                            }
                        else:
                            return {
                                'statusCode': 404,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'error': 'Report not found'})
                            }
                    else:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'report_id is required for GET request'})
                        }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Missing path parameter proxy'})
                    }
                    
            elif path.startswith('/images'):
                path_params = event.get('pathParameters', {})
                if path_params:
                    # Fetch image by Image_ID
                    image_id = path_params.get('proxy')
                    
                    if image_id:
                        query = "SELECT * FROM Image WHERE Image_ID = %s"
                        cursor.execute(query, (image_id,))
                        row = cursor.fetchone()
                        
                        if row:
                            image_dict = {
                                'Image_ID': row[0],
                                'Report_ID': row[1],
                                'i_URL': row[2],
                                'is_Broken': bool(row[3]),
                                'pipeName': row[4]
                            }
                            return {
                                'statusCode': 200,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'image': image_dict})
                            }
                        else:
                            return {
                                'statusCode': 404,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'error': 'Image not found'})
                            }
                    else:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'image_id is required for GET request'})
                        }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Missing path parameter proxy'})
                    }
            else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Invalid path'})
                    }

        elif http_method == 'POST':
            path = event.get('path', '')
            if path.startswith('/images'):
                # Handle POST request to add an image
                if 'body' not in event or not event['body']:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Empty request body'})
                    }
                data = json.loads(event['body'])
                required_fields = ['Report_ID', 'images']  
                if all(data.get(field) is not None for field in required_fields):
                    report_id = data.get('Report_ID')

                    # Check if Report_ID exists in the Report table
                    report_query = "SELECT Report_ID FROM Report WHERE Report_ID = %s"
                    cursor.execute(report_query, (report_id,))
                    existing_report = cursor.fetchone()
                    if not existing_report:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'Report with given Report_ID does not exist'})
                        }

                    images = data.get('images')  

                    # Insert the new images into the database
                    for image in images:
                        i_url = image.get('i_URL')
                        is_broken = image.get('is_Broken', 0)  # Default to 0 if not provided
                        pipe_Name = image.get('pipeName') 
                        insert_query = "INSERT INTO Image (Report_ID, i_URL, is_Broken, pipeName) VALUES (%s, %s, %s, %s)"
                        insert_values = (report_id, i_url, is_broken, pipe_Name)
                        cursor.execute(insert_query, insert_values)
                    cnx.commit()

                    return {
                        'statusCode': 201,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'message': 'Images added successfully'})
                    }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Missing or null values in request'})
                    }
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'error': 'Invalid path'})
                }

        # elif http_method == 'PUT':
        #     # Handle PUT request to update an image
        #     path = event.get('path', '')
        #     if path == '/images':
        #         path_params = event.get('pathParameters', {})
        #         if path_params:
        #             image_id = path_params.get('proxy')
        #             if image_id:
        #                 if 'body' not in event or not event['body']:
        #                     return {
        #                         'statusCode': 400,
        #                         'headers': {
        #                             'Access-Control-Allow-Headers': '*',
        #                             'Access-Control-Allow-Origin': '*',
        #                             'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                         },
        #                         'body': json.dumps({'error': 'Empty request body'})
        #                     }
        #                 data = json.loads(event['body'])
        #                 report_id = data.get('Report_ID')
        #                 i_url = data.get('i_URL')
        #                 is_broken = data.get('is_Broken')

        #                 if any(value is None for value in [report_id, i_url, is_broken]):
        #                     return {
        #                         'statusCode': 400,
        #                         'headers': {
        #                             'Access-Control-Allow-Headers': '*',
        #                             'Access-Control-Allow-Origin': '*',
        #                             'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                         },
        #                         'body': json.dumps({'error': 'Missing required fields in request body'})
        #                     }

        #                 # Update the image in the database
        #                 update_query = "UPDATE Image SET Report_ID=%s, i_URL=%s, is_Broken=%s WHERE Image_ID=%s"
        #                 update_values = (report_id, i_url, is_broken, image_id)
        #                 cursor.execute(update_query, update_values)
        #                 cnx.commit()

        #                 return {
        #                     'statusCode': 200,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'message': 'Image updated successfully'})
        #                 }
        #             else:
        #                 return {
        #                     'statusCode': 400,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'error': 'image_id is required for PUT request'})
        #                 }
        #         else:
        #             return {
        #                 'statusCode': 400,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'Missing path parameter proxy'})
        #             }
        #     else:
        #         return {
        #                 'statusCode': 400,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'Invalid path'})
        #             }

        # elif http_method == 'DELETE':
        #     # Handle DELETE request to delete an image
        #     path = event.get('path', '')
        #     path_params = event.get('pathParameters', {})
        #     if path_params:
        #         if path == '/images/report':
        #             # Delete all images associated with a report_id
        #             report_id = path_params.get('proxy')
                    
        #             if report_id:
        #                 delete_query = "DELETE FROM Image WHERE Report_ID=%s"
        #                 delete_values = (report_id,)
        #                 cursor.execute(delete_query, delete_values)
        #                 cnx.commit()

        #                 if cursor.rowcount > 0:
        #                     return {
        #                         'statusCode': 200,
        #                         'headers': {
        #                             'Access-Control-Allow-Headers': '*',
        #                             'Access-Control-Allow-Origin': '*',
        #                             'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                         },
        #                         'body': json.dumps({'message': 'Images deleted successfully'})
        #                     }
        #                 else:
        #                     return {
        #                         'statusCode': 404,
        #                         'headers': {
        #                             'Access-Control-Allow-Headers': '*',
        #                             'Access-Control-Allow-Origin': '*',
        #                             'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                         },
        #                         'body': json.dumps({'error': 'No images found or deletion failed'})
        #                     }
        #             else:
        #                 return {
        #                     'statusCode': 400,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'error': 'report_id is required for DELETE request'})
        #                 }
        #         elif path == '/images':
        #             # Delete an image by Image_ID
        #             image_id = path_params.get('proxy')
                    
        #             if image_id:
        #                 delete_query = "DELETE FROM Image WHERE Image_ID=%s"
        #                 delete_values = (image_id,)
        #                 cursor.execute(delete_query, delete_values)
        #                 cnx.commit()

        #                 if cursor.rowcount > 0:
        #                     return {
        #                         'statusCode': 200,
        #                         'headers': {
        #                             'Access-Control-Allow-Headers': '*',
        #                             'Access-Control-Allow-Origin': '*',
        #                             'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                         },
        #                         'body': json.dumps({'message': 'Image deleted successfully'})
        #                     }
        #                 else:
        #                     return {
        #                         'statusCode': 404,
        #                         'headers': {
        #                             'Access-Control-Allow-Headers': '*',
        #                             'Access-Control-Allow-Origin': '*',
        #                             'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                         },
        #                         'body': json.dumps({'error': 'Image not found or deletion failed'})
        #                     }
        #             else:
        #                 return {
        #                     'statusCode': 400,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'error': 'image_id is required for DELETE request'})
        #                 }
        #         else:
        #             return {
        #                 'statusCode': 400,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'Invalid path'})
        #             }
        #     else:
        #         return {
        #             'statusCode': 400,
        #             'headers': {
        #                 'Access-Control-Allow-Headers': '*',
        #                 'Access-Control-Allow-Origin': '*',
        #                 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #             },
        #             'body': json.dumps({'error': 'Missing path parameter proxy'})
        #         }

        else:
            return {'statusCode': 400, 'body': json.dumps({'message': 'Invalid operation'})}

    except mysql.connector.Error as err:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
            },
            'body': json.dumps({'error': f"MySQL Error: {err}"})
        }
    finally:
        cursor.close()
        cnx.close()
