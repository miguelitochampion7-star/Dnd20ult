import requests
from flask import Blueprint, request, jsonify
from app.auth import login_required, get_current_user, get_auth_headers
from app.config import Config
import json

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/fichas', methods=['GET'])
@login_required
def listar_fichas():
    """Lista todas las fichas del usuario actual"""
    try:
        user = get_current_user()
        
        url = f"{Config.SUPABASE_URL}/rest/v1/fichas"
        params = {
            "usuario_id": f"eq.{user['id']}",
            "order": "updated_at.desc",
            "select": "*"
        }
        headers = get_auth_headers()
        
        response = requests.get(url, params=params, headers=headers)
        
        if response.status_code == 200:
            return jsonify({
                "success": True,
                "fichas": response.json()
            })
        else:
            # Log detailed error from Supabase
            error_detail = "Unknown error"
            try:
                error_detail = response.json()
            except:
                error_detail = response.text
            
            print(f"[API ERROR] /fichas GET failed: {response.status_code} - {error_detail}")
            
            return jsonify({
                "success": False,
                "error": "Error cargando fichas",
                "status_code": response.status_code,
                "detail": str(error_detail)
            }), 500
        
    except Exception as e:
        print(f"[API EXCEPTION] /fichas GET: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api.route('/fichas/<ficha_id>', methods=['GET'])
@login_required
def obtener_ficha(ficha_id):
    """Obtiene una ficha específica"""
    try:
        user = get_current_user()
        
        url = f"{Config.SUPABASE_URL}/rest/v1/fichas"
        params = {
            "id": f"eq.{ficha_id}",
            "usuario_id": f"eq.{user['id']}",
            "select": "*"
        }
        headers = get_auth_headers()
        
        response = requests.get(url, params=params, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data:
                return jsonify({
                    "success": True,
                    "ficha": data[0]
                })
            else:
                return jsonify({
                    "success": False,
                    "error": "Ficha no encontrada"
                }), 404
        else:
            return jsonify({
                "success": False,
                "error": "Error cargando ficha"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api.route('/fichas', methods=['POST'])
@login_required
def crear_ficha():
    """Crea una nueva ficha"""
    try:
        user = get_current_user()
        data = request.get_json()
        
        nueva_ficha = {
            'usuario_id': user['id'],
            'nombre_personaje': data.get('nombre_personaje', 'Nuevo Personaje'),
            'data_json': data.get('data_json', {})
        }
        
        url = f"{Config.SUPABASE_URL}/rest/v1/fichas"
        headers = get_auth_headers()
        headers['Prefer'] = 'return=representation'
        
        response = requests.post(url, json=nueva_ficha, headers=headers)
        
        if response.status_code in [200, 201]:
            result = response.json()
            return jsonify({
                "success": True,
                "ficha": result[0] if result else None
            }), 201
        else:
            return jsonify({
                "success": False,
                "error": "Error creando ficha"
            }), 500
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api.route('/fichas/<ficha_id>', methods=['PUT'])
@login_required
def actualizar_ficha(ficha_id):
    """Actualiza una ficha existente"""
    try:
        user = get_current_user()
        data = request.get_json()
        
        # Construir objeto de actualización
        update_data = {}
        if 'nombre_personaje' in data:
            update_data['nombre_personaje'] = data['nombre_personaje']
        if 'data_json' in data:
            update_data['data_json'] = data['data_json']
        if 'es_favorita' in data:
            update_data['es_favorita'] = data['es_favorita']
        
        url = f"{Config.SUPABASE_URL}/rest/v1/fichas"
        params = {
            "id": f"eq.{ficha_id}",
            "usuario_id": f"eq.{user['id']}"
        }
        headers = get_auth_headers()
        headers['Prefer'] = 'return=representation'
        
        response = requests.patch(url, params=params, json=update_data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            if result:
                return jsonify({
                    "success": True,
                    "ficha": result[0]
                })
            else:
                return jsonify({
                    "success": False,
                    "error": "Ficha no encontrada"
                }), 404
        else:
            return jsonify({
                "success": False,
                "error": "Error actualizando ficha"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api.route('/fichas/<ficha_id>', methods=['DELETE'])
@login_required
def eliminar_ficha(ficha_id):
    """Elimina una ficha"""
    try:
        user = get_current_user()
        
        url = f"{Config.SUPABASE_URL}/rest/v1/fichas"
        params = {
            "id": f"eq.{ficha_id}",
            "usuario_id": f"eq.{user['id']}"
        }
        headers = get_auth_headers()
        
        response = requests.delete(url, params=params, headers=headers)
        
        if response.status_code in [200, 204]:
            return jsonify({
                "success": True,
                "message": "Ficha eliminada"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Error eliminando ficha"
            }), 500
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api.route('/user', methods=['GET'])
@login_required
def obtener_usuario():
    """Obtiene información del usuario actual"""
    user = get_current_user()
    return jsonify({
        "success": True,
        "user": {
            "id": user['id'],
            "email": user['email']
        }
    })
