import json
import mysql.connector

def handler(event, context):
    # Validate HTTP method
    http_method = event.get('httpMethod', '')
    if http_method not in {'GET', 'POST', 'PUT'}: # Changed this to remove DELETE method
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
            # Handle GET request
            path_params = event.get('pathParameters', {})
            if path_params:
                address_id = path_params.get('proxy')
                if address_id:
                    # Fetch address by ID
                    query = "SELECT * FROM Address WHERE Address_ID = %s"
                    cursor.execute(query, (address_id,))
                    address_data = cursor.fetchone()

                    if address_data:
                        address_dict = {
                            'Address_ID': address_data[0],
                            'Country': address_data[1],
                            'u_State': address_data[2],
                            'City': address_data[3],
                            'Street': address_data[4],
                            'DoorNumber': address_data[5],
                            'ZipCode': address_data[6]
                        }
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'address': address_dict})
                        }
                    else:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'Address not found'})
                        }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'address_id is required for GET request'})
                    }
            else:
                # No path parameters provided, fetch all addresses
                query = "SELECT * FROM Address"
                cursor.execute(query)
                all_addresses = cursor.fetchall()

                if all_addresses:
                    addresses_list = []
                    for address_data in all_addresses:
                        address_dict = {
                            'Address_ID': address_data[0],
                            'Country': address_data[1],
                            'u_State': address_data[2],
                            'City': address_data[3],
                            'Street': address_data[4],
                            'DoorNumber': address_data[5],
                            'ZipCode': address_data[6]
                        }
                        addresses_list.append(address_dict)

                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'addresses': addresses_list})
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'No addresses found'})
                    }

        elif http_method == 'POST':
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
            # Handle POST request
            data = json.loads(event['body'])
            required_fields = ['Country', 'u_State', 'City', 'Street', 'DoorNumber', 'ZipCode']
            if all(data.get(field) is not None for field in required_fields):
                country = data.get('Country')
                state = data.get('u_State')
                city = data.get('City')
                street = data.get('Street')
                doornumber = data.get('DoorNumber')
                zipcode = data.get('ZipCode')
                # Insert new address
                insert_query = "INSERT INTO Address (Country, u_State, City, Street, DoorNumber, ZipCode) VALUES (%s, %s, %s, %s, %s, %s)"
                insert_values = (country,state,city,street,doornumber,zipcode)
                cursor.execute(insert_query, insert_values)
                cnx.commit()

                # Get the last inserted Address_ID
                cursor.execute("SELECT LAST_INSERT_ID()")
                address_id = cursor.fetchone()[0]

                # Fetch the inserted address data using the Address_ID
                select_query = "SELECT * FROM Address WHERE Address_ID = %s"
                cursor.execute(select_query, (address_id,))
                created_address = cursor.fetchone()

                address_dict = {
                    'Address_ID': created_address[0],
                    'Country': created_address[1],
                    'u_State': created_address[2],
                    'City': created_address[3],
                    'Street': created_address[4],
                    'DoorNumber': created_address[5],
                    'ZipCode': created_address[6]
                }

                return {
                    'statusCode': 201,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'message': 'Address created successfully', 'address': address_dict})
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

        elif http_method == 'PUT':
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
            # Handle PUT request
            path_params = event.get('pathParameters', {})
            if path_params:
                address_id = path_params.get('proxy')
                if not address_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'address_id is required for PUT request'})
                    }

                # Verify if address_id exists
                cursor.execute("SELECT Address_ID FROM Address WHERE Address_ID = %s", (address_id,))
                result = cursor.fetchone()
                if not result:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Address not found'})
                    }

                data = json.loads(event['body'])
                required_fields = ['Country', 'u_State', 'City', 'Street', 'DoorNumber', 'ZipCode']
                if all(data.get(field) is not None for field in required_fields):
                    country = data.get('Country')
                    state = data.get('u_State')
                    city = data.get('City')
                    street = data.get('Street')
                    doornumber = data.get('DoorNumber')
                    zipcode = data.get('ZipCode')
                    # Update existing address
                    update_query = "UPDATE Address SET Country = %s, u_State = %s, City = %s, Street = %s, DoorNumber = %s, ZipCode = %s WHERE Address_ID = %s"
                    update_values = (country, state, city, street, doornumber, zipcode, address_id)
                    cursor.execute(update_query, update_values)
                    cnx.commit()

                    # Fetch the inserted address data
                    select_query = "SELECT * FROM Address WHERE Address_ID = %s"
                    cursor.execute(select_query, (address_id,))
                    updated_address = cursor.fetchone()

                    address_dict = {
                        'Address_ID': updated_address[0],
                        'Country': updated_address[1],
                        'u_State': updated_address[2],
                        'City': updated_address[3],
                        'Street': updated_address[4],
                        'DoorNumber': updated_address[5],
                        'ZipCode': updated_address[6]
                    }

                    if cursor.rowcount > 0:
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'message': 'Address updated successfully', 'address': address_dict})
                        }
                    else:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'Update failed'})
                        }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Missing required fields in request body'})
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

        # elif http_method == 'DELETE':
        #     # Handle DELETE request
        #     path_params = event.get('pathParameters', {})
        #     if path_params:
        #         address_id = path_params.get('proxy')
        #         if not address_id:
        #             return {
        #                 'statusCode': 400,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'address_id is required for DELETE request'})
        #             }

        #         # Delete address
        #         delete_query = "DELETE FROM Address WHERE Address_ID = %s"
        #         cursor.execute(delete_query, (address_id,))
        #         cnx.commit()
        #         if cursor.rowcount > 0:
        #             return {
        #                 'statusCode': 200,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'message': 'Address deleted successfully'})
        #             }
        #         else:
        #             return {
        #                 'statusCode': 404,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'Address not found or deletion failed'})
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
