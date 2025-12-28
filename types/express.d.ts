import "express";

declare module "express" {
  export interface Request {
    userId?: string;
    teamId?: string | null;
    email?: string;
  }
}
