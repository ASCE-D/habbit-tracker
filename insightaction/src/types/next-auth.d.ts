import "next-auth";

declare module "next-auth" {
  interface User {
    isPaid?: boolean;
  }
  
  interface Session {
    user: User & {
      isPaid?: boolean;
    }
  }
} 