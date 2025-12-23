'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react'

interface Product {
  id: string
  sku?: string
  name: string
  beschreibung?: string
  kategorie?: string
  einkaufspreis: number
  verkaufspreis: number
  bestand_aktuell: number
  mindestbestand: number
  lagerort?: string
  lieferant?: string
  bild_url?: string
  createdAt: string
  updatedAt: string
}

export default function ProduktePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/produkte')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
      return
    }

    try {
      const response = await fetch(`/api/produkte/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert('Fehler beim Löschen des Produkts')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Fehler beim Löschen des Produkts')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.kategorie?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isLowStock = (product: Product) => 
    product.bestand_aktuell < product.mindestbestand

  if (loading || loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <h1 className="text-xl font-semibold text-gray-900 hover:text-primary">
                  ← Dashboard
                </h1>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Produkte</h1>
            </div>
            <Link href="/produkte/neu">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neues Produkt
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Produkte suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sortieren
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.sku && (
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Link href={`/produkte/${product.id}/bearbeiten`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Bestand:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isLowStock(product) ? "destructive" : "secondary"}>
                      {product.bestand_aktuell}
                    </Badge>
                    {isLowStock(product) && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>

                {/* Prices */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Einkauf:</span>
                    <span>€{product.einkaufspreis.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Verkauf:</span>
                    <span className="font-semibold">€{product.verkaufspreis.toFixed(2)}</span>
                  </div>
                </div>

                {/* Additional Info */}
                {(product.kategorie || product.lagerort) && (
                  <div className="space-y-1">
                    {product.kategorie && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kategorie:</span>
                        <Badge variant="outline">{product.kategorie}</Badge>
                      </div>
                    )}
                    {product.lagerort && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lager:</span>
                        <span>{product.lagerort}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {product.beschreibung && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.beschreibung}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Keine Produkte gefunden' : 'Noch keine Produkte'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Versuchen Sie es mit einem anderen Suchbegriff.'
                : 'Erstellen Sie Ihr erstes Produkt, um zu beginnen.'
              }
            </p>
            {!searchTerm && (
              <Link href="/produkte/neu">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Erstes Produkt anlegen
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}