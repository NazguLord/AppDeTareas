# Acceso a la aplicación

La aplicación requiere iniciar sesión. Por defecto solo puede entrar el usuario `EEC`; para cambiar la cuenta permitida, configura `AUTH_ALLOWED_USER` en `backend/.env` y reinicia el servidor. El registro público está desactivado.

Si olvidaste la contraseña, ejecuta desde una terminal interactiva en `backend/`:

```sh
npm run reset-password -- EEC
```

Escribe la contraseña nueva dos veces; no se muestra en pantalla y debe tener al menos ocho caracteres. El comando requiere conexión a la base de datos configurada en `backend/.env`. No crea usuarios.

Las sesiones existentes caducan como máximo siete días después de iniciarse; cambiar la contraseña no invalida inmediatamente los tokens ya emitidos.
