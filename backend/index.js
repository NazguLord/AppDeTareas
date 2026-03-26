import express from "express";
import mysql from "mysql2";
import cors from "cors";
import moment from "moment";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8800);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "change-me";

const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistemahogar",
  port: Number(process.env.DB_PORT || 3306),
});

app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

const storageB = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/src/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadB = multer({ storage: storageB });

app.post("/medicamentos", uploadB.single("imagen"), function (req, res) {
  const imagen = req.file.filename;
  const fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const q = "INSERT INTO medicamentos (`nombreMedicamento`, `descripcion`, `cantidad`, `unidadMedida`, `imagen`, `fecha`) VALUES (?)";
  const values = [
    req.body.nombreMedicamento,
    req.body.descripcion,
    req.body.cantidad,
    req.body.unidadMedida,
    imagen,
    fecha,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/medicamentos", (req, res) => {
  const q = "SELECT * FROM medicamentos";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/", (req, res) => {
  res.json("Hola esta es el backend");
});

app.get("/contactos", (req, res) => {
  const q = "SELECT * FROM contactos";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/contactos", (req, res) => {
  const q = "INSERT INTO contactos (`name`, `number`, `email`, `image`) VALUES (?)";
  const values = [req.body.name, req.body.number, req.body.email, req.body.image];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.delete("/contactos/:id", (req, res) => {
  const contactoId = req.params.id;
  const q = "DELETE FROM contactos WHERE id = ?";

  db.query(q, [contactoId], (err, data) => {
    if (err) return res.json(err);
    return res.json("El contacto a sido eliminado correctamente.");
  });
});

app.put("/contactos/:id/edit", (req, res) => {
  const contactoId = req.params.id;
  const q = "UPDATE contactos SET `name` = ?, `number` = ?, `email` = ?, `image` = ? WHERE id = ?";
  const values = [req.body.name, req.body.number, req.body.email, req.body.image];

  db.query(q, [...values, contactoId], (err, data) => {
    if (err) return res.json(err);
    return res.json("El contacto se actualizo correctamente.");
  });
});

app.get("/tareas", (req, res) => {
  const q = "SELECT * FROM tareas ORDER BY id DESC LIMIT 5";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/registros", (req, res) => {
  const q = "SELECT id, tituloTarea, cantidad, DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha FROM tareas ORDER BY fecha DESC";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/audios", (req, res) => {
  const q = "SELECT idbootlegs, nombreBanda, lugar, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, tipo, cantidadDiscos, formato, version, almacenamiento, comentario, categoria, peso, negociable FROM bootlegs ORDER BY nombreBanda, fecha";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/total", (req, res) => {
  const q = "SELECT SUM(cantidad) AS Total FROM tareas";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/tareas", (req, res) => {
  const fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const q = "INSERT INTO tareas (`tituloTarea`, `cantidad`, `fecha`) VALUES (?)";
  const values = [req.body.tituloTarea, req.body.cantidad, fecha];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/form", (req, res) => {
  const q = "INSERT INTO bootlegs (`nombreBanda`, `lugar`, `fecha`, `tipo`, `cantidadDiscos`, `formato`, `version`, `almacenamiento`, `comentario`, `categoria`, `peso`, `negociable`) VALUES (?)";
  const values = [
    req.body.nombreBanda,
    req.body.lugar,
    req.body.fecha,
    req.body.tipo,
    req.body.cantidadDiscos,
    req.body.formato,
    req.body.version,
    req.body.almacenamiento,
    req.body.comentario,
    req.body.categoria,
    req.body.peso,
    req.body.negociable,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.delete("/tareas/:id", (req, res) => {
  const tareaId = req.params.id;
  const q = "DELETE FROM tareas WHERE id = ?";

  db.query(q, [tareaId], (err, data) => {
    if (err) return res.json(err);
    return res.json("La tarea se ha eliminado satisfactoriamente.");
  });
});

app.put("/tareas/:id", (req, res) => {
  const tareaId = req.params.id;
  const q = "UPDATE tareas SET `tituloTarea` = ?, `cantidad` = ? WHERE id = ?";
  const values = [req.body.tituloTarea, req.body.cantidad];

  db.query(q, [...values, tareaId], (err, data) => {
    if (err) return res.json(err);
    return res.json("La tarea se ha actualizado satisfactoriamente.");
  });
});

app.post("/register", (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Ya existe el usuario");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const insertQuery = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(insertQuery, [values], (insertErr) => {
      if (insertErr) return res.status(500).json(insertErr);
      return res.status(200).json("Usuario creado.");
    });
  });
});

app.post("/login", (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("Usuario no encontrado!");

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json("Usuario o password equivocado!");

    const token = jwt.sign({ id: data[0].id }, JWT_SECRET);
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .status(200)
      .json(other);
  });
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    })
    .status(200)
    .json("Usuario a sido deslogeado");
});

app.listen(PORT, () => {
  console.log(`Conectado al backend en el puerto ${PORT}`);
});
