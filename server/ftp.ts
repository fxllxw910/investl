import { Client } from "basic-ftp";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { InsertContract, InsertAct, InsertInvoice, InsertOtherDocument, InsertPaymentSchedule } from "@shared/schema";
import { parseStringPromise } from "xml2js";

// FTP Configuration
const FTP_HOST = "95.213.131.52";
const FTP_USER = "investl_ftp";
const FTP_PASSWORD = "S2i5R9w8";
const FTP_PORT = 21;

// Local paths for document storage
const BASE_DOWNLOAD_PATH = path.join(process.cwd(), "uploads");

// Ensure upload directories exist
async function ensureDirectories() {
  const dirs = [
    BASE_DOWNLOAD_PATH,
    path.join(BASE_DOWNLOAD_PATH, "contracts"),
    path.join(BASE_DOWNLOAD_PATH, "acts"),
    path.join(BASE_DOWNLOAD_PATH, "invoices"),
    path.join(BASE_DOWNLOAD_PATH, "others"),
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } catch (error) {
      console.log(`Directory ${dir} already exists or couldn't be created:`, error);
    }
  }
}

// Function to connect to FTP server
async function connectToFTP(): Promise<Client> {
  const client = new Client();
  client.ftp.verbose = process.env.NODE_ENV !== "production";

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      port: FTP_PORT,
      secure: false
    });

    console.log("Successfully connected to FTP server");
    return client;
  } catch (error) {
    console.error("Failed to connect to FTP server:", error);
    client.close();
    throw new Error(`Failed to connect to FTP server: ${(error as Error).message}`);
  }
}

// Function to get user INN and email
async function getUserData(userId: number): Promise<{inn: string | null, email: string | null}> {
  const user = await storage.getUser(userId);
  return {
    inn: user?.inn || null,
    email: user?.email || null
  };
}

// Function to categorize documents based on filename and folder name
function categorizeDocument(fileName: string, folderName?: string): 'contract' | 'act' | 'invoice' | 'other' {
  const lowerFileName = fileName.toLowerCase();
  const lowerFolderName = folderName?.toLowerCase() || '';

  // Check folder name first for more accurate categorization
  if (lowerFolderName.includes('akt') || lowerFolderName.includes('акт')) {
    return 'act';
  } else if (lowerFolderName.includes('dogovor') || lowerFolderName.includes('договор') || lowerFolderName.includes('dopsoglashenie')) {
    return 'contract';
  } else if (lowerFolderName.includes('schet') || lowerFolderName.includes('счет') || lowerFolderName.includes('счёт')) {
    return 'invoice';
  }

  // Fallback to filename check
  if (lowerFileName.includes('договор') || lowerFileName.includes('contract') || lowerFileName.includes('dopsoglashenie')) {
    return 'contract';
  } else if (lowerFileName.includes('акт') || lowerFileName.includes('act') || lowerFileName.includes('akt')) {
    return 'act';
  } else if (lowerFileName.includes('счет') || lowerFileName.includes('invoice') || lowerFileName.includes('счёт') || lowerFileName.includes('schet')) {
    return 'invoice';
  }

  return 'other';
}

// Function to extract contract number from path
function extractContractNumber(folderPath: string): string {
  const parts = folderPath.split('/');
  return parts[parts.length - 1] || 'unknown';
}

// Function to get proper document display name
function getDocumentDisplayName(folderName: string, fileName: string): string {
  const lowerFolderName = folderName.toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  // Check folder name patterns first
  if (lowerFolderName === 'akt_priema_peredachi_lizinga') {
    return 'АПП лизинга';
  } else if (lowerFolderName === 'akt_priema_peredachi_postavki') {
    return 'АПП поставки';
  } else if (lowerFolderName === 'akt_vypolnenyh_rabot') {
    return 'Акт работ';
  } else if (lowerFolderName === 'akt') {
    // Changed from 'Акт' to '№ Договора' as per user request for 'Акты' page.
    // However, this function is general. The actual change for the "Акты" page will be in the data preparation for display.
    return '№ Договора';
  } else if (lowerFolderName === 'dogovor_lizinga') {
    return 'Договор лизинга';
  } else if (lowerFolderName === 'dogovor_poruchitelstva') {
    return 'Договор поручительства';
  } else if (lowerFolderName === 'dogovor_postavki') {
    return 'Договор поставки';
  } else if (lowerFolderName === 'dogovor_zaloga') {
    return 'Договор залога';
  } else if (lowerFolderName === 'strahovoy_polis') {
    return 'Полис';
  } else if (lowerFolderName === 'schet_faktura') {
    return 'Счёт фактура';
  } else if (lowerFolderName === 'schet_na_oplatu') {
    return 'Счёт на оплату';
  }

  // Check for numbered documents
  const dopsoglashenieMatch = lowerFolderName.match(/dopsoglashenie_(\d+)/);
  if (dopsoglashenieMatch) {
    return `Доп. соглашение ${dopsoglashenieMatch[1]}`;
  }

  const schetMatch = lowerFolderName.match(/schet_(\d+)/);
  if (schetMatch) {
    return `Счёт ${schetMatch[1]}`;
  }

  // Check filename patterns for additional numbered documents
  const fileNameDopsoglashenieMatch = lowerFileName.match(/dopsoglashenie_(\d+)/);
  if (fileNameDopsoglashenieMatch) {
    return `Доп. соглашение ${fileNameDopsoglashenieMatch[1]}`;
  }

  const fileNameSchetMatch = lowerFileName.match(/schet_(\d+)/);
  if (fileNameSchetMatch) {
    return `Счёт ${fileNameSchetMatch[1]}`;
  }

  // Check for PTS/PSM
  if (lowerFileName.includes('pts') || lowerFileName.includes('psm')) {
    return 'ПТС/ПСМ';
  }

  // Fallback to original folder name
  return folderName;
}

