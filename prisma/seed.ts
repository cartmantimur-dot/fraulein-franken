import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin User erstellen
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fraulein-franken.de' },
    update: {},
    create: {
      email: 'admin@fraulein-franken.de',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  // Firmeneinstellungen erstellen
  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      firmenname: 'Fräulein Franken – Geschenke für dich',
      adresse: 'Musterstraße 1',
      plz: '12345',
      ort: 'Musterstadt',
      land: 'Deutschland',
      email: 'info@fraulein-franken.de',
      telefon: '+49 123 456789',
      iban: 'DE12345678901234567890',
      bic: 'GENODEF1MRS',
      bank: 'Musterbank',
      steuernummer: '123/456/78901',
      rechnungs_prefix: 'FF',
      rechnungs_startnummer: 1,
      standard_faelligkeit: 14,
      mwst_aktiv: false,
      mwst_satz: 19,
    },
  })

  // Beispielprodukte erstellen
  const products = [
    {
      sku: 'KERZE001',
      name: 'Handgemachte Kerze',
      beschreibung: 'Duftkerze mit Sojawachs',
      kategorie: 'Kerzen',
      einkaufspreis: 3.50,
      verkaufspreis: 8.90,
      bestand_aktuell: 25,
      mindestbestand: 5,
      lagerort: 'Regal A1',
      lieferant: 'Kerzenmanufaktur',
    },
    {
      sku: 'GKORB001',
      name: 'Geschenkkorb Klein',
      beschreibung: 'Kleine Geschenkbox mit verschiedenen Artikeln',
      kategorie: 'Geschenkkörbe',
      einkaufspreis: 12.00,
      verkaufspreis: 24.90,
      bestand_aktuell: 8,
      mindestbestand: 3,
      lagerort: 'Regal B2',
      lieferant: 'Eigenproduktion',
    },
    {
      sku: 'SEIFE001',
      name: 'Seifenset',
      beschreibung: 'Handgemachte Seifen im 3er-Set',
      kategorie: 'Kosmetik',
      einkaufspreis: 8.00,
      verkaufspreis: 18.50,
      bestand_aktuell: 15,
      mindestbestand: 5,
      lagerort: 'Regal C1',
      lieferant: 'Seifenmanufaktur',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
  }

  // Beispielkunden erstellen
  const customers = [
    {
      name: 'Max Mustermann',
      adresse: 'Beispielweg 42',
      plz: '54321',
      ort: 'Beispielstadt',
      land: 'Deutschland',
      email: 'max@example.com',
      telefon: '+49 987 654321',
    },
    {
      name: 'Erika Mustermann',
      firma: 'Musterfirma GmbH',
      adresse: 'Geschäftsstraße 1',
      plz: '98765',
      ort: 'Wirtschaftsstadt',
      land: 'Deutschland',
      email: 'erika@musterfirma.de',
      telefon: '+49 111 222333',
      ust_id: 'DE123456789',
    },
  ]

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer,
    }).catch(() => {
      // Ignore if customer already exists
    })
  }

  console.log('✅ Seed-Daten erfolgreich erstellt!')
  console.log('👤 Admin User: admin@fraulein-franken.de / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })