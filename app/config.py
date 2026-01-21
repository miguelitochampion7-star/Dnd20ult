import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuración de la aplicación"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
    
    # Sesión - Configuración para Hugging Face Spaces
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'None'  # Necesario para cross-site en HF
    SESSION_COOKIE_SECURE = True  # Requerido cuando SameSite=None
    PERMANENT_SESSION_LIFETIME = 3600 * 24 * 7  # 7 días
    
    @staticmethod
    def validate():
        """Valida que las variables de entorno estén configuradas"""
        required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY']
        missing = [var for var in required if not os.getenv(var)]
        
        if missing:
            raise ValueError(f"Faltan variables de entorno: {', '.join(missing)}")
        
        return True
