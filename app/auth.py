import requests
from flask import session, redirect, url_for
from functools import wraps
from app.config import Config


def get_current_user():
    """Obtiene el usuario actual de la sesión"""
    user_data = session.get('user')
    if not user_data:
        return None
    return user_data


def login_required(f):
    """Decorator para proteger rutas que requieren autenticación"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not get_current_user():
            return redirect(url_for('main.login'))
        return f(*args, **kwargs)
    return decorated_function


def sign_up_with_email(email: str, password: str, nombre: str = None):
    """Registro con email y contraseña usando API REST de Supabase"""
    try:
        url = f"{Config.SUPABASE_URL}/auth/v1/signup"
        headers = {
            "apikey": Config.SUPABASE_ANON_KEY,
            "Content-Type": "application/json"
        }
        data = {
            "email": email,
            "password": password
        }
        
        # Añadir nombre completo en metadata si se proporciona
        if nombre:
            data["data"] = {
                "nombre_completo": nombre
            }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code in [200, 201]:
            return {"success": True, "data": response.json()}
        else:
            error_msg = response.json().get('error_description', 'Error en registro')
            return {"success": False, "error": error_msg}
            
    except Exception as e:
        return {"success": False, "error": str(e)}


def sign_in_with_email(email: str, password: str):
    """Login con email y contraseña usando API REST de Supabase"""
    try:
        url = f"{Config.SUPABASE_URL}/auth/v1/token?grant_type=password"
        headers = {
            "apikey": Config.SUPABASE_ANON_KEY,
            "Content-Type": "application/json"
        }
        data = {
            "email": email,
            "password": password
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            
            # Extraer datos del usuario
            access_token = result.get('access_token')
            user = result.get('user')
            
            if user and access_token:
                # Guardar en sesión de Flask
                session['user'] = {
                    'id': user.get('id'),
                    'email': user.get('email'),
                    'access_token': access_token
                }
                session.permanent = True
                return {"success": True, "user": user}
        
        # Manejar errores específicos
        try:
            error_data = response.json()
            error_msg = error_data.get('error_description') or error_data.get('msg') or 'Credenciales inválidas'
        except:
            error_msg = 'Credenciales inválidas'
            
        return {"success": False, "error": error_msg}
            
    except Exception as e:
        return {"success": False, "error": f"Error de conexión: {str(e)}"}


def sign_in_with_google():
    """Inicia el flujo de OAuth con Google"""
    try:
        # URL de autorización de Supabase
        auth_url = f"{Config.SUPABASE_URL}/auth/v1/authorize"
        
        # URL de callback de NUESTRA aplicación
        # NOTA: Debe coincidir con lo configurado en Supabase > Auth > URL Configuration
        callback_url = "https://theultimate20chsheet.vercel.app/auth/callback"
        
        # Construir URL completa con parámetros
        oauth_url = f"{auth_url}?provider=google&redirect_to={callback_url}"
        
        return {"success": True, "url": oauth_url}
    except Exception as e:
        return {"success": False, "error": str(e)}


def handle_oauth_callback(access_token: str):
    """Maneja el callback de OAuth"""
    try:
        # Obtener usuario con el token
        url = f"{Config.SUPABASE_URL}/auth/v1/user"
        headers = {
            "apikey": Config.SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {access_token}"
        }
        
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            user = response.json()
            session['user'] = {
                'id': user.get('id'),
                'email': user.get('email'),
                'access_token': access_token
            }
            session.permanent = True
            return {"success": True, "user": user}
        else:
            return {"success": False, "error": "No se pudo obtener el usuario"}
            
    except Exception as e:
        return {"success": False, "error": str(e)}


def sign_out():
    """Cierra sesión"""
    try:
        session.clear()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_auth_headers():
    """Retorna headers de autenticación para requests a Supabase
    
    Usa Service Role Key para operaciones del backend porque:
    1. No expira como los JWT de usuario
    2. Bypassa RLS (pero filtramos manualmente por usuario)
    """
    headers = {
        "apikey": Config.SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    
    # Usar Service Role Key si está disponible (más confiable para backend)
    if Config.SUPABASE_SERVICE_KEY:
        headers["Authorization"] = f"Bearer {Config.SUPABASE_SERVICE_KEY}"
    else:
        # Fallback al token del usuario si no hay service key
        user = get_current_user()
        if user and user.get('access_token'):
            headers["Authorization"] = f"Bearer {user['access_token']}"
    
    return headers
