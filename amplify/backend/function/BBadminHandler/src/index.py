import json
import mysql.connector

def handler(event, context):
    # Validate HTTP method
    http_method = event.get('httpMethod', '')
    if http_method not in {'GET', 'POST', 'DELETE'}: # Changed this to remove PUT method
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
                user_id = path_params.get('proxy')
                if user_id:
                    # Fetch admin by ID
                    query = "SELECT * FROM Admin WHERE User_ID = %s"
                    cursor.execute(query, (user_id,))
                    admin_data = cursor.fetchone()

                    if admin_data:
                        admin_dict = {
                            'Admin_ID': admin_data[0],
                            'User_ID': admin_data[1]
                        }
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'admin': admin_dict})
                        }
                    else:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'User is not an admin or was not found'})
                        }
            else:
                # Fetch all admins
                query = "SELECT * FROM Admin"
                cursor.execute(query)
                admins_list = []
                for row in cursor.fetchall():
                    admin_dict = {
                        'Admin_ID': row[0],
                        'User_ID': row[1]
                    }
                    admins_list.append(admin_dict)

                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'admins': admins_list})
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
            user_id = data.get('User_ID')

            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'error': 'user_id is required for POST request'})
                }

            # Check if User_ID exists in the User table
            user_query = "SELECT User_ID FROM User WHERE User_ID = %s"
            cursor.execute(user_query, (user_id,))
            existing_user = cursor.fetchone()

            if existing_user:
                # Check if User_ID exists in the Admin table
                user_query = "SELECT User_ID FROM Admin WHERE User_ID = %s"
                cursor.execute(user_query, (user_id,))
                existing_admin = cursor.fetchone()

                if existing_admin:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'This user is already an admin'})
                    }

                # Insert the new admin into the database
                insert_admin_query = "INSERT INTO Admin (User_ID) VALUES (%s)"
                cursor.execute(insert_admin_query, (user_id,))
                cnx.commit()  # Commit the transaction for adding the admin

                # Fetch all existing reports from the Report table
                cursor.execute("SELECT Report_ID FROM Report")
                existing_reports = cursor.fetchall()

                # Give the new admin access to all existing reports
                access_insert_query = "INSERT INTO Access (Admin_ID, Report_ID) VALUES (%s, %s)"
                cursor.execute("SELECT Admin_ID FROM Admin WHERE User_ID = %s", (user_id,))
                admin_id = cursor.fetchone()[0]

                # Iterate through all existing reports and grant access
                for report in existing_reports:
                    report_id = report[0]
                    cursor.execute(access_insert_query, (admin_id, report_id))

                cnx.commit()  # Commit the transaction for granting access

                # Fetch the inserted admin's data
                select_query = "SELECT * FROM Admin WHERE User_ID = %s"
                cursor.execute(select_query, (user_id,))
                created_admin = cursor.fetchone()

                admin_dict = {
                    'Admin_ID': created_admin[0],
                    'User_ID': created_admin[1]
                }

                return {
                    'statusCode': 201,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'message': 'Admin created successfully and given access to all existing reports', 'admin': admin_dict})
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'error': 'User_ID does not exist'})
                }

        # elif http_method == 'PUT':
        #     if 'body' not in event or not event['body']:
        #         return {
        #             'statusCode': 400,
        #             'headers': {
        #                 'Access-Control-Allow-Headers': '*',
        #                 'Access-Control-Allow-Origin': '*',
        #                 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #             },
        #             'body': json.dumps({'error': 'Empty request body'})
        #         }
        #     # Handle PUT request
        #     path_params = event.get('pathParameters', {})
        #     if path_params:
        #         admin_id = path_params.get('proxy')
        #         if admin_id:
        #             data = json.loads(event['body'])
        #             user_id = data.get('User_ID')

        #             if user_id is None:
        #                 return {
        #                     'statusCode': 400,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'error': 'Missing required fields in request body'})
        #                 }

        #             # Update the admin in the database
        #             update_query = "UPDATE Admin SET User_ID=%s WHERE Admin_ID=%s"
        #             update_values = (user_id, admin_id)
        #             cursor.execute(update_query, update_values)
        #             cnx.commit()

        #             return {
        #                 'statusCode': 200,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'message': 'Admin updated successfully'})
        #             }
        #         else:
        #             return {
        #                 'statusCode': 400,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'admin_id is required for PUT request'})
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

        elif http_method == 'DELETE':
            # Handle DELETE request
            path_params = event.get('pathParameters', {})
            if path_params:
                admin_id = path_params.get('proxy')
                if admin_id:
                    # Begin a transaction
                    cursor.execute("START TRANSACTION")

                    try:
                        # Delete admin from Access table
                        delete_access_query = "DELETE FROM Access WHERE Admin_ID=%s"
                        cursor.execute(delete_access_query, (admin_id,))

                        # Delete the admin from the database
                        delete_admin_query = "DELETE FROM Admin WHERE Admin_ID=%s"
                        cursor.execute(delete_admin_query, (admin_id,))
                        
                        # Commit the transaction
                        cnx.commit()

                        if cursor.rowcount > 0:
                            return {
                                'statusCode': 200,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'message': 'Admin deleted successfully'})
                            }
                        else:
                            return {
                                'statusCode': 404,
                                'headers': {
                                    'Access-Control-Allow-Headers': '*',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                                },
                                'body': json.dumps({'error': 'Admin not found or deletion failed'})
                            }
                    except Exception as e:
                        # Rollback the transaction if an error occurs
                        cnx.rollback()
                        return {
                            'statusCode': 500,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': str(e)})
                        }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'admin_id is required for DELETE request'})
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
