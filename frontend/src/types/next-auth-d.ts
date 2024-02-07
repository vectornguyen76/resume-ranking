import { JWT } from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    userId?: number;
    accessTokenExp?: number;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      userId?: number;
    } & DefaultSession["user"];
    access_token?: string;
    refresh_token?: string;
    accessTokenExp?: number;
  }
}
