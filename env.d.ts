declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: string;
    DATABASE_URL: string;
    ENVRIONMENT: "development" | "production";
  }
}
