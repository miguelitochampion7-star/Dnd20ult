from flask import Flask
from app.config import Config

def create_app():
    app = Flask(__name__)
    
    # Configuración
    app.config.from_object(Config)
    
    # Validar variables de entorno
    try:
        Config.validate()
    except ValueError as e:
        print(f"⚠️ WARNING: {e}")
        print("⚠️ La aplicación funcionará pero sin autenticación")
    
    # Registrar blueprints
    from app import routes
    from app.api import api
    
    app.register_blueprint(routes.bp)
    app.register_blueprint(api)
    
    return app
