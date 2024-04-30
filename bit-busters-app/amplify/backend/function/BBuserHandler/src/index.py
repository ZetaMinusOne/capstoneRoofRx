import json
import mysql.connector

def handler(event, context):
    # Validate HTTP method
    http_method = event.get('httpMethod', '')
    path = event.get('path')
    if http_method not in {'GET', 'POST', 'PUT', 'DELETE'}:
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

        if path.startswith('/users/table')and http_method == 'GET':
            path_params = event.get('pathParameters', {})
            
            if path_params:
                # If user_id is provided in the path parameters
                user_id = path_params.get('proxy')
                if user_id:
                    query = """
                        SELECT
                            Report.Report_ID,
                            Client.FirstName AS Client_FirstName,
                            Client.LastName AS Client_LastName,
                            Report.r_Date,
                            CONCAT(Address.Street, ', ', Address.DoorNumber, ', ', Address.City, ', ', Address.u_State, ', ', Address.Country, ', ', Address.ZipCode) AS Address,
                            Report.Report_URL
                        FROM
                            Report
                        INNER JOIN Client ON Report.Client_ID = Client.Client_ID
                        INNER JOIN Address ON Client.Address_ID = Address.Address_ID
                        WHERE
                            Report.User_ID = %s
                        ORDER BY Report.r_Date DESC
                    """
                    cursor.execute(query, (user_id,))
                    table_data = []
                    for row in cursor.fetchall():
                        row_dict = {
                            'Report_ID': row[0],
                            'Client_FirstName': row[1],
                            'Client_LastName': row[2],
                            'r_Date': row[3].strftime('%Y-%m-%d'), 
                            'Address': row[4],
                            'Report_URL': row[5]
                        }
                        table_data.append(row_dict)

                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'table_data': table_data})
                    }
            else:
                # Handle GET request for user table
                query = """
                    SELECT
                        Report.Report_ID,
                        User.FirstName AS User_FirstName,
                        User.LastName AS User_LastName,
                        Client.FirstName AS Client_FirstName,
                        Client.LastName AS Client_LastName,
                        Report.r_Date,
                        CONCAT(Address.Street, ', ', Address.DoorNumber, ', ', Address.City, ', ', Address.u_State, ', ', Address.Country, ', ', Address.ZipCode) AS Address,
                        Report.Report_URL
                    FROM
                        Report
                    INNER JOIN User ON Report.User_ID = User.User_ID
                    INNER JOIN Client ON Report.Client_ID = Client.Client_ID
                    INNER JOIN Address ON Client.Address_ID = Address.Address_ID
                    ORDER BY Report.r_Date DESC
                """

                cursor.execute(query)
                table_data = []
                for row in cursor.fetchall():
                    row_dict = {
                        'Report_ID': row[0],
                        'User_FirstName': row[1],
                        'User_LastName': row[2],
                        'Client_FirstName': row[3],
                        'Client_LastName': row[4],
                        'r_Date': row[5].strftime('%Y-%m-%d'), 
                        'Address': row[6],
                        'Report_URL': row[7]
                    }
                    table_data.append(row_dict)

                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'table_data': table_data})
                }
            
        elif path.startswith('/users'):

            if http_method == 'GET':
                # Handle GET request
                # Get path parameters
                path_params = event.get('pathParameters', {})
                
                # Get query parameters
                query_params = event.get('queryStringParameters', {})
                
                # Check if there is a user_id in the path parameters
                if path_params:
                    user_id = path_params.get('proxy')
                    if user_id:
                        # Fetch user by ID
                        query = "SELECT * FROM User WHERE User_ID = %s AND IsActive = TRUE"
                        cursor.execute(query, (user_id,))
                        user_data = cursor.fetchone()

                        if user_data:
                            user_dict = {
                                'User_ID': user_data[0],
                                'FirstName': user_data[1],
                                'LastName': user_data[2],
                                'Email': user_data[3],
                                'PhoneNumber': user_data[4],
                                # 'u_Password': user_data[5],
                                'Signature_URL': user_data[5],
                                'isActive': user_data[6]
                            }
                            return {
                                'statusCode': 200,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'user': user_dict})
                            }
                        else:
                            return {
                                'statusCode': 404,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'error': 'User not found'})
                            }

                # Check if there is an email query parameter
                elif query_params and 'email' in query_params:
                    email = query_params.get('email')

                    # Fetch user by email
                    query = "SELECT * FROM User WHERE Email = %s AND IsActive = TRUE"
                    cursor.execute(query, (email,))
                    user_data = cursor.fetchone()

                    if user_data:
                        user_dict = {
                            'User_ID': user_data[0],
                            'FirstName': user_data[1],
                            'LastName': user_data[2],
                            'Email': user_data[3],
                            'PhoneNumber': user_data[4],
                            # 'u_Password': user_data[5],
                            'Signature_URL': user_data[5],
                            'isActive': user_data[6]
                        }
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'user': user_dict})
                        }
                    else:
                        # Return error if user not found
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'User not found'})
                        }

                # If no path parameters or email query parameter, fetch all active users
                else:
                    # Fetch all active users
                    query = "SELECT * FROM User WHERE IsActive = TRUE"
                    cursor.execute(query)
                    users_list = []
                    for row in cursor.fetchall():
                        user_dict = {
                            'User_ID': row[0],
                            'FirstName': row[1],
                            'LastName': row[2],
                            'Email': row[3],
                            'PhoneNumber': row[4],
                            # 'u_Password': row[5],
                            'Signature_URL': row[5],
                            'isActive': row[6]
                        }
                        users_list.append(user_dict)

                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'users': users_list})
                    }

            if http_method == 'POST':
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
                required_fields = ['FirstName', 'LastName', 'Email', 'PhoneNumber']
                if all(data.get(field) is not None for field in required_fields):
                    first_name = data.get('FirstName')
                    last_name = data.get('LastName')
                    email = data.get('Email')
                    phone_number = data.get('PhoneNumber')
                    # password = data.get('u_Password')
                    signature_url = data.get('Signature_URL')

                    # Check if email already exists
                    email_check_query = "SELECT COUNT(*) FROM User WHERE Email = %s"
                    cursor.execute(email_check_query, (email,))
                    email_count = cursor.fetchone()[0]
                    if email_count > 0:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'Email already exists'})
                        }

                    # Insert the new user into the database
                    insert_query = "INSERT INTO User (FirstName, LastName, Email, PhoneNumber, Signature_URL, IsActive) VALUES (%s, %s, %s, %s, %s, TRUE)"
                    insert_values = (first_name, last_name, email, phone_number, signature_url)
                    cursor.execute(insert_query, insert_values)
                    cnx.commit()

                    # Fetch the inserted user's data
                    select_query = "SELECT * FROM User WHERE Email = %s"
                    cursor.execute(select_query, (email,))
                    created_user = cursor.fetchone()

                    user_dict = {
                        'User_ID': created_user[0],
                        'FirstName': created_user[1],
                        'LastName': created_user[2],
                        'Email': created_user[3],
                        'PhoneNumber': created_user[4],
                        'Signature_URL': created_user[5],
                        'isActive': created_user[6]
                    }

                    return {
                        'statusCode': 201,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'message': 'User created successfully', 'user': user_dict})
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
                    user_id = path_params.get('proxy')
                    if user_id:
                        data = json.loads(event['body'])
                        first_name = data.get('FirstName')
                        last_name = data.get('LastName')
                        phone_number = data.get('PhoneNumber')
                        # password = data.get('u_Password')
                        signature_url = data.get('Signature_URL')

                        # Check for missing required fields, excluding password
                        if any(value is None for value in [first_name, last_name, phone_number]):
                            return {
                                'statusCode': 400,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'error': 'Missing required fields in request body'})
                            }

                        # Check if user exists
                        select_query = "SELECT COUNT(*) FROM User WHERE User_ID = %s"
                        select_values = (user_id,)
                        cursor.execute(select_query, select_values)
                        result = cursor.fetchone()
                        if result[0] == 0:
                            return {
                                'statusCode': 404,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'error': 'User not found'})
                            }
                        
                        if signature_url:
                            update_query = "UPDATE User SET FirstName=%s, LastName=%s, PhoneNumber=%s, Signature_URL=%s WHERE User_ID=%s"
                            update_values = (first_name, last_name, phone_number, signature_url, user_id)

                        else: 
                            update_query = "UPDATE User SET FirstName=%s, LastName=%s, PhoneNumber=%s WHERE User_ID=%s"
                            update_values = (first_name, last_name, phone_number, user_id)

                        # Execute the update query
                        cursor.execute(update_query, update_values)
                        cnx.commit()

                        # Fetch updated user information
                        select_query = "SELECT * FROM User WHERE User_ID = %s"
                        cursor.execute(select_query, select_values)
                        updated_user = cursor.fetchone()

                        user_dict = {
                            'User_ID': updated_user[0],
                            'FirstName': updated_user[1],
                            'LastName': updated_user[2],
                            'Email': updated_user[3],
                            'PhoneNumber': updated_user[4],
                            'Signature_URL': updated_user[5],
                            'isActive': updated_user[6]
                        }

                        return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'message': 'User updated successfully', 'user': user_dict})
                        }
                    else:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'user_id is required for PUT request'})
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

            elif http_method == 'DELETE':
                # Handle DELETE request
                path_params = event.get('pathParameters', {})
                if path_params:
                    user_id = path_params.get('proxy')
                    if user_id:
                        # Delete the user from the database
                        select_query = "SELECT COUNT(*) FROM User WHERE User_ID = %s"
                        select_values = (user_id,)
                        delete_query = "Update User SET isActive=%s WHERE User_ID=%s"
                        cursor.execute(select_query, select_values)
                        result = cursor.fetchone()
                        if result[0] == 0:
                            return {
                                'statusCode': 404,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'error': 'User not found'})
                            }
                        else:
                            # Delete the user from the database
                            delete_query = "UPDATE User SET isActive=%s WHERE User_ID=%s"
                            delete_values = (False, user_id)
                            cursor.execute(delete_query, delete_values)
                            cnx.commit()
                            return {
                                'statusCode': 200,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'message': 'User deleted successfully'})
                            }
                    else:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'user_id is required for DELETE request'})
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
                return {'statusCode': 400, 'body': json.dumps({'message': 'Invalid operation'})}
        else:
            return {'statusCode': 400, 'body': json.dumps({'message': 'Invalid path'})}

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
