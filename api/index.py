from app import create_app

app = create_app()

# Vercel needs a named handler, but for WSGI/Flask usually just 'app' is enough 
# if exposing the object directly.
# However, Vercel looks for 'app' variable by default in this file.
