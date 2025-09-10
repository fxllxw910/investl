import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, loginSchema, registrationSchema, changePasswordSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { validateEmailInnMatch } from "./ftp";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || "investl-secret-123456";

  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: app.get("env") === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register user
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate registration data
      const validatedData = registrationSchema.parse(req.body);

      // Check if user exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Пользователь с таким email уже существует" });
      }

      const existingUserByInn = await storage.getUserByInn(validatedData.inn);
      if (existingUserByInn) {
        return res.status(400).json({ message: "Пользователь с таким ИНН уже существует" });
      }

      // Validate email and INN match in customers.xml
      const validationResult = await validateEmailInnMatch(validatedData.email, validatedData.inn);
      if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.message });
      }

      // Create username from email
      const username = validatedData.email.split('@')[0];

      // Create user
      const user = await storage.createUser({
        username,
        email: validatedData.email,
        inn: validatedData.inn,
        password: await hashPassword(validatedData.password),
      });

      // Log in the user
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password in response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Ошибка валидации", 
          errors: validationError.details 
        });
      }
      next(error);
    }
  });

  // Login
  app.post("/api/login", (req, res, next) => {
    try {
      // Validate login data
      loginSchema.parse(req.body);

      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: "Неверный email или пароль" });
        }

        req.login(user, (err) => {
          if (err) return next(err);
          // Don't send password in response
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Ошибка валидации", 
          errors: validationError.details 
        });
      }
      next(error);
    }
  });

  // Logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Don't send password in response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Reset password request
  app.post("/api/reset-password", async (req, res) => {
    const { email } = req.body;

    const user = await storage.getUserByEmail(email);
    if (!user) {
      // Still return success to prevent email enumeration
      return res.json({ success: true, message: "Если email зарегистрирован, на него отправлены инструкции" });
    }

    // In a real implementation, we would:
    // 1. Generate a token
    // 2. Save it to a database with an expiration
    // 3. Send an email with a reset link

    // For this implementation, just return success
    res.json({ success: true, message: "Если email зарегистрирован, на него отправлены инструкции" });
  });

  // Change password (authenticated)
  app.post("/api/change-password", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = changePasswordSchema.parse(req.body);

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidPassword = await comparePasswords(validatedData.currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Неверный текущий пароль" });
      }

      // Update user password
      user.password = await hashPassword(validatedData.newPassword);

      res.json({ success: true, message: "Пароль успешно изменен" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Ошибка валидации", 
          errors: validationError.details 
        });
      }
      next(error);
    }
  });
}