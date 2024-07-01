# test_mongodb_connection.py

from pymongo import MongoClient

def test_mongodb_connection():
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['artrealm']  # Replace with your database name
        
        # Check if we can list collections
        collection_names = db.list_collection_names()
        print(f"Connected to MongoDB. Collections found: {collection_names}")

    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

if __name__ == "__main__":
    test_mongodb_connection()
