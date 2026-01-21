from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.auth import (
    sign_in_with_email, 
    sign_up_with_email, 
    sign_in_with_google,
    sign_out,
    login_required,
    get_current_user,
    handle_oauth_callback
)

bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    """Página principal - redirige según estado de autenticación"""
    if get_current_user():
        return redirect(url_for('main.dashboard'))
    return redirect(url_for('main.login'))


@bp.route('/login', methods=['GET', 'POST'])
def login():
    """Página de login"""
    if get_current_user():
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        result = sign_in_with_email(email, password)
        
        if result['success']:
            return redirect(url_for('main.dashboard'))
        else:
            flash(f"Error: {result['error']}", 'error')
    
    return render_template('login.html')


@bp.route('/register', methods=['GET', 'POST'])
def register():
    """Página de registro"""
    if get_current_user():
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Las contraseñas no coinciden', 'error')
            return render_template('login.html')
        
        result = sign_up_with_email(email, password, nombre)
        
        if result['success']:
            flash('Cuenta creada exitosamente. ¡Bienvenido!', 'success')
            return redirect(url_for('main.login'))
        else:
            flash(f"Error: {result['error']}", 'error')
    
    return render_template('login.html')


@bp.route('/auth/google')
def auth_google():
    """Inicia login con Google"""
    result = sign_in_with_google()
    if result['success']:
        return redirect(result['url'])
    else:
        flash(f"Error: {result['error']}", 'error')
        return redirect(url_for('main.login'))


@bp.route('/auth/callback')
def auth_callback():
    """Callback de OAuth - Supabase maneja el token en hash fragment"""
    # Supabase OAuth devuelve el token en el hash fragment (#access_token=...)
    # No podemos leerlo del lado del servidor, así que renderizamos una página
    # que extrae el token del hash con JavaScript y lo envía al servidor
    
    error = request.args.get('error')
    error_description = request.args.get('error_description')
    
    if error:
        flash(f'Error de autenticación: {error_description or error}', 'error')
        return redirect(url_for('main.login'))
    
    # Renderizar página que maneja el hash fragment
    return render_template('oauth_callback.html')


@bp.route('/auth/google/verify', methods=['POST'])
def auth_google_verify():
    """Verifica el token de OAuth y crea la sesión"""
    try:
        data = request.get_json()
        access_token = data.get('access_token')
        
        if not access_token:
            return {'success': False, 'error': 'No token provided'}, 400
        
        result = handle_oauth_callback(access_token)
        
        if result['success']:
            return {'success': True}
        else:
            return {'success': False, 'error': result.get('error', 'Unknown error')}, 400
            
    except Exception as e:
        return {'success': False, 'error': str(e)}, 500


@bp.route('/logout')
def logout():
    """Cerrar sesión"""
    sign_out()
    return redirect(url_for('main.login'))


@bp.route('/dashboard')
@login_required
def dashboard():
    """Dashboard de fichas del usuario"""
    user = get_current_user()
    return render_template('dashboard.html', user=user)


@bp.route('/ficha/<ficha_id>')
@login_required
def ficha(ficha_id):
    """Editor de ficha"""
    user = get_current_user()
    return render_template('index.html', user=user, ficha_id=ficha_id)


@bp.route('/ficha/nueva')
@login_required
def nueva_ficha():
    """Crear nueva ficha"""
    return render_template('index.html', user=get_current_user(), ficha_id='new')
