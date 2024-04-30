import json
import mysql.connector
from datetime import datetime

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
                report_id = path_params.get('proxy')
                if report_id:
                    # Fetch report by ID
                    query = "SELECT * FROM Report WHERE Report_ID = %s"
                    cursor.execute(query, (report_id,))
                    report_data = cursor.fetchone()

                    if report_data:
                        report_dict = {
                            'Report_ID': report_data[0],
                            'User_ID': report_data[1],
                            'Client_ID': report_data[2],
                            'r_Date': report_data[3].strftime('%Y-%m-%d'),
                            'Price': report_data[4],
                            'NumberOfBrokenPipes': report_data[5],
                            'InspectorComments': report_data[6],
                            'is_Signed': report_data[7],
                            'Report_URL': report_data[8]
                        }
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'report': report_dict})
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
                # Fetch all reports
                query = "SELECT * FROM Report"
                cursor.execute(query)
                reports_list = []
                for row in cursor.fetchall():
                    report_dict = {
                        'Report_ID': row[0],
                        'User_ID': row[1],
                        'Client_ID': row[2],
                        'r_Date': row[3].strftime('%Y-%m-%d'),
                        'Price': row[4],
                        'NumberOfBrokenPipes': row[5],
                        'InspectorComments': row[6],
                        'is_Signed': row[7],
                        'Report_URL': row[8]
                    }
                    reports_list.append(report_dict)

                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'reports': reports_list})
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
            required_fields = ['User_ID', 'Client_ID', 'r_Date', 'Price', 'NumberOfBrokenPipes']  
            if all(data.get(field) is not None for field in required_fields):
                user_id = data.get('User_ID')
                client_id = data.get('Client_ID')
                r_date = data.get('r_Date')
                price = data.get('Price')
                num_broken_pipes = data.get('NumberOfBrokenPipes')
                inspector_comments = data.get('InspectorComments', 'No comments')  # Use default if not provided
                is_signed = data.get('is_Signed', 1)  # Use default if not provided
                report_url = data.get('Report_URL') # It will be set as null if not provided

                # Convert r_Date string to datetime object
                r_date = datetime.strptime(r_date, '%Y-%m-%d')

                # Insert the new report into the database
                insert_query = "INSERT INTO Report (User_ID, Client_ID, r_Date, Price, NumberOfBrokenPipes, InspectorComments, is_Signed, Report_URL) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
                insert_values = (user_id, client_id, r_date, price, num_broken_pipes, inspector_comments, is_signed, report_url)
                cursor.execute(insert_query, insert_values)
                cnx.commit()

                # Get the last inserted Address_ID
                cursor.execute("SELECT LAST_INSERT_ID()")
                report_id = cursor.fetchone()[0]

                # Fetch the inserted report's data
                select_query = "SELECT * FROM Report WHERE Report_ID = %s"
                cursor.execute(select_query, (report_id,))
                created_report = cursor.fetchone()

                report_dict = {
                    'Report_ID': created_report[0],
                    'User_ID': created_report[1],
                    'Client_ID': created_report[2],
                    'r_Date': created_report[3].strftime('%Y-%m-%d'),
                    'Price': created_report[4],
                    'NumberOfBrokenPipes': created_report[5],
                    'InspectorComments': created_report[6],
                    'is_Signed': created_report[7],
                    'Report_URL': created_report[8]
                }

                # Get the last inserted report ID
                report_id = cursor.lastrowid

                # Grant access to the new report for all existing admins
                cursor.execute("SELECT Admin_ID FROM Admin")
                admins = cursor.fetchall()
                for admin in admins:
                    insert_access_query = "INSERT INTO Access (Admin_ID, Report_ID) VALUES (%s, %s)"
                    insert_access_values = (admin[0], report_id)
                    cursor.execute(insert_access_query, insert_access_values)
                    cnx.commit()

                return {
                    'statusCode': 201,
                    'headers': {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                    },
                    'body': json.dumps({'message': 'Report created successfully and access granted to all admins', 'report': report_dict})
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
            # Handle PUT request
            path_params = event.get('pathParameters', {})
            if path_params:
                report_id = path_params.get('proxy')
                if report_id:
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
                    client_id = data.get('Client_ID')
                    r_date = data.get('r_Date')
                    price = data.get('Price')
                    num_broken_pipes = data.get('NumberOfBrokenPipes')
                    inspector_comments = data.get('InspectorComments')
                    is_signed = data.get('is_Signed')
                    report_url = data.get('Report_URL')

                    # Convert r_Date string to datetime object
                    r_date = datetime.strptime(r_date, '%Y-%m-%d')

                    if any(value is None for value in [user_id, client_id, r_date, price, num_broken_pipes, inspector_comments, report_url]):
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                            },
                            'body': json.dumps({'error': 'Missing required fields in request body'})
                        }

                    # Update the report in the database
                    update_query = "UPDATE Report SET User_ID=%s, Client_ID=%s, r_Date=%s, Price=%s, NumberOfBrokenPipes=%s, InspectorComments=%s, Report_URL=%s WHERE Report_ID=%s"
                    update_values = (user_id, client_id, r_date, price, num_broken_pipes, inspector_comments, report_url, report_id)
                    cursor.execute(update_query, update_values)
                    cnx.commit()

                    # Fetch the inserted report's data
                    select_query = "SELECT * FROM Report WHERE Report_ID = %s"
                    cursor.execute(select_query, (report_id,))
                    updated_report = cursor.fetchone()

                    report_dict = {
                        'Report_ID': updated_report[0],
                        'User_ID': updated_report[1],
                        'Client_ID': updated_report[2],
                        'r_Date': updated_report[3].strftime('%Y-%m-%d'),
                        'Price': updated_report[4],
                        'NumberOfBrokenPipes': updated_report[5],
                        'InspectorComments': updated_report[6],
                        'is_Signed': updated_report[7],
                        'Report_URL': updated_report[8]
                    }

                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'message': 'Report updated successfully', 'report': report_dict})
                    }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
                        },
                        'body': json.dumps({'error': 'report_id is required for PUT request'})
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
        #         report_id = path_params.get('proxy')
        #         if report_id:
        #             # Delete the report from the database
        #             delete_query = "DELETE FROM Report WHERE Report_ID=%s"
        #             delete_values = (report_id,)
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
        #                     'body': json.dumps({'message': 'Report deleted successfully'})
        #                 }
        #             else:
        #                 return {
        #                     'statusCode': 404,
        #                     'headers': {
        #                         'Access-Control-Allow-Headers': '*',
        #                         'Access-Control-Allow-Origin': '*',
        #                         'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                     },
        #                     'body': json.dumps({'error': 'Report not found or deletion failed'})
        #                 }
        #         else:
        #             return {
        #                 'statusCode': 400,
        #                 'headers': {
        #                     'Access-Control-Allow-Headers': '*',
        #                     'Access-Control-Allow-Origin': '*',
        #                     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
        #                 },
        #                 'body': json.dumps({'error': 'report_id is required for DELETE request'})
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
