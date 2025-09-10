import { users, companies, contacts, contracts, acts, invoices, paymentSchedules, otherDocuments } from "@shared/schema";
import type {
  User, InsertUser, Company, InsertCompany, Contact, InsertContact,
  Contract, InsertContract, Act, InsertAct, Invoice, InsertInvoice,
  PaymentSchedule, InsertPaymentSchedule, OtherDocument, InsertOtherDocument
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByInn(inn: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>; // Added method
  createUser(user: InsertUser): Promise<User>;

  // Company operations
  getCompanyByUserId(userId: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<Company>): Promise<Company | undefined>;

  // Contact operations
  getContactByUserId(userId: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<Contact>): Promise<Contact | undefined>;

  // Contract operations
  getContractsByUserId(userId: number): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;

  // Act operations
  getActsByUserId(userId: number): Promise<Act[]>;
  getActById(id: number): Promise<Act | undefined>;
  createAct(act: InsertAct): Promise<Act>;

  // Invoice operations
  getInvoicesByUserId(userId: number): Promise<Invoice[]>;
  getInvoiceById(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;

  // Payment Schedule operations
  getPaymentSchedulesByUserId(userId: number): Promise<PaymentSchedule[]>;
  getPaymentSchedulesByContract(userId: number, contractNumber: string): Promise<PaymentSchedule[]>;
  createPaymentSchedule(paymentSchedule: InsertPaymentSchedule): Promise<PaymentSchedule>;

  // Other Documents operations
  getOtherDocumentsByUserId(userId: number): Promise<OtherDocument[]>;
  getOtherDocumentById(id: number): Promise<OtherDocument | undefined>;
  createOtherDocument(document: InsertOtherDocument): Promise<OtherDocument>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private contacts: Map<number, Contact>;
  private contracts: Map<number, Contract>;
  private acts: Map<number, Act>;
  private invoices: Map<number, Invoice>;
  private paymentSchedules: Map<number, PaymentSchedule>;
  private otherDocuments: Map<number, OtherDocument>;

  currentUserId: number;
  currentCompanyId: number;
  currentContactId: number;
  currentContractId: number;
  currentActId: number;
  currentInvoiceId: number;
  currentPaymentScheduleId: number;
  currentOtherDocumentId: number;

  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.contacts = new Map();
    this.contracts = new Map();
    this.acts = new Map();
    this.invoices = new Map();
    this.paymentSchedules = new Map();
    this.otherDocuments = new Map();

    this.currentUserId = 1;
    this.currentCompanyId = 1;
    this.currentContactId = 1;
    this.currentContractId = 1;
    this.currentActId = 1;
    this.currentInvoiceId = 1;
    this.currentPaymentScheduleId = 1;
    this.currentOtherDocumentId = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByInn(inn: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.inn === inn,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      inn: insertUser.inn || null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  // Company operations
  async getCompanyByUserId(userId: number): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find(
      (company) => company.userId === userId,
    );
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const newCompany: Company = { ...company, id };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async updateCompany(id: number, companyUpdate: Partial<Company>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;

    const updatedCompany = { ...company, ...companyUpdate };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  // Contact operations
  async getContactByUserId(userId: number): Promise<Contact | undefined> {
    return Array.from(this.contacts.values()).find(
      (contact) => contact.userId === userId,
    );
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const newContact: Contact = { ...contact, id };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async updateContact(id: number, contactUpdate: Partial<Contact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const updatedContact = { ...contact, ...contactUpdate };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  // Contract operations
  async getContractsByUserId(userId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(
      (contract) => contract.userId === userId,
    );
  }

  async getContractById(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const id = this.currentContractId++;
    const newContract: Contract = { ...contract, id };
    this.contracts.set(id, newContract);
    return newContract;
  }

  // Act operations
  async getActsByUserId(userId: number): Promise<Act[]> {
    return Array.from(this.acts.values()).filter(
      (act) => act.userId === userId,
    );
  }

  async getActById(id: number): Promise<Act | undefined> {
    return this.acts.get(id);
  }

  async createAct(act: InsertAct): Promise<Act> {
    const id = this.currentActId++;
    const newAct: Act = { ...act, id };
    this.acts.set(id, newAct);
    return newAct;
  }

  // Invoice operations
  async getInvoicesByUserId(userId: number): Promise<Invoice[]>{
    return Array.from(this.invoices.values()).filter(
      (invoice) => invoice.userId === userId,
    );
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentInvoiceId++;
    const newInvoice: Invoice = { ...invoice, id };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  // Payment Schedule operations
  async getPaymentSchedulesByUserId(userId: number): Promise<PaymentSchedule[]> {
    return Array.from(this.paymentSchedules.values()).filter(
      (paymentSchedule) => paymentSchedule.userId === userId,
    );
  }

  async getPaymentSchedulesByContract(userId: number, contractNumber: string): Promise<PaymentSchedule[]> {
    return Array.from(this.paymentSchedules.values()).filter(
      (paymentSchedule) => paymentSchedule.userId === userId && paymentSchedule.contractNumber === contractNumber,
    );
  }

  async createPaymentSchedule(paymentSchedule: InsertPaymentSchedule): Promise<PaymentSchedule> {
    const id = this.currentPaymentScheduleId++;
    const newPaymentSchedule: PaymentSchedule = { ...paymentSchedule, id };
    this.paymentSchedules.set(id, newPaymentSchedule);
    return newPaymentSchedule;
  }

  // Other Documents operations
  async getOtherDocumentsByUserId(userId: number): Promise<OtherDocument[]> {
    return Array.from(this.otherDocuments.values()).filter(
      (document) => document.userId === userId,
    );
  }

  async getOtherDocumentById(id: number): Promise<OtherDocument | undefined> {
    return this.otherDocuments.get(id);
  }

  async createOtherDocument(document: InsertOtherDocument): Promise<OtherDocument> {
    const id = this.currentOtherDocumentId++;
    const newDocument: OtherDocument = { ...document, id };
    this.otherDocuments.set(id, newDocument);
    return newDocument;
  }
}

export const storage = new MemStorage();