// Function to load customer data and payment schedules from XML
async function loadCustomerDataAndPaymentSchedules(userId: number, userINN: string, userEmail: string): Promise<void> {
  const client = await connectToFTP();

  try {
    // Download customers.xml file
    const localXmlPath = path.join(BASE_DOWNLOAD_PATH, 'customers.xml');
    await client.downloadTo(localXmlPath, '/customers.xml');

    // Parse XML file
    const xmlContent = await fs.readFile(localXmlPath, 'utf8');
    const result = await parseStringPromise(xmlContent);

    // Find customer data by INN or Email
    if (result.ДанныеПоКлиенту) {
      const customersData = Array.isArray(result.ДанныеПоКлиенту) ? result.ДанныеПоКлиенту : [result.ДанныеПоКлиенту];

      for (const customerData of customersData) {
        const customerINN = customerData.ИНН?.[0];
        const customerEmail = customerData.Email?.[0];
        
        if ((customerINN === userINN) || (customerEmail === userEmail)) {
          // Auto-populate company information
          if (customerData.НаименованиеПолное?.[0]) {
            const companyData = {
              userId,
              name: customerData.НаименованиеПолное[0],
              inn: customerINN || userINN,
              kpp: customerData.КПП?.[0] || '',
              ogrn: customerData.ОГРН?.[0] || '',
              legalAddress: customerData.ЮрАдрес?.[0] || ''
            };

            try {
              const existingCompany = await storage.getCompanyByUserId(userId);
              if (existingCompany) {
                await storage.updateCompany(existingCompany.id, companyData);
              } else {
                await storage.createCompany(companyData);
              }
            } catch (error) {
              console.error("Error updating company data:", error);
            }
          }

          // Auto-populate contact information
          if (customerData.МенеджерФИО?.[0] || customerData.Email?.[0] || customerData.Телефон?.[0]) {
            const contactData = {
              userId,
              name: customerData.МенеджерФИО?.[0] || '',
              managerEmail: customerData.МенеджерEmail?.[0] || '',
              email: customerData.Email?.[0] || userEmail,
              phone: customerData.Телефон?.[0] || ''
            };

            try {
              const existingContact = await storage.getContactByUserId(userId);
              if (existingContact) {
                await storage.updateContact(existingContact.id, contactData);
              } else {
                await storage.createContact(contactData);
              }
            } catch (error) {
              console.error("Error updating contact data:", error);
            }
          }

          // Process contracts for this customer
          if (customerData.Договоры?.[0]?.Договор) {
            const contracts = Array.isArray(customerData.Договоры[0].Договор) ? customerData.Договоры[0].Договор : [customerData.Договоры[0].Договор];

            for (const contract of contracts) {
              const contractNumber = contract.Номер?.[0] || 'unknown';
              const contractDate = contract.Дата?.[0] || new Date().toISOString();

              // Process payment schedule (ГрафикПлатежей)
              if (contract.ГрафикПлатежей?.[0]?.Платеж) {
                const payments = Array.isArray(contract.ГрафикПлатежей[0].Платеж) ? contract.ГрафикПлатежей[0].Платеж : [contract.ГрафикПлатежей[0].Платеж];

                for (let i = 0; i < payments.length; i++) {
                  const payment = payments[i];
                  const paymentSchedule: InsertPaymentSchedule = {
                    userId,
                    contractNumber,
                    paymentNumber: i + 1,
                    paymentDate: new Date(payment.Дата?.[0] || contractDate),
                    amount: parseFloat(payment.Сумма?.[0] || '0')
                  };

                  try {
                    await storage.createPaymentSchedule(paymentSchedule);
                  } catch (error) {
                    console.error("Error creating payment schedule:", error);
                  }
                }
              }
            }
          }
        }
      }
    }

    // Clean up temporary XML file
    await fs.unlink(localXmlPath);
  } catch (error) {
    console.error("Error loading customer data and payment schedules:", error);
  } finally {
    client.close();
  }
}

