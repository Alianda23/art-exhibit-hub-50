
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import os
from auth import register_user, login_user, register_admin, login_admin, register_artist, login_artist
from artwork import get_artworks, get_artwork, create_artwork, update_artwork, delete_artwork
from exhibition import get_exhibitions, get_exhibition, create_exhibition, update_exhibition, delete_exhibition
from contact import create_contact_message, get_contact_messages, update_message_status
from db_operations import create_order, create_ticket, get_all_orders, get_all_tickets, get_user_orders, get_artist_artworks, get_artist_orders, get_all_artists
from middleware import authenticate_admin, authenticate_user, authenticate_artist
from mpesa import initiate_stk_push, check_transaction_status
import traceback

app = Flask(__name__)
CORS(app)

# Set a secret key for JWT
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Static file serving
@app.route('/static/<path:filename>')
def serve_static(filename):
    try:
        from flask import send_from_directory
        return send_from_directory('static', filename)
    except Exception as e:
        print(f"Error serving static file {filename}: {e}")
        return "File not found", 404

# Serve placeholder.svg
@app.route('/placeholder.svg')
def serve_placeholder():
    try:
        from flask import send_from_directory
        return send_from_directory('static/uploads', 'placeholder.jpg')
    except Exception as e:
        print(f"Error serving placeholder: {e}")
        return "File not found", 404

# Auth routes
@app.route('/register', methods=['POST'])
def register():
    return register_user()

@app.route('/login', methods=['POST'])
def login():
    return login_user()

@app.route('/register-admin', methods=['POST'])
def register_admin_route():
    return register_admin()

@app.route('/admin-login', methods=['POST'])
def admin_login():
    return login_admin()

@app.route('/register-artist', methods=['POST'])
def register_artist_route():
    return register_artist()

@app.route('/artist-login', methods=['POST'])
def artist_login():
    return login_artist()

# Artwork routes
@app.route('/artworks', methods=['GET'])
def artworks():
    return get_artworks()

@app.route('/artworks/<artwork_id>', methods=['GET'])
def artwork_detail(artwork_id):
    return get_artwork(artwork_id)

@app.route('/artworks', methods=['POST'])
@authenticate_admin
def create_artwork_route():
    return create_artwork()

@app.route('/artworks/<artwork_id>', methods=['PUT'])
@authenticate_admin
def update_artwork_route(artwork_id):
    return update_artwork(artwork_id)

@app.route('/artworks/<artwork_id>', methods=['DELETE'])
@authenticate_admin
def delete_artwork_route(artwork_id):
    return delete_artwork(artwork_id)

# Exhibition routes
@app.route('/exhibitions', methods=['GET'])
def exhibitions():
    return get_exhibitions()

@app.route('/exhibitions/<exhibition_id>', methods=['GET'])
def exhibition_detail(exhibition_id):
    return get_exhibition(exhibition_id)

@app.route('/exhibitions', methods=['POST'])
@authenticate_admin
def create_exhibition_route():
    return create_exhibition()

@app.route('/exhibitions/<exhibition_id>', methods=['PUT'])
@authenticate_admin
def update_exhibition_route(exhibition_id):
    return update_exhibition(exhibition_id)

@app.route('/exhibitions/<exhibition_id>', methods=['DELETE'])
@authenticate_admin
def delete_exhibition_route(exhibition_id):
    return delete_exhibition(exhibition_id)

# Contact routes
@app.route('/contact', methods=['POST'])
def contact():
    return create_contact_message()

@app.route('/messages', methods=['GET'])
@authenticate_admin
def messages():
    return get_contact_messages()

@app.route('/messages/<message_id>', methods=['PUT'])
@authenticate_admin
def update_message(message_id):
    return update_message_status(message_id)

# Order routes
@app.route('/orders/artwork', methods=['POST'])
@authenticate_user
def create_artwork_order():
    try:
        data = request.get_json()
        user_id = request.current_user_id
        
        # Create order in database
        result = create_order(user_id, 'artwork', data['artwork_id'], data['total_amount'])
        
        if result.get('error'):
            return jsonify({"error": result['error']}), 400
            
        return jsonify({"success": True, "order_id": result['order_id']})
    except Exception as e:
        print(f"Error creating artwork order: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/orders/exhibition', methods=['POST'])
@authenticate_user
def create_exhibition_order():
    try:
        data = request.get_json()
        user_id = request.current_user_id
        
        # Create order in database
        result = create_order(user_id, 'exhibition', data['exhibition_id'], data['total_amount'])
        
        if result.get('error'):
            return jsonify({"error": result['error']}), 400
            
        return jsonify({"success": True, "order_id": result['order_id'], "ticket_code": result.get('ticket_code')})
    except Exception as e:
        print(f"Error creating exhibition order: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/orders', methods=['GET'])
@authenticate_admin
def orders():
    print("Processing GET /orders request")
    return get_all_orders()

@app.route('/user/<user_id>/orders', methods=['GET'])
@authenticate_user
def user_orders(user_id):
    try:
        print(f"Processing GET /user/{user_id}/orders request")
        print(f"Current user from token: {request.current_user_id}")
        
        # Ensure user can only access their own orders
        if str(request.current_user_id) != str(user_id):
            print(f"Access denied: user {request.current_user_id} trying to access orders for user {user_id}")
            return jsonify({"error": "Access denied"}), 403
        
        print(f"Fetching orders for user_id: {user_id}")
        result = get_user_orders(user_id)
        print(f"Orders result: {result}")
        
        if result.get('error'):
            print(f"Error from get_user_orders: {result['error']}")
            return jsonify({"error": result['error']}), 400
            
        return jsonify(result)
    except Exception as e:
        print(f"Error in user_orders endpoint: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Ticket routes
@app.route('/tickets', methods=['GET'])
@authenticate_admin
def tickets():
    return get_all_tickets()

@app.route('/tickets/generate/<booking_id>', methods=['POST'])
@authenticate_user
def generate_ticket(booking_id):
    try:
        # This would generate a PDF ticket - for now return a mock response
        return jsonify({
            "success": True,
            "ticketUrl": f"/tickets/download/{booking_id}.pdf"
        })
    except Exception as e:
        print(f"Error generating ticket: {e}")
        return jsonify({"error": str(e)}), 500

# Artist routes
@app.route('/artists', methods=['GET'])
@authenticate_admin
def artists():
    return get_all_artists()

@app.route('/artist/artworks', methods=['GET'])
@authenticate_artist
def artist_artworks():
    try:
        artist_id = request.current_artist_id
        return get_artist_artworks(artist_id)
    except Exception as e:
        print(f"Error getting artist artworks: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/artist/orders', methods=['GET'])
@authenticate_artist
def artist_orders():
    try:
        artist_id = request.current_artist_id
        return get_artist_orders(artist_id)
    except Exception as e:
        print(f"Error getting artist orders: {e}")
        return jsonify({"error": str(e)}), 500

# M-Pesa routes
@app.route('/mpesa/stk-push', methods=['POST'])
def mpesa_stk_push():
    return initiate_stk_push()

@app.route('/mpesa/status/<checkout_request_id>', methods=['GET'])
def mpesa_status(checkout_request_id):
    return check_transaction_status(checkout_request_id)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
