import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Добавляем id к пользователю в сессии
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string; // Добавляем id к токену JWT
    name: string; // Добавляем name к токену JWT
    email: string; // Добавляем email к токену JWT
  }
} 
