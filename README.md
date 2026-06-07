# AgustiNYCall Push Backend

Este backend sirve para enviar notificaciones push automáticas con Firebase Cloud Messaging.

## Archivos

- `server.js`: servidor Express que envía push.
- `package.json`: dependencias.
- `serviceAccountKey.example.json`: ejemplo. NO sirve para producción.
- `.gitignore`: evita subir claves privadas.

## Paso 1: Instalar dependencias

```bash
npm install
```

## Paso 2: Descargar clave privada de Firebase

Firebase Console:

```txt
Project settings
→ Service accounts
→ Generate new private key
```

Descargá el archivo JSON y renombralo como:

```txt
serviceAccountKey.json
```

Ponelo en la misma carpeta que `server.js`.

## Paso 3: Ejecutar

```bash
npm start
```

Probá en el navegador:

```txt
http://localhost:3000
```

Debe responder:

```json
{
  "ok": true,
  "app": "AgustiNYCall Push Backend",
  "status": "activo"
}
```

## Endpoints

### Mensaje

```txt
POST /send-message-push
```

Body:

```json
{
  "receiverUid": "UID_DEL_RECEPTOR",
  "senderName": "Nombre",
  "messageText": "Mensaje"
}
```

### Llamada

```txt
POST /send-call-push
```

Body:

```json
{
  "receiverUid": "UID_DEL_RECEPTOR",
  "callerName": "Nombre",
  "callerEmail": "correo@gmail.com"
}
```

## Importante

No subas `serviceAccountKey.json` al frontend ni a repositorios públicos.

Crítica técnica: este backend manda push, pero el HTML todavía debe llamar a este backend después de enviar mensajes o iniciar llamadas.
