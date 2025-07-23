#!/bin/bash

# ⚙️ CONFIGURA TU PROYECTO (si no está seteado globalmente)
PROJECT_NAME="vecii"

# Entornos disponibles en Vercel
ENVIRONMENTS=("production" "preview" "development")

for ENV in "${ENVIRONMENTS[@]}"; do
  echo "📦 Obteniendo variables del entorno: $ENV"
  
  # Obtener las variables de entorno
  vercel env pull .env.$ENV --environment=$ENV --token=$VERCEL_TOKEN
  
  # Leer las variables del archivo .env
  if [ -f ".env.$ENV" ]; then
    while IFS='=' read -r key value; do
      # Ignorar líneas vacías o comentarios
      if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
        echo "🗑️ Eliminando $key de $ENV"
        vercel env rm "$key" --yes --token=$VERCEL_TOKEN
      fi
    done < ".env.$ENV"
    
    # Limpiar archivo temporal
    rm ".env.$ENV"
  fi
done

echo "✅ Limpieza completa de variables de entorno"