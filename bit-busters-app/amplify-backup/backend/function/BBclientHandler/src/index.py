import json
import mysql.connector

def handler(event, context):
    # Validate HTTP method
    http_method = event.get('httpMethod', '')
    if http_method not in {'GET', 'POST', 'PUT', 'DELETE'}: # Changed this to remove DELETE method
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
                client_id = path_params.get('proxy')
                if client_id:
                    # Fetch client by ID
                    query = "SELECT * FROM Client WHERE Client_ID = %s"
                    cursor.execute(query, (client_id,))
                    client_data = cursor.fetchone()

                    if client_data:
                        client_dict = {
                            'Client_ID': client_data[0],
                            'Address_ID': client_data[1],
                            'FirstName': client_data[2],
                            'LastName': client_data[3],
                            'PhoneNumber': client_data[4],
                            'Email': client_data[5]
                        }
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'client': client_dict})
                        }
                    else:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'Client not found'})
                        }
            else:
                # Fetch all clients
                query = "SELECT * FROM Client"
                cursor.execute(query)
                clients_list = []
                for row in cursor.fetchall():
                    client_dict = {
                        'Client_ID': row[0],
                        'Address_ID': row[1],
                        'FirstName': row[2],
                        'LastName': row[3],
                        'PhoneNumber': row[4],
                        'Email': row[5]
                    }
                    clients_list.append(client_dict)

                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'clients': clients_list})
                }

        elif http_method == 'POST':
            # Handle POST request
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
            required_fields = ['Address_ID', 'FirstName', 'LastName', 'PhoneNumber', 'Email']
            if all(data.get(field) is not None for field in required_fields):
                address_id = data.get('Address_ID')
                first_name = data.get('FirstName')
                last_name = data.get('LastName')
                email = data.get('Email')
                phone_number = data.get('PhoneNumber')

                # Check if client already exists
                select_query = "SELECT * FROM Client WHERE Address_ID = %s"
                cursor.execute(select_query, (address_id,))
                existing_client = cursor.fetchone()

                if existing_client:
                    # Client already exists, return error
                    return {
                        'statusCode': 409,  # Conflict status code
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'Client already exists'})
                    }

                # Insert the new client into the database
                insert_query = "INSERT INTO Client (Address_ID, FirstName, LastName, PhoneNumber, Email) VALUES (%s, %s, %s, %s, %s)"
                insert_values = (address_id, first_name, last_name, phone_number, email)
                cursor.execute(insert_query, insert_values)
                cnx.commit()

                # Get the last inserted Client_ID
                cursor.execute("SELECT LAST_INSERT_ID()")
                client_id = cursor.fetchone()[0]

                # Fetch the inserted client's data
                select_query = "SELECT * FROM Client WHERE Client_ID = %s"
                cursor.execute(select_query, (client_id,))
                created_client = cursor.fetchone()

                client_dict = {
                    'Client_ID': created_client[0],
                    'Address_ID': created_client[1],
                    'FirstName': created_client[2],
                    'LastName': created_client[3],
                    'PhoneNumber': created_client[4],
                    'Email': created_client[5]
                }

                return {
                    'statusCode': 201,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'message': 'Client created successfully', 'client': client_dict})
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
                client_id = path_params.get('proxy')
                if client_id:
                    data = json.loads(event['body'])
                    address_id = data.get('Address_ID')
                    first_name = data.get('FirstName')
                    last_name = data.get('LastName')
                    phone_number = data.get('PhoneNumber')
                    email = data.get('Email')

                    if any(value is None for value in [address_id, first_name, last_name, phone_number, email]):
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'Missing required fields in request body'})
                        }

                    # Update the client in the database
                    update_query = "UPDATE Client SET Address_ID=%s, FirstName=%s, LastName=%s, PhoneNumber=%s, Email=%s WHERE Client_ID=%s"
                    update_values = (address_id, first_name, last_name, phone_number, email, client_id)
                    cursor.execute(update_query, update_values)
                    cnx.commit()

                    # Fetch the inserted client's data
                    select_query = "SELECT * FROM Client WHERE Address_ID = %s"
                    cursor.execute(select_query, (address_id,))
                    updated_client = cursor.fetchone()

                    client_dict = {
                        'Client_ID': updated_client[0],
                        'Address_ID': updated_client[1],
                        'FirstName': updated_client[2],
                        'LastName': updated_client[3],
                        'PhoneNumber': updated_client[4],
                        'Email': updated_client[5]
                    }

                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'message': 'Client updated successfully', 'client': client_dict})
                    }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'client_id is required for PUT request'})
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
        #         client_id = path_params.get('proxy')
        #         if client_id:
        #             # Delete the client from the database
        #             delete_query = "DELETE FROM Client WHERE Client_ID=%s"
        #             delete_values = (client_id,)
        #             cursor.execute(delete_query, delete_values)
        #             cnx.commit()

        #             if cursor.rowcount > 0:
        #                 return {
        #                     'statusCode': 200,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'message': 'Client deleted successfully'})
        #                 }
        #             else:
        #                 return {
        #                     'statusCode': 404,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'error': 'Client not found or deletion failed'})
        #                 }
        #         else:
        #             return {
        #                 'statusCode': 400,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'client_id is required for DELETE request'})
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
