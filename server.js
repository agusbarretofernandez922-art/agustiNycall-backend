const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// IMPORTANTE:
// Reemplazá serviceAccountKey.example.json por tu archivo real:
// serviceAccountKey.json
//
// Ese archivo NO se sube al frontend.
// Ese archivo NO se comparte.
// Ese archivo va solamente en este backend.
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coca-f46df-default-rtdb.firebaseio.com"
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    app: "AgustiNYCall Push Backend",
    status: "activo"
  });
});

app.post("/send-message-push", async (req, res) => {
  try {
    const { receiverUid, senderName, messageText } = req.body;

    if (!receiverUid || !messageText) {
      return res.status(400).json({
        ok: false,
        error: "Faltan datos: receiverUid y messageText son obligatorios"
      });
    }

    const tokenSnap = await admin
      .database()
      .ref("fcmTokens/" + receiverUid + "/token")
      .once("value");

    const token = tokenSnap.val();

    if (!token) {
      return res.status(404).json({
        ok: false,
        error: "El usuario no tiene token FCM guardado"
      });
    }

    await admin.messaging().send({
      token,
      notification: {
        title: senderName || "AgustiNYCall",
        body: messageText
      },
      webpush: {
        notification: {
          icon: "https://ui-avatars.com/api/?name=NY&background=050509&color=00ffcc&size=192",
          badge: "https://ui-avatars.com/api/?name=NY&background=050509&color=00ffcc&size=192"
        }
      }
    });

    return res.json({
      ok: true,
      message: "Push enviado"
    });

  } catch (error) {
    console.error("Error enviando push:", error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.post("/send-call-push", async (req, res) => {
  try {
    const { receiverUid, callerName, callerEmail } = req.body;

    if (!receiverUid) {
      return res.status(400).json({
        ok: false,
        error: "Falta receiverUid"
      });
    }

    const tokenSnap = await admin
      .database()
      .ref("fcmTokens/" + receiverUid + "/token")
      .once("value");

    const token = tokenSnap.val();

    if (!token) {
      return res.status(404).json({
        ok: false,
        error: "El usuario no tiene token FCM guardado"
      });
    }

    await admin.messaging().send({
      token,
      notification: {
        title: "Llamada entrante",
        body: `${callerName || callerEmail || "Un usuario"} te está llamando`
      },
      webpush: {
        notification: {
          icon: "https://ui-avatars.com/api/?name=NY&background=050509&color=00ffcc&size=192",
          badge: "https://ui-avatars.com/api/?name=NY&background=050509&color=00ffcc&size=192"
        }
      }
    });

    return res.json({
      ok: true,
      message: "Push de llamada enviado"
    });

  } catch (error) {
    console.error("Error enviando push de llamada:", error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor push activo en puerto " + PORT);
});
