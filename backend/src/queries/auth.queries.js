export const findUserByUsernameQuery = "SELECT * FROM users WHERE username = ?";
export const findUserByEmailOrUsernameQuery = "SELECT * FROM users WHERE email = ? OR username = ?";
export const insertUserQuery = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
