from django.urls import path
from .views import register_view , login_view, update_transactions_status, get_current_bid_view,get_consecutive_dates_today_view, profile_view,get_ongoing_auction_view, place_bid_view, get_auctions_by_date_view, add_artwork_view, get_all_artworks_view, update_profile_view, get_user_artworks_view, get_consecutive_dates_view, get_available_slots_view, insert_auction_view, delete_artwork_view, add_comment_view, add_rating_view, transaction_update_view, get_transactions_by_user_view
urlpatterns = [
    path('register/', register_view, name='register'), 
    path('login/', login_view, name='login'), 
    path('profile/', profile_view, name='profile'), 
    path('add_artwork/', add_artwork_view, name='add_artwork'),
    path('artworks/', get_all_artworks_view, name='artworks'),
    path('update_profile/', update_profile_view, name='update_profile'),
    path('artist_artworks/', get_user_artworks_view, name = 'artist_artworks'),
    path('auction_dates/', get_consecutive_dates_view, name='auction_dates'),
    path('auction_today_dates/', get_consecutive_dates_today_view, name='auction_today_dates'),
    path('get_available_slots/', get_available_slots_view, name = 'get_available_slots'),
    path('insert_auction/', insert_auction_view, name = 'insert_auction'),
    path('delete_artwork/',delete_artwork_view, name = 'delete_artwork' ),
    path('add_comment/', add_comment_view, name = 'add_comment'),
    path('add_rating/', add_rating_view, name = 'add_rating'),
    path('get_auctions_by_date/', get_auctions_by_date_view, name = 'get_auctions_by_date'),
    path('get_ongoing_auction/', get_ongoing_auction_view, name = 'get_ongoing_auction'),
    path('place_bid/', place_bid_view, name = 'place_bid'),
    path('get_current_bid/', get_current_bid_view, name = 'get_current_bid'),
    path('transaction_update/', transaction_update_view, name = 'transaction_update'),
    path('get_transactions_by_user/', get_transactions_by_user_view, name = 'get_transactions_by_user'),
    path('update_transactions_status/', update_transactions_status, name = 'update_transactions_status')
]

