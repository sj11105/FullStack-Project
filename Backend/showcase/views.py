from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .db_operations import insert_user, add_artwork, update_profile, add_comment, add_rating, get_user_artworks, delete_artwork_and_gridfs
from artrealm.settings import mongo_db
import bcrypt
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse, HttpResponseServerError, HttpResponseNotFound
from bson import ObjectId
import gridfs
import base64
import datetime
from datetime import timedelta, timezone, date, time, datetime
import pytz
# import logger


@api_view(['POST'])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        response = insert_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            bio=data['bio'],
            user_type=data['user_type']
        )

        if response == 400:
            return Response({'error': f"Username '{data['username']}' already exists. Please use a different username."}, status=400)
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    users_collection = mongo_db['user']  

    user = users_collection.find_one({'username': username})
    if user:
        stored_password = user.get('password')
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        
            user_id = str(user.get('_id'))  
            return Response({'message': 'Login successful', 'user_id': user_id}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

 
@api_view(['POST'])
def profile_view(request):
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = mongo_db['user'].find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        role = mongo_db.role.find_one({'role_id': user["user_type"]}, {'role_name': 1, '_id': 0})
        user['role'] = role['role_name']
        
        # Return user data
        return Response(user, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST', 'GET'])
def update_profile_view(request):
    user_id = request.data.get('user_id')
    print(f"Received user_id: {user_id}")
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        update_data = {
            'email': request.data.get('email'),
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'bio': request.data.get('bio'),
            'user_type': request.data.get('user_type'),
        }
        print(f"Update data: {update_data}")

        response = update_profile(user_id, update_data)
        if response == 201:
            return Response({'message': 'Successfully Updated User'}, status=status.HTTP_200_OK)
        elif response == 400:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error during profile update: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_artwork_view(request):
    user_id = request.data.get('user_id')
    title = request.data.get('title')
    description = request.data.get('description')
    image_file = request.FILES.get('image')

    if not user_id or not title or not description or not image_file:
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        add_artwork(user_id, title, description, image_file)
        return Response({'message': 'Artwork added successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

fs = gridfs.GridFS(mongo_db)

@api_view(['GET'])
def get_all_artworks_view(request):
    try:
        artwork_collection = mongo_db['artworks']
        users_collection = mongo_db['user']
        ratings_collection = mongo_db['rating']

        # Aggregation pipeline to join artworks with users
        pipeline = [
            {
                '$lookup': {
                    'from': 'user',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user_info'
                }
            },
            {
                '$unwind': '$user_info'
            },
                  {
                '$lookup': {
                    'from': 'rating',
                    'localField': '_id',
                    'foreignField': 'artwork_id',
                    'as': 'ratings_info'
                }
            },
            {
                '$addFields': {
                    'average_rating': {
                        '$avg': {
                            '$map': {
                                'input': '$ratings_info',
                                'as': 'rating',
                                'in': '$$rating.rating_value'
                            }
                        }
                    }
                }
            },
              {
                '$lookup': {
                    'from': 'auction',
                    'localField': '_id',
                    'foreignField': 'artwork_id',
                    'as': 'auction_info'
                }
            },
            {
                '$addFields': {
                    'is_scheduled_for_auction': {
                        '$cond': {
                            'if': {
                                '$gt': [
                                    {
                                        '$size': {
                                            '$filter': {
                                                'input': '$auction_info',
                                                'as': 'auction',
                                                'cond': {
                                                    '$gte': ['$$auction.start_time', datetime.now()]
                                                }
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            'then': True,
                            'else': False
                        }
                    }
                }
            },
            {
                '$project': {
                    '_id': {'$toString': '$_id'},
                    'title': 1,
                    'description': 1,
                    'username': '$user_info.username',
                    'image_id': {'$toString': '$image_id'},
                    'is_scheduled_for_auction': 1,
                    'average_rating': { '$ifNull': ['$average_rating', 0] },
                }
            }
        ]

        artworks = list(artwork_collection.aggregate(pipeline))

        for artwork in artworks:
            try:
                file = fs.get(ObjectId(artwork['image_id']))
                artwork['image_data'] = base64.b64encode(file.read()).decode('utf-8')  # Base64 encode the image data
                artwork['image_content_type'] = file.content_type if file.content_type else 'image/jpeg'  # Set content type or default to jpeg
            except gridfs.errors.NoFile:
                artwork['image_data'] = None
                artwork['image_content_type'] = 'image/jpeg'  # Default content type when no file found

            # Remove 'image_id' if it's not needed in the response
            del artwork['image_id']

        return Response(artworks, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def add_comment_view(request):
    user_id = request.data.get('user_id')
    artwork_id = request.data.get('artwork_id')
    content = request.data.get('content')
    print(user_id)
    try:
        add_comment(artwork_id, user_id, content)
        return Response('Comment Inserted Successfully', status=status.HTTP_201_CREATED)
    except:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_rating_view(request):
    user_id = request.data.get('user_id')
    artwork_id = request.data.get('artwork_id')
    rating = request.data.get('rating')
  
    try:
        add_rating(artwork_id, user_id, rating)
        return Response('Rating Inserted Successfully', status=status.HTTP_201_CREATED)
    except:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_user_artworks_view(request):
    try:
        user_id = request.GET.get('user_id')  # Get user_id from query parameter
        if not user_id:
            return Response({'error': 'user_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        artworks = get_user_artworks(user_id)
        return Response(artworks, status=status.HTTP_200_OK)

    except Exception as e:
        # logger.error(f"Error fetching artworks for user_id {user_id}: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_consecutive_dates_today_view(request):
    try:
    
        today = date.today()
        dates = [str(today + timedelta(days=i)) for i in range(3)]
        print(dates)
        return Response(dates, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_consecutive_dates_view(request):
    try:
    # Get today's date
        today = date.today()+timedelta(days=1)
        print(today)
        # Generate three consecutive dates
        dates = [str(today + timedelta(days=i)) for i in range(3)]
        print(dates)
        # Return JSON response with the dates
        return Response(dates, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_available_slots_view(request):
    try:
        date_str = request.GET.get('date')

        if not date_str:
            return JsonResponse({'error': 'Date parameter is required'}, status=400)

        auction_collection = mongo_db['auction']

        # Parse the provided date
        requested_date = datetime.strptime(date_str, '%Y-%m-%d').date()

        # Define the time slots (from 9:00 to 19:00)
        time_slots = [time(hour=hour) for hour in range(9, 21, 2)]

        # Create a list of datetime objects for the requested date
        start_datetimes = [datetime.combine(requested_date, slot) for slot in time_slots]

        # Log the start datetimes for debugging
        print(f"Start datetimes: {start_datetimes}")

        # Query MongoDB for existing auction slots on the specified date
        existing_slots = list(auction_collection.find({
            'start_time': {'$in': start_datetimes}
        }))

        # Log the existing slots for debugging
        print(f"Existing slots: {existing_slots}")

        # Extract the start times of existing slots
        existing_start_times = {existing_slot['start_time'] for existing_slot in existing_slots}

        # Create a list to store availability
        availability = []

        for start_time in start_datetimes:
            slot_available = 1 if start_time in existing_start_times else 0
            availability.append({
                'time': start_time.time().strftime('%H:%M'),
                'available': slot_available
            })

        return JsonResponse({'available_slots': availability}, status=200)

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        return JsonResponse({'error': str(e)}, status=500)
    

@api_view(['POST'])
def insert_auction_view(request):
    try:
        data = request.data
                                                                      
        # Extract required fields from the request data
        date_str = data.get('date')
        time_str = data.get('start_time')
        start_bid = data.get('starting_bid')
        artwork_id = data.get('artwork_id')

        # Combine date and time to create start_time
        start_time_str = f"{date_str} {time_str}"
        start_time = datetime.strptime(start_time_str, '%Y-%m-%d %H:%M')

        # Set default end_time to 1 hour and 59 minutes after start_time
        end_time = start_time + timedelta(hours=1, minutes=59)

        # Insert auction into MongoDB
        auction_collection = mongo_db['auction']
        auction = {
            'start_time': start_time,
            'end_time': end_time,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'current_bid': None,
            'winning_bid': None,
            'start_bid': int(start_bid),
            'artwork_id': ObjectId(artwork_id)
        }
        result = auction_collection.insert_one(auction)

        # Respond with success message or ID of inserted auction
        return Response({'message': 'Auction inserted successfully', 'auction_id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def delete_artwork_view(request):
    try:
        artwork_id = request.data.get('id')
        print(artwork_id)
        delete_artwork_and_gridfs(artwork_id)
        return Response({'message': 'Artwork deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_auctions_by_date_view(request):
    try:
        date_str = request.GET.get('date')
        if not date_str:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Parse the provided date string
        date = datetime.strptime(date_str, '%Y-%m-%d')

        # Connect to MongoDB
        auction_collection = mongo_db['auction'] 
        artwork_collection = mongo_db['artworks'] # Ensure this collection name is correct

        # Aggregation pipeline
        pipeline = [
            {
                '$match': {
                    'start_time': {
                        '$gte': datetime.combine(date, datetime.min.time())
                    },
                    'end_time':{
                        '$lt': datetime.combine(date, datetime.max.time())
                    }
                }
            },
             {
                '$lookup': {
                    'from': 'artworks',
                    'localField': 'artwork_id',
                    'foreignField': '_id',
                    'as': 'artwork_info'
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'start_bid': 1,
                    'start_time': 1,
                    'end_time': 1,
                    'artwork_title': '$artwork_info.title'
                }
            }
        ]

        # Find auctions by date
        auctions = auction_collection.aggregate(pipeline)
        auction_list = list(auctions)

        return Response({'auctions': auction_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_ongoing_auction_view(request):
    try:

        # Parse the provided date string
        date = datetime.now()

        # Connect to MongoDB
        auction_collection = mongo_db['auction'] 
        artwork_collection = mongo_db['artworks']

        # Aggregation pipeline
        pipeline = [
            {
                '$match': {
                    'start_time': {'$lte': date},
                    'end_time': {'$gte': date}
                }
            },
             {
                '$lookup': {
                    'from': 'artworks',
                    'localField': 'artwork_id',
                    'foreignField': '_id',
                    'as': 'artwork_info'
                }
            },
            {
                '$unwind': '$artwork_info'  
            },
            {
                '$project': {
                    '_id': {'$toString': '$_id'},
                    'start_bid': 1,
                    'start_time': 1,
                    'end_time': 1,
                    'artwork_title': '$artwork_info.title',
                    'image_id': {'$toString': '$artwork_info.image_id'}
                }
            }
        ]

        # Find auctions by date
        auctions = auction_collection.aggregate(pipeline)
        auction_list = list(auctions)

        # Fetch and encode images
        for auction in auction_list:
            try:
                file = fs.get(ObjectId(auction['image_id']))
                auction['image_data'] = base64.b64encode(file.read()).decode('utf-8')  # Base64 encode the image data
                auction['image_content_type'] = file.content_type if file.content_type else 'image/jpeg'  # Set content type or default to jpeg
            except gridfs.errors.NoFile:
                auction['image_data'] = None
                auction['image_content_type'] = 'image/jpeg'  # Default content type when no file found

            # Remove 'image_id' if it's not needed in the response
            del auction['image_id']

        return Response({'auctions': auction_list}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def place_bid_view(request):
    try: 
        new_bid_amount = request.data.get('amount')
        auction_id = request.data.get('auction_id')
        user_id = request.data.get('user_id')

        bid_collection = mongo_db['bid']
        auction_collection = mongo_db['auction']

        # Create a new bid document
        new_bid = {
            'auction': ObjectId(auction_id),
            'bidder': ObjectId(user_id),
            'amount': float(new_bid_amount),
            'bid_time': datetime.now()
        }

        # Insert the new bid into the bid collection
        inserted_bid = bid_collection.insert_one(new_bid)
        bid_id = inserted_bid.inserted_id

        # Update the auction with the new winning bid and current bid
        auction_collection.update_one(
            {'_id': ObjectId(auction_id)},
            {
                '$set': {
                    'winning_bid': bid_id,
                    'current_bid': float(new_bid_amount)
                }
            }
        )

        return Response({'status': 'success', 'bid_id': str(bid_id)}, status=status.HTTP_201_CREATED)
    except:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_current_bid_view(request):
    auction_id = request.GET.get('auction_id')
    
    if not auction_id:
        return Response({'error': 'Auction ID is required'}, status=400)

    try:
        # Access the auctions collection
        auction_collection = mongo_db['auction']

        # Find the auction with the given auction_id
        auction = auction_collection.find_one({'_id': ObjectId(auction_id)})
        
        if auction:
            # Extract the current bid
            current_bid = auction.get('current_bid', None)
            
            if current_bid is not None:
                return Response({'current_bid': current_bid}, status=200)
            else:
                return Response({'error': 'Current bid not found'}, status=404)
        else:
            return Response({'error': 'Auction not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
def transaction_update_view(request):
    try:
        auctions_collection = mongo_db['auction']
        transaction_collection = mongo_db['transaction']
        bid_collection = mongo_db['bid']
    
        now = datetime.now()

        # Check and generate transactions if necessary
        auctions = auctions_collection.find({
            'end_time': {'$lte': now},
            'winning_bid': {'$ne': None}  # Ensure that winning_bid is not None
        })

        for auction in auctions:
            winning_bid_id = auction.get('winning_bid')
            if winning_bid_id:
                # Find the winning bid
                winning_bid = bid_collection.find_one({'_id': winning_bid_id})

                if winning_bid:
                    existing_transaction = transaction_collection.find_one({'auction': auction['_id']})

                    if not existing_transaction:
                        transaction = {
                            'buyer': winning_bid['bidder'],
                            'auction': auction['_id'],
                            'bid': winning_bid['_id'],
                            'payment_status': 0,  # 0 for pending
                            'amount': winning_bid['amount'],
                            'transaction_time': None
                        }
                        transaction_collection.insert_one(transaction)
                        
                        # Optionally, update the auction status
                        auctions_collection.update_one({'_id': auction['_id']}, {'$set': {'status': 'completed'}})

        return Response({'message': 'Transactions updated successfully.'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['POST'])
def update_transactions_status(request):
    transaction_ids = request.data.get('transaction_ids', [])
    status = request.data.get('status', '')
    transaction_collection = mongo_db['transaction']

    if not transaction_ids or not status:
        return Response({'error': 'Invalid input'}, status=400)

    # Update multiple transactions
    result = transaction_collection.update_many(
        {'_id': {'$in': [ObjectId(id) for id in transaction_ids]}},
        {'$set': {'payment_status': 1, 'transaction_time': datetime.now()}}
    )

    return Response({'message': f'{result.modified_count} transactions updated successfully'})


@api_view(['GET', 'POST'])
def get_transactions_by_user_view(request):
    user_id = request.GET.get('user_id')
    
    if not user_id:
        return Response({'error': 'User ID is required'}, status=400)
    
    transaction_collection = mongo_db['transaction']
    
    try:
        # Fetch incomplete transactions
        incomplete_transactions = list(transaction_collection.find(
            {'buyer': ObjectId(user_id), 'payment_status': 0}
        ))
        
        # Fetch complete transactions
        complete_transactions = list(transaction_collection.find(
            {'buyer': ObjectId(user_id), 'payment_status': 1}
        ))

        # Transform documents to include only necessary fields
        incomplete_transactions = [
            {
                'transaction_id': str(transaction['_id']),
                'amount': transaction['amount'],
                'status': 'Pending'
            } for transaction in incomplete_transactions
        ]

        complete_transactions = [
            {
                'transaction_id': str(transaction['_id']),
                'amount': transaction['amount'],
                'status': 'Completed'
            } for transaction in complete_transactions
        ]

        return Response({
            'incomplete': incomplete_transactions,
            'complete': complete_transactions
        })
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
                

