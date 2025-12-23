import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('token')?.value || '')
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    // Gesamtprodukte
    const totalProducts = await prisma.product.count()

    // Niedrige Bestände
    const lowStockProducts = await prisma.product.count({
      where: {
        bestand_aktuell: {
          lt: prisma.product.fields.mindestbestand
        }
      }
    })

    // Gesamtkunden
    const totalCustomers = await prisma.customer.count()

    // Offene Rechnungen
    const openInvoices = await prisma.invoice.count({
      where: {
        status: {
          in: ['ENTWURF', 'GESCHICKT']
        }
      }
    })

    // Gesamtumsatz (bezahlte Rechnungen)
    const totalRevenue = await prisma.invoice.aggregate({
      where: {
        status: 'BEZAHLT'
      },
      _sum: {
        summe_brutto: true
      }
    })

    return NextResponse.json({
      totalProducts,
      lowStockProducts,
      totalCustomers,
      openInvoices,
      totalRevenue: totalRevenue._sum.summe_brutto || 0
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}