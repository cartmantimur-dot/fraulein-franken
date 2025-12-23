import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const user = await getUserFromToken(request.cookies.get('token')?.value || '')
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produkt nicht gefunden' },
        { status: 404 }
      )
    }

    // Check if product is used in invoices
    const invoiceItems = await prisma.invoiceItem.findMany({
      where: { productId: resolvedParams.id }
    })

    if (invoiceItems.length > 0) {
      return NextResponse.json(
        { error: 'Produkt wird in Rechnungen verwendet und kann nicht gelöscht werden' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Produkt erfolgreich gelöscht' })

  } catch (error) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}