from artrealm.settings import mongo_db
import bcrypt
from datetime import datetime
from bson import ObjectId
import gridfs
import base64
# import logger


def update_profile(user_id, update_data):
    print("In db operations")
    user_collection = mongo_db['user']
    try:
        user = user_collection.find_one({'_id': ObjectId(user_id)})
        update_data['updated_at'] = datetime.utcnow()
        if user:
            result = user_collection.update_one(
                {'_id': ObjectId(user_id)},  
                {'$set': update_data}
            )
            print(f"Update result: {result.modified_count}")
            if result.modified_count > 0:
                return 201
            else:
                return 400
        else:
            print("User not found")
            return 400
    except Exception as e:
        print(f"Error in update_profile: {e}")
        raise

def insert_user(username, email, password, first_name, last_name, bio, user_type):
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_count = mongo_db.user.count_documents({})
    user_id = user_count + 1
    try:
        if mongo_db.user.find_one({'username': username}):
            return 400
        
        mongo_db.user.insert_one({
            'user_id': user_id,
            'username': username,
            'email': email,
            'password': hashed_pw.decode('utf-8'),
            'first_name': first_name,
            'last_name': last_name,
            'bio': bio,
            'user_type': user_type,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        })
        print(f"User {username} inserted successfully into MongoDB.")
    except Exception as e:
        print(f"Error inserting user into MongoDB: {e}")



fs = gridfs.GridFS(mongo_db)

def add_artwork(user_id, title, description, image_file):
    artwork_collection = mongo_db['artworks']
    image_id = fs.put(image_file, filename=image_file.name)
    artwork_data = {
        'user_id': ObjectId(user_id),
        'title': title,
        'description': description,
        'image_id': image_id
    }
    artwork_collection.insert_one(artwork_data)

def get_all_artworks():
    artwork_collection = mongo_db['artworks']
    users_collection = mongo_db['user']

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
            '$project': {
                'image_id': 1,
                'title': 1,
                'description': 1,
                'username': '$user_info.username',
                # 'created_at': 1
            }
        }
    ]

    artworks = list(artwork_collection.aggregate(pipeline))


    return artworks


def add_comment(artwork_id, user_id, content):
    comment_collection = mongo_db['comment']

    try:
        comment_collection.insert_one({'artwork_id': ObjectId(artwork_id),
                                       'user_id': ObjectId(user_id),
                                       'content': content})
    except Exception as e:
        print(f"Error inserting comment into MongoDB: {e}")


def add_rating(artwork_id, user_id, value):
    rating_collection = mongo_db['rating']
    try:
        rating_collection.insert_one({'artwork_id': ObjectId(artwork_id),
                                       'user_id': ObjectId(user_id),
                                       'rating_value': value})
    except Exception as e:
        print(f"Error inserting rating into MongoDB: {e}")



def get_user_artworks(user_id):
    try:
        artwork_collection = mongo_db['artworks']

        # Ensure user_id is valid ObjectId
        if not ObjectId.is_valid(user_id):
            raise ValueError("Invalid user_id format")

        # Aggregation pipeline to join artworks with users a_nd filter by user_id
        pipeline = [
            {
                '$match': {
                    'user_id': ObjectId(user_id)  # Filter artworks by user_id
                }
            },
            {
                '$lookup': {
                    'from': 'user',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user_info'
                }
            },
            {
                '$project': {
                    '_id': {'$toString': '$_id'},
                    'title': 1,
                    'description': 1,
                    'image_id': {'$toString': '$image_id'}  # Convert ObjectId to string
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
            # del artwork['image_id']

        return artworks

    except Exception as e:
        # logger.error(f"Error in get_user_artworks: {str(e)}")
        raise e  # Propagate the exception for handling in the view
    

def delete_artwork_and_gridfs(artwork_id):
    try:
        artwork_collection = mongo_db['artworks']
        artwork = artwork_collection.find_one({'_id': ObjectId(artwork_id)})
        comment_collection = mongo_db['comment']
        rating_collection = mongo_db['rating']

        if not artwork:
            raise Exception('Artwork not found')

        # Delete the GridFS file
        if 'image_id' in artwork:
            fs.delete(ObjectId(artwork['image_id']))

        # Delete the artwork document
        artwork_collection.delete_one({'_id': ObjectId(artwork_id)})

        # Delete associated comments
        comment_collection.delete_many({'artwork_id': ObjectId(artwork_id)})

        # Delete associated ratings
        rating_collection.delete_many({'artwork_id': ObjectId(artwork_id)})

    except Exception as e:
        raise Exception(f"Error deleting artwork and GridFS data: {str(e)}")