export const getToken = () => {
  const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
  if (SECRET_KEY) return SECRET_KEY;
  else
    return 'fMD8594GyrWc7jmtKexATAw2Ldq7PtsNRJeSE3zXVvfHzjUTy37E6PAnFbhDzep94BF8S6KTcJrUa3GMsjhZNWm8EVaB6SDeA3yw';
};
