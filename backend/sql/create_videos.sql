CREATE TABLE IF NOT EXISTS bootlegs_videos (
  idbootlegs INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombreBanda VARCHAR(255) NOT NULL,
  lugar TEXT,
  fecha VARCHAR(255),
  tipo VARCHAR(255),
  genero_id INT NULL,
  cantidadDiscos VARCHAR(100),
  formato VARCHAR(100),
  version TEXT,
  almacenamiento TEXT,
  comentario TEXT,
  categoria VARCHAR(20) NOT NULL DEFAULT 'Video',
  peso VARCHAR(100),
  negociable VARCHAR(100)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
