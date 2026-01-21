-- =====================================================
-- SUPABASE DATABASE SETUP
-- D&D Character Sheet Multi-User System
-- =====================================================

-- 1. Crear tabla de fichas (characters)
CREATE TABLE IF NOT EXISTS fichas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_personaje TEXT NOT NULL DEFAULT 'Nuevo Personaje',
    data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    es_favorita BOOLEAN DEFAULT FALSE
);

-- 2. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_fichas_usuario_id ON fichas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_fichas_updated_at ON fichas(updated_at DESC);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE fichas ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de seguridad - Los usuarios solo ven y gestionan sus propias fichas

-- Política SELECT: Los usuarios solo pueden ver sus propias fichas
DROP POLICY IF EXISTS "Usuarios ven solo sus fichas" ON fichas;
CREATE POLICY "Usuarios ven solo sus fichas"
ON fichas FOR SELECT
USING (auth.uid() = usuario_id);

-- Política INSERT: Los usuarios solo pueden crear fichas para sí mismos
DROP POLICY IF EXISTS "Usuarios crean sus fichas" ON fichas;
CREATE POLICY "Usuarios crean sus fichas"
ON fichas FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

-- Política UPDATE: Los usuarios solo pueden actualizar sus propias fichas
DROP POLICY IF EXISTS "Usuarios editan sus fichas" ON fichas;
CREATE POLICY "Usuarios editan sus fichas"
ON fichas FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

-- Política DELETE: Los usuarios solo pueden eliminar sus propias fichas
DROP POLICY IF EXISTS "Usuarios eliminan sus fichas" ON fichas;
CREATE POLICY "Usuarios eliminan sus fichas"
ON fichas FOR DELETE
USING (auth.uid() = usuario_id);

-- 5. Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_fichas_updated_at ON fichas;
CREATE TRIGGER update_fichas_updated_at
BEFORE UPDATE ON fichas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSTRUCCIONES DE USO:
-- 
-- 1. Ve a tu proyecto Supabase
-- 2. Click en "SQL Editor" en el menú lateral
-- 3. Click en "New query"
-- 4. Copia y pega todo este contenido
-- 5. Click en "Run" (▶️)
-- 6. Deberías ver "Success. No rows returned"
-- 
-- ¡Listo! Tu base de datos está configurada.
-- =====================================================
