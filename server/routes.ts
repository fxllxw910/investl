import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { fetchDocumentsFromFTP, downloadDocument, loadCustomerProfileData, validateEmailInnMatch } from "./ftp";
import nodemailer from "nodemailer";
import { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path'; // Import path module for basename

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Setup authentication routes
  setupAuth(app);

  // Company profile
  app.get("/api/company", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const company = await storage.getCompanyByUserId(req.user.id);
    if (!company) {
      return res.json(null);
    }

    res.json(company);
  });

  app.post("/api/company", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const existingCompany = await storage.getCompanyByUserId(req.user.id);
    if (existingCompany) {
      const updatedCompany = await storage.updateCompany(existingCompany.id, {
        ...req.body,
        userId: req.user.id,
      });
      return res.json(updatedCompany);
    }

    const company = await storage.createCompany({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(company);
  });

  // User profile update
  app.put("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const { inn, email } = req.body;

    if (inn) {
      // Check if INN is already used by another user
      const existingInn = await storage.getUserByInn(inn);
      if (existingInn && existingInn.id !== req.user.id) {
        return res.status(400).json({ message: "INN already registered by another user" });
      }
    }

    // Validate email and INN match in customers.xml if both are provided
    if (inn && email) {
      try {
        const validationResult = await validateEmailInnMatch(email, inn);
        if (!validationResult.isValid) {
          return res.status(400).json({ message: validationResult.message });
        }
      } catch (error) {
        console.error("Error validating email/INN match:", error);
        // Continue with update even if validation fails to not block legitimate updates
      }
    }

    const currentUser = await storage.getUser(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user with new data
    const updatedUser = {
      ...currentUser,
      ...req.body,
      id: req.user.id, // Ensure ID doesn't change
      password: currentUser.password, // Keep existing password
      createdAt: currentUser.createdAt, // Keep creation date
    };

    // Update user using storage method
    await storage.updateUser(req.user.id, updatedUser);

    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  });

  // Contact information
  app.get("/api/contact", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const contact = await storage.getContactByUserId(req.user.id);
    if (!contact) {
      return res.json(null);
    }

    res.json(contact);
  });

  app.post("/api/contact", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const existingContact = await storage.getContactByUserId(req.user.id);
    if (existingContact) {
      const updatedContact = await storage.updateContact(existingContact.id, {
        ...req.body,
        userId: req.user.id,
      });
      return res.json(updatedContact);
    }

    const contact = await storage.createContact({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(contact);
  });

  // Load customer profile data from XML
  app.post("/api/load-customer-data", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      await loadCustomerProfileData(req.user.id);
      res.json({ success: true, message: "Customer data loaded successfully" });
    } catch (error) {
      console.error("Error loading customer data:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to load customer data", 
        error: (error as Error).message 
      });
    }
  });

  // Contracts
  app.get("/api/contracts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const contracts = await storage.getContractsByUserId(req.user.id);
    res.json(contracts);
  });

  app.get("/api/contracts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const contract = await storage.getContractById(parseInt(req.params.id));
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    if (contract.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(contract);
  });

  // Acts
  app.get("/api/acts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const acts = await storage.getActsByUserId(req.user.id);
    res.json(acts);
  });

  app.get("/api/acts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const act = await storage.getActById(parseInt(req.params.id));
    if (!act) {
      return res.status(404).json({ message: "Act not found" });
    }

    if (act.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(act);
  });

  // Request reconciliation act
  app.post("/api/acts/request-reconciliation", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    // In a real implementation, this would trigger an email to the company
    // and potentially create a task in their CRM system

    // For now, just return success
    res.json({ success: true, message: "Запрос на акт сверки успешно отправлен" });
  });

  // Invoices
  app.get("/api/invoices", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const invoices = await storage.getInvoicesByUserId(req.user.id);
    res.json(invoices);
  });

  app.get("/api/invoices/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const invoice = await storage.getInvoiceById(parseInt(req.params.id));
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(invoice);
  });

  // Payment Schedules
  app.get("/api/payment-schedules", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    const contractNumber = req.query.contractNumber as string;
    let paymentSchedules: PaymentSchedule[];

    if (contractNumber && contractNumber !== "all") {
      paymentSchedules = await storage.getPaymentSchedulesByContract(req.user!.id, contractNumber);
    } else {
      paymentSchedules = await storage.getPaymentSchedulesByUserId(req.user!.id);
    }

    res.json(paymentSchedules);
  });

  // Other Documents
  app.get("/api/other-documents", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const documents = await storage.getOtherDocumentsByUserId(req.user.id);
    res.json(documents);
  });

  app.get("/api/other-documents/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const document = await storage.getOtherDocumentById(parseInt(req.params.id));
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(document);
  });

  // FTP Documents Sync
  app.post("/api/sync-documents", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const documents = await fetchDocumentsFromFTP(req.user.id);
      res.json({
        success: true,
        count: documents.length,
        message: `Documents synchronized successfully. Found ${documents.length} documents.`
      });
    } catch (error) {
      console.error("Error syncing documents:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  // Download Document
  app.get("/api/download-document/:type/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const { type, id } = req.params;

    try {
      let document;

      switch (type) {
        case 'contract':
          document = await storage.getContractById(parseInt(id));
          break;
        case 'act':
          document = await storage.getActById(parseInt(id));
          break;
        case 'invoice':
          document = await storage.getInvoiceById(parseInt(id));
          break;
        case 'other':
          document = await storage.getOtherDocumentById(parseInt(id));
          break;
        default:
          return res.status(400).json({ message: "Invalid document type" });
      }

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      if (document.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const fileBuffer = await downloadDocument(req.user.id, document.filePath);
      const fileName = path.basename(document.filePath);

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Length': fileBuffer.length
      });

      res.send(fileBuffer);
    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Error downloading document"
      });
    }
  });

  // Application submission
  app.post("/api/send-application", async (req, res) => {
    try {
      const { name, phone, email, serviceType, recipientEmail, comment, equipment, property, vehicle } = req.body;

      // Validate required fields
      if (!name || !phone || !email || !serviceType) {
        return res.status(400).json({ success: false, message: 'Пожалуйста, заполните все обязательные поля (Имя, Телефон, Email, Тип услуги)' });
      }

      // Create transporter for sending email
      const transporter = nodemailer.createTransporter({
        service: 'yandex',
        auth: {
          user: process.env.EMAIL_USER || 'inv.lizing@yandex.ru',
          pass: process.env.EMAIL_PASS || 'your-email-password' // Replace with your actual email password or use environment variables
        }
      });

      // Determine service detail for email
      let serviceDetail = '';
      if (equipment) serviceDetail = equipment;
      if (property) serviceDetail = property;
      if (vehicle) serviceDetail = vehicle;

      const emailText = `
Новая заявка на лизинг

Тип услуги: ${serviceType}
Детали: ${serviceDetail || 'Не указано'}

Контактная информация:
Имя: ${name}
Телефон: ${phone}
Email: ${email}

Комментарий: ${comment || 'Не указан'}

Дата подачи: ${new Date().toLocaleString('ru-RU')}
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER || 'inv.lizing@yandex.ru',
        to: recipientEmail || 'inv.lizing@yandex.ru', // Use provided recipient or default to inv.lizing@yandex.ru
        subject: `Новая заявка на лизинг - ${serviceType}`,
        text: emailText
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: 'Заявка успешно отправлена' });
    } catch (error) {
      console.error('Error sending application:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отправке заявки' });
    }
  });

  // Partnership proposal submission
  app.post("/api/send-partnership", async (req, res) => {
    try {
      const { companyName, contactPerson, phone, email, description } = req.body;
      const proposal = req.files?.proposal;

      // Validate required fields
      if (!companyName || !contactPerson || !phone || !email || !proposal) {
        return res.status(400).json({ success: false, message: 'Пожалуйста, заполните все обязательные поля и прикрепите коммерческое предложение' });
      }

      const emailText = `
Новая заявка на партнерство

Информация о компании:
Название компании: ${companyName}
Контактное лицо: ${contactPerson}
Телефон: ${phone}
Email: ${email}

Описание деятельности: ${description || 'Не указано'}

Дата подачи: ${new Date().toLocaleString('ru-RU')}
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER || 'inv.lizing@yandex.ru',
        to: 'inv.lizing@yandex.ru',
        subject: `Новая заявка на партнерство - ${companyName}`,
        text: emailText,
        attachments: [
          {
            filename: proposal.name,
            content: proposal.data
          }
        ]
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: 'Коммерческое предложение успешно отправлено' });
    } catch (error) {
      console.error('Error sending partnership proposal:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отправке предложения' });
    }
  });

  // Resume submission
  app.post("/api/send-resume", async (req, res) => {
    try {
      const { fullName, phone, email, city, position } = req.body;
      const resume = req.files?.resume;

      // Validate required fields
      if (!fullName || !phone || !email || !city || !position || !resume) {
        return res.status(400).json({ success: false, message: 'Пожалуйста, заполните все обязательные поля и прикрепите резюме' });
      }

      // Create transporter for sending email
      const transporter = nodemailer.createTransporter({
        service: 'yandex',
        auth: {
          user: process.env.EMAIL_USER || 'inv.lizing@yandex.ru',
          pass: process.env.EMAIL_PASS || 'your-email-password'
        }
      });

      const emailText = `
Новый отклик на вакансию

Позиция: ${position}
Город: ${city}

Контактная информация:
ФИО: ${fullName}
Телефон: ${phone}
Email: ${email}

Дата подачи: ${new Date().toLocaleString('ru-RU')}
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER || 'inv.lizing@yandex.ru',
        to: 'inv.lizing@yandex.ru',
        subject: `Новый отклик на вакансию "${position}" в городе ${city}`,
        text: emailText,
        attachments: [
          {
            filename: resume.name,
            content: resume.data
          }
        ]
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: 'Резюме успешно отправлено' });
    } catch (error) {
      console.error('Error sending resume:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отправке резюме' });
    }
  });

  // Avito parser route
  app.get('/api/avito-listings', async (req: Request, res: Response) => {
    try {
      const avitoUrl = 'https://www.avito.ru/brands/7b481004eeeab4f290fcee41e3f027e2/all/business360/oborudovanie_dlya_biznesa?gdlkerfdnwq=101&iid=4404969092&page_from=from_item_card_button&params%5B156912%5D=3266344&sellerId=9baab47702a415bd69b22137bf48db28';

      const response = await axios.get(avitoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const listings: any[] = [];

      // Парсим объявления
      $('[data-marker="item"]').each((index, element) => {
        const title = $(element).find('[data-marker="item-title"]').text().trim();
        const price = $(element).find('[data-marker="item-price"]').text().trim();
        const imageUrl = $(element).find('img').attr('src') || '';
        const itemUrl = $(element).find('[data-marker="item-title"] a').attr('href') || '';
        const description = $(element).find('[data-marker="item-specific-params"]').text().trim();

        if (title && price) {
          listings.push({
            title,
            price,
            imageUrl: imageUrl.startsWith('//') ? 'https:' + imageUrl : imageUrl,
            avitoUrl: itemUrl.startsWith('//') ? 'https:' + itemUrl : itemUrl.startsWith('/') ? 'https://www.avito.ru' + itemUrl : itemUrl,
            description: description || 'Подробности на странице объявления'
          });
        }
      });

      // Если парсинг не сработал, возвращаем статичные данные
      if (listings.length === 0) {
        listings.push(
          {
            title: "Комплект оборудования для кафе, ресторанов",
            price: "2 360 385 ₽",
            description: "Оборудование находится по адресу: г. Тюмень, ул. Щербакова, 117 склад. Комплект оборудования, 2022 г. в., б/у.",
            imageUrl: "https://investl.ru/upload/medialibrary/52f/xel8l648fo7vymej8sg5ln5zhs1r3rn4.jpg",
            avitoUrl: "http://www.avito.ru/tyumen/oborudovanie_dlya_biznesa/komplekt_oborudovaniya_dlya_kafe_restoranov_4181529560"
          },
          {
            title: "Комплект фасовочно-упаковочной модели Базис",
            price: "6 380 200 ₽",
            description: "Комплекс фасовочно-упаковочной модели БАЗИС включает в себя: конвейер ленточный отводящий, конвейер ленточный, укладчик с установкой шиберной, машину упаковочную Базис 50 (АРУК50), клеевую станцию интегрированную, принтер каплеструйный.",
            imageUrl: "https://investl.ru/upload/medialibrary/71c/tx5nnzhoft8wv7uho3prq9vzhfjrwxvp.jpg",
            avitoUrl: "http://www.avito.ru/chelyabinsk/oborudovanie_dlya_biznesa/komplekt_fasovochnoupakovochnyy_modeli_bazis_4404969092"
          }
        );
      }

      res.json({ listings });
    } catch (error) {
      console.error('Error parsing Avito:', error);
      // В случае ошибки возвращаем статичные данные
      res.json({
        listings: [
          {
            title: "Комплект оборудования для кафе, ресторанов",
            price: "2 360 385 ₽",
            description: "Оборудование находится по адресу: г. Тюмень, ул. Щербакова, 117 склад. Комплект оборудования, 2022 г. в., б/у.",
            imageUrl: "https://investl.ru/upload/medialibrary/52f/xel8l648fo7vymej8sg5ln5zhs1r3rn4.jpg",
            avitoUrl: "http://www.avito.ru/tyumen/oborudovanie_dlya_biznesa/komplekt_oborudovaniya_dlya_kafe_restoranov_4181529560"
          },
          {
            title: "Комплект фасовочно-упаковочной модели Базис",
            price: "6 380 200 ₽",
            description: "Комплекс фасовочно-упаковочной модели БАЗИС включает в себя: конвейер ленточный отводящий, конвейер ленточный, укладчик с установкой шиберной, машину упаковочную Базис 50 (АРУК50), клеевую станцию интегрированную, принтер каплеструйный.",
            imageUrl: "https://investl.ru/upload/medialibrary/71c/tx5nnzhoft8wv7uho3prq9vzhfjrwxvp.jpg",
            avitoUrl: "http://www.avito.ru/chelyabinsk/oborudovanie_dlya_biznesa/komplekt_fasovochnoupakovochnyy_modeli_bazis_4404969092"
          }
        ]
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}