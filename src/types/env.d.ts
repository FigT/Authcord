declare namespace NodeJS {
  interface ProcessEnv {
    readonly DISCORD_TOKEN: string;
    readonly DISCORD_CLIENT_ID: string;

    readonly DATABASE_URL: string;
  }
}
