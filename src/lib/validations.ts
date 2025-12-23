import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort erforderlich'),
})

export const ProductSchema = z.object({
  sku: z.string().optional(),
  name: z.string().min(1, 'Produktname erforderlich'),
  beschreibung: z.string().optional(),
  kategorie: z.string().optional(),
  einkaufspreis: z.number().min(0, 'Einkaufspreis muss positiv sein'),
  verkaufspreis: z.number().min(0, 'Verkaufspreis muss positiv sein'),
  bestand_aktuell: z.number().min(0, 'Bestand muss positiv sein'),
  mindestbestand: z.number().min(0, 'Mindestbestand muss positiv sein'),
  lagerort: z.string().optional(),
  lieferant: z.string().optional(),
  bild_url: z.string().url().optional().or(z.literal('')),
})

export const CustomerSchema = z.object({
  name: z.string().min(1, 'Kundenname erforderlich'),
  firma: z.string().optional(),
  adresse: z.string().optional(),
  plz: z.string().optional(),
  ort: z.string().optional(),
  land: z.string().optional(),
  email: z.string().email('Ungültige E-Mail-Adresse').optional().or(z.literal('')),
  telefon: z.string().optional(),
  ust_id: z.string().optional(),
  notizen: z.string().optional(),
})

export const InvoiceItemSchema = z.object({
  productId: z.string().optional(),
  titel: z.string().min(1, 'Positionstitel erforderlich'),
  menge: z.number().min(1, 'Menge muss mindestens 1 sein'),
  einzelpreis: z.number().min(0, 'Einzelpreis muss positiv sein'),
})

export const InvoiceSchema = z.object({
  kundeId: z.string().min(1, 'Kunde erforderlich'),
  rechnungsdatum: z.date(),
  leistungsdatum: z.date(),
  faelligkeitsdatum: z.date(),
  rabatt: z.number().min(0).optional(),
  versand: z.number().min(0).optional(),
  positionen: z.array(InvoiceItemSchema).min(1, 'Mindestens eine Position erforderlich'),
  notizen: z.string().optional(),
})

export const SettingsSchema = z.object({
  firmenname: z.string().min(1, 'Firmenname erforderlich'),
  adresse: z.string().optional(),
  plz: z.string().optional(),
  ort: z.string().optional(),
  land: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefon: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
  bank: z.string().optional(),
  steuernummer: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  rechnungs_prefix: z.string().min(1, 'Präfix erforderlich'),
  rechnungs_startnummer: z.number().min(1, 'Startnummer muss mindestens 1 sein'),
  standard_faelligkeit: z.number().min(1, 'Fälligkeit muss mindestens 1 Tag sein'),
  mwst_aktiv: z.boolean(),
  mwst_satz: z.number().min(0).max(100),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type ProductInput = z.infer<typeof ProductSchema>
export type CustomerInput = z.infer<typeof CustomerSchema>
export type InvoiceInput = z.infer<typeof InvoiceSchema>
export type SettingsInput = z.infer<typeof SettingsSchema>