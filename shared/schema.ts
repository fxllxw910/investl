import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  inn: text("inn").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  inn: true,
});

export type InsertUser = typeof users.$inferInsert & {
  inn?: string | null;
};
export type User = typeof users.$inferSelect;

// Company table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  inn: text("inn").notNull(),
  kpp: text("kpp"),
  ogrn: text("ogrn"),
  legalAddress: text("legal_address"),
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  userId: true,
  name: true,
  inn: true,
  kpp: true,
  ogrn: true,
  legalAddress: true,
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

// Contact table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name"),
  managerEmail: text("manager_email"),
  email: text("email"),
  phone: text("phone"),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  userId: true,
  name: true,
  managerEmail: true,
  email: true,
  phone: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Contract table
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  number: text("number").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull(),
  filePath: text("file_path"),
});

export const insertContractSchema = createInsertSchema(contracts).pick({
  userId: true,
  number: true,
  date: true,
  type: true,
  amount: true,
  status: true,
  filePath: true,
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

// Act table
export const acts = pgTable("acts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  number: text("number").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(),
  contractNumber: text("contract_number"),
  amount: real("amount"),
  filePath: text("file_path"),
});

export const insertActSchema = createInsertSchema(acts).pick({
  userId: true,
  number: true,
  date: true,
  type: true,
  contractNumber: true,
  amount: true,
  filePath: true,
});

export type InsertAct = z.infer<typeof insertActSchema>;
export type Act = typeof acts.$inferSelect;

// Invoice table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  number: text("number").notNull(),
  date: timestamp("date").notNull(),
  contractNumber: text("contract_number"),
  amount: real("amount").notNull(),
  status: text("status").notNull(),
  filePath: text("file_path"),
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  userId: true,
  number: true,
  date: true,
  contractNumber: true,
  amount: true,
  status: true,
  filePath: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Payment Schedule table
export const paymentSchedules = pgTable("payment_schedules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  paymentNumber: integer("payment_number").notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  contractNumber: text("contract_number").notNull(),
  amount: real("amount").notNull(),
});

export const insertPaymentScheduleSchema = createInsertSchema(paymentSchedules).pick({
  userId: true,
  paymentNumber: true,
  paymentDate: true,
  contractNumber: true,
  amount: true,
});

export type InsertPaymentSchedule = z.infer<typeof insertPaymentScheduleSchema>;
export type PaymentSchedule = typeof paymentSchedules.$inferSelect;

// Other Documents table
export const otherDocuments = pgTable("other_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  filePath: text("file_path"),
});

export const insertOtherDocumentSchema = createInsertSchema(otherDocuments).pick({
  userId: true,
  name: true,
  date: true,
  description: true,
  fileSize: true,
  fileType: true,
  filePath: true,
});

export type InsertOtherDocument = z.infer<typeof insertOtherDocumentSchema>;
export type OtherDocument = typeof otherDocuments.$inferSelect;

// Login schema (for validation)
export const loginSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(1, "Пароль обязателен"),
});

export type LoginData = z.infer<typeof loginSchema>;

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email("Неверный формат email"),
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Текущий пароль обязателен"),
  newPassword: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
    .regex(/[^A-Za-z0-9]/, "Пароль должен содержать хотя бы один специальный символ"),
  confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// Registration schema with validation
export const registrationSchema = insertUserSchema.extend({
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
    .regex(/[^A-Za-z0-9]/, "Пароль должен содержать хотя бы один специальный символ"),
  confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  inn: z.string().min(10, "ИНН должен содержать минимум 10 цифр"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type RegistrationData = z.infer<typeof registrationSchema>;