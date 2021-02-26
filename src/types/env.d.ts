declare namespace NodeJS {
  export interface ProcessEnv {
    SESSION_SECRET : string;
    CLIENT_PORT : string;
    DATABASE_URL : string;
    REDIS_HOST : string;
    REDIS_PORT : string;
    REDIS_PASSWORD : string;
  }
}
