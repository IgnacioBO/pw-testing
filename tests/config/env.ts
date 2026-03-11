export const env = {
  country: getEnv('COUNTRY'),
  appEnv: getEnv('APP_ENV'),

  urls: {
    frontend: getEnv('URL'),
  },

  credentials: {
    user: getEnv('USER'),
    pass: getEnv('PASS'),
  }
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}