// Main function to fetch documents from FTP
export async function fetchDocumentsFromFTP(userId: number): Promise<any[]> {
  await ensureDirectories();

  const userData = await getUserData(userId);
  if (!userData.inn && !userData.email) {
    throw new Error("User INN or email not found. Please update your profile with INN information.");
  }

  const client = await connectToFTP();
  const documents: any[] = [];

  try {
    // First load customer data and payment schedules
    await loadCustomerDataAndPaymentSchedules(userId, userData.inn || '', userData.email || '');

    // Navigate to user's INN folder (skip if no INN available)
    if (!userData.inn) {
      console.log("No INN available, skipping document folder navigation");
      return documents;
    }
    
    const userPath = `/docs/${userData.inn}`;
    console.log(`Navigating to user path: ${userPath}`);

    try {
      await client.cd(userPath);
    } catch (error) {
      console.log(`User path ${userPath} not found`);
      throw new Error(`Documents folder for INN ${userData.inn} not found on FTP server`);
    }

    // List contract folders
    const contractFolders = await client.list();

    for (const folder of contractFolders) {
      if (folder.type === 2) { // 2 = directory
        const contractNumber = folder.name;
        const contractPath = `${userPath}/${contractNumber}`;

        await client.cd(contractPath);

        // List document type folders
        const docTypeFolders = await client.list();

        for (const docTypeFolder of docTypeFolders) {
          if (docTypeFolder.type === 2) {
            const docTypePath = `${contractPath}/${docTypeFolder.name}`;
            await client.cd(docTypePath);

            // List actual documents
            const documentFiles = await client.list();

            for (const file of documentFiles) {
              if (file.type === 1) { // 1 = file
                const category = categorizeDocument(file.name, docTypeFolder.name);
                const folderName = category === 'other' ? 'others' : category + 's';
                const localPath = path.join(
                  BASE_DOWNLOAD_PATH,
                  folderName,
                  `${contractNumber}_${file.name}`
                );

                try {
                  // Download the file
                  await client.downloadTo(localPath, file.name);
                  console.log(`Downloaded: ${file.name} to ${localPath} (category: ${category})`);

                  // Generate proper document name based on folder and file
                  // If the folder is 'akt', we want to display '№ Договора' as per user request.
                  // However, the categorizeDocument function already returns 'contract' for some cases
                  // and the display logic below will use the contractNumber.
                  // For 'act' category, we will directly use contractNumber for display in the 'Акты' table.
                  let documentDisplayName = getDocumentDisplayName(docTypeFolder.name, file.name);
                  if (category === 'act') {
                    // For acts, the primary identifier is the contract number, not a derived name.
                    documentDisplayName = contractNumber;
                  }

                  // Create database entry based on document type
                  switch (category) {
                    case 'contract':
                      const contract: InsertContract = {
                        userId,
                        number: contractNumber,
                        date: new Date(), // Consider getting a more accurate date if available
                        type: documentDisplayName,
                        amount: 0, // Placeholder, needs to be fetched or calculated
                        status: "Активен",
                        filePath: localPath
                      };
                      const savedContract = await storage.createContract(contract);
                      documents.push({ ...savedContract, category: 'contract' });
                      break;

                    case 'act':
                      const act: InsertAct = {
                        userId,
                        // Changed from `${contractNumber}-ACT-${Date.now()}` to just contractNumber for the "№ Договора" requirement
                        number: contractNumber,
                        date: new Date(), // Consider getting a more accurate date if available
                        type: documentDisplayName, // This will be '№ Договора' for acts from 'akt' folders
                        contractNumber,
                        amount: 0, // Placeholder, needs to be fetched or calculated
                        filePath: localPath
                      };
                      const savedAct = await storage.createAct(act);
                      documents.push({ ...savedAct, category: 'act' });
                      break;

                    case 'invoice':
                      const invoice: InsertInvoice = {
                        userId,
                        number: `${contractNumber}-INV-${Date.now()}`, // Keep original invoice numbering
                        date: new Date(), // Consider getting a more accurate date if available
                        contractNumber,
                        amount: 0, // Placeholder, needs to be fetched or calculated
                        status: "Выставлен",
                        filePath: localPath
                      };
                      const savedInvoice = await storage.createInvoice(invoice);
                      documents.push({ ...savedInvoice, category: 'invoice' });
                      break;

                    default:
                      const otherDoc: InsertOtherDocument = {
                        userId,
                        name: documentDisplayName,
                        date: new Date(), // Consider getting a more accurate date if available
                        description: `${documentDisplayName} - ${contractNumber}`,
                        fileSize: file.size,
                        fileType: path.extname(file.name).toLowerCase(),
                        filePath: localPath
                      };
                      const savedOtherDoc = await storage.createOtherDocument(otherDoc);
                      documents.push({ ...savedOtherDoc, category: 'other' });
                      break;
                  }
                } catch (downloadError) {
                  console.error(`Failed to download ${file.name}:`, downloadError);
                }
              }
            }
            // Return to contract folder
            await client.cd('..');
          }
        }

        // Return to user folder
        await client.cd('..');
      }
    }

    // Add test payment schedules creation
    // This section is added to fulfill the requirement of populating "График платежей" with test data
    // if no existing payments are found for a contract.
    const contracts = await storage.getContractsByUserId(userId);
    for (const contract of contracts) {
      // Check if there are already payments for this contract
      const existingPayments = await storage.getPaymentSchedulesByContract(userId, contract.number);
      if (existingPayments.length === 0) {
        // Create several test payments
        const baseDate = new Date();
        for (let i = 1; i <= 12; i++) {
          const paymentDate = new Date(baseDate);
          paymentDate.setMonth(baseDate.getMonth() + i);

          await storage.createPaymentSchedule({
            userId: userId,
            paymentNumber: i,
            paymentDate: paymentDate,
            contractNumber: contract.number,
            // Ensure amount is a number, default to 0 if calculation fails
            amount: typeof contract.amount === 'number' ? Math.round(contract.amount / 12) : 0
          });
        }
      }
    }

    return documents;
  } catch (error) {
    console.error("Error fetching documents from FTP:", error);
    throw new Error(`Error fetching documents: ${(error as Error).message}`);
  } finally {
    client.close();
  }
}

