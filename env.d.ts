declare namespace NodeJS {
  export interface ProcessEnv {
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_APP_URL: string;
    STRIPE_API_KEY: string;
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
