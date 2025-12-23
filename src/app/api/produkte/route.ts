import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { ProductSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('token')?.value || '')
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('token')?.value || '')
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ProductSchema.parse(body)

    // Check if SKU already exists
    if (validatedData.sku) {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: validatedData.sku }
      })
      
      if (existingProduct) {
        return NextResponse.json(
          { error: 'SKU existiert bereits' },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.create({
      data: validatedData
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}