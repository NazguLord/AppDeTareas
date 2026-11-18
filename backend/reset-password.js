import readline from 'node:readline';
import { Writable } from 'node:stream';
import bcrypt from 'bcryptjs';
import { db } from './src/config/db.js';

const username = process.argv[2];

if (!username || !process.stdin.isTTY) {
  console.error('Uso: npm run reset-password -- NOMBRE_USUARIO (desde una terminal interactiva).');
  process.exitCode = 1;
} else {
  const mutedOutput = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
  const prompt = (message) => new Promise((resolve) => {
    process.stdout.write(message);
    const reader = readline.createInterface({ input: process.stdin, output: mutedOutput, terminal: true });
    reader.question('', (answer) => {
      reader.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });

  try {
    const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (users.length !== 1) throw new Error('No se encontró una cuenta única con ese usuario.');

    const password = await prompt('Nueva contraseña (no se mostrará): ');
    const confirmation = await prompt('Repite la contraseña: ');
    if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
    if (password !== confirmation) throw new Error('Las contraseñas no coinciden.');

    const hash = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, users[0].id]);
    console.log('Contraseña actualizada. Ya puedes iniciar sesión.');
  } catch (error) {
    console.error(`No se pudo actualizar la contraseña: ${error.message}`);
    process.exitCode = 1;
  }
}

await db.end();
