import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {

      const decoded = jwt.verify(token, process.env.SECRET!) as {
        userId: string;
        teamId: string | null;
        email: string;
      };

      req.userId = decoded.userId;
      req.teamId = decoded.teamId;
      req.email = decoded.email;

      next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;