// Export function to load only customer data (for profile auto-population)
export async function loadCustomerProfileData(userId: number): Promise<void> {
  const userData = await getUserData(userId);
  if (!userData.inn && !userData.email) {
    console.log("User INN or email not found, skipping customer data load");
    return;
  }

  try {
    await loadCustomerDataAndPaymentSchedules(userId, userData.inn || '', userData.email || '');
  } catch (error) {
    console.error("Error loading customer profile data:", error);
    throw error;
  }
}

// Function to validate email and INN match in customers.xml
export async function validateEmailInnMatch(email: string, inn: string): Promise<{ isValid: boolean; message?: string }> {
  const client = await connectToFTP();

  try {
    // Download customers.xml file
    const localXmlPath = path.join(BASE_DOWNLOAD_PATH, 'customers.xml');
    await client.downloadTo(localXmlPath, '/customers.xml');

    // Parse XML file
    const xmlContent = await fs.readFile(localXmlPath, 'utf8');
    const result = await parseStringPromise(xmlContent);

    // Check if either email or INN exists in XML
    if (result.ДанныеПоКлиенту) {
      const customersData = Array.isArray(result.ДанныеПоКлиенту) ? result.ДанныеПоКлиенту : [result.ДанныеПоКлиенту];
      
      let emailFound = false;
      let innFound = false;
      let matchingRecord = null;

      for (const customerData of customersData) {
        const customerINN = customerData.ИНН?.[0];
        const customerEmail = customerData.Email?.[0];
        
        if (customerEmail === email) {
          emailFound = true;
          matchingRecord = customerData;
        }
        
        if (customerINN === inn) {
          innFound = true;
          if (!matchingRecord) {
            matchingRecord = customerData;
          }
        }
      }

      // If email is found in XML but with different INN
      if (emailFound && matchingRecord) {
        const xmlINN = matchingRecord.ИНН?.[0];
        if (xmlINN && xmlINN !== inn) {
          return {
            isValid: false,
            message: `Этот email зарегистрирован с ИНН ${xmlINN} в базе данных. Для регистрации с ИНН ${inn} используйте другой email.`
          };
        }
      }

      // If INN is found in XML but with different email
      if (innFound && matchingRecord) {
        const xmlEmail = matchingRecord.Email?.[0];
        if (xmlEmail && xmlEmail !== email) {
          return {
            isValid: false,
            message: `Этот ИНН зарегистрирован с email ${xmlEmail} в базе данных. Для регистрации с email ${email} используйте другой ИНН.`
          };
        }
      }
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error validating email/INN match:", error);
    // In case of error, allow registration (don't block users due to XML issues)
    return { isValid: true };
  } finally {
    client.close();
  }
}

// Function to download a specific document
export async function downloadDocument(userId: number, filePath: string): Promise<Buffer> {
  try {
    const fileBuffer = await fs.readFile(filePath);
    return fileBuffer;
  } catch (error) {
    console.error("Error reading document file:", error);
    throw new Error("Document file not found or cannot be read");
  }
}