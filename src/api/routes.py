"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity
from sqlalchemy import select
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def register_user():

    body = request.get_json(silent=True)

    if body is None:
        return {"message": "Debes enviarme el body"}, 404

    if 'email' not in body or 'password' not in body:
        return {"message": "Datos incompletos"}, 404
    
    if db.session.execute(select(User).where(User.email == body['email'])).scalar_one_or_none() is not None:
        return {"message": "El email ya está registrado"}, 409
    
    hashed_password = generate_password_hash(body['password'])
    new_user = User(email=body['email'], password=hashed_password, is_active=True)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 200

@api.route('/token', methods=['POST'])
def login_user():
    body = request.get_json(silent=True)

    if body is None:
        return {"message": "Debes enviarme el body"}, 404

    if 'email' not in body or 'password' not in body:
        return {"message": "Datos incompletos"}, 404

    user = db.session.execute(select(User).where(User.email == body['email'])).scalar_one_or_none()

    if not check_password_hash(user.password, body['password']):
        return {"message": "Credenciales incorrectas"}, 401

    access_token = create_access_token(identity = str (user.id))
    return jsonify({ "token": access_token, "user_id": user.id })

@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    user = db.session.execute(select(User).where(User.id == current_user_id)).scalar_one_or_none()

    if user is None:
        return {"message": "Usuario no encontrado"}, 404

    return jsonify({"message": f"Bienvenido, {user.email}"}), 200

@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = db.session.execute(select(User)).scalars().all()
    return jsonify([user.serialize() for user in users]), 200 
# Para que funcione con con el jwt debe llamarse como objeto el jsonify