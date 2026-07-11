'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Category, Product } from '@/types'
import { Search, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { StaggerContainer, StaggerItem } from '@/components/public/MotionWrapper'

interface MenuGridProps {
  categories: Category[]
  products: Product[]
}

export function MenuGrid({ categories, products }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter products based on search query and selected category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category_id === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchQuery])

  return (
    <div className="space-y-10">
      {/* Search and Categories bar */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between border-b border-zinc-200 pb-8">
        {/* Categories Tab Selector */}
        <div className="flex w-full overflow-x-auto pb-2 md:pb-0 gap-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-5 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${selectedCategory === 'all'
                ? 'bg-[#031636] text-[#ffdea5] shadow-md shadow-[#031636]/15'
                : 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${selectedCategory === category.id
                  ? 'bg-[#031636] text-[#ffdea5] shadow-md shadow-[#031636]/15'
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="ابحث في قائمتنا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border-zinc-200 bg-white text-[#031636] placeholder-zinc-400 focus-visible:ring-[#775a19] focus-visible:border-[#775a19] rounded-full text-right"
          />
        </div>
      </div>

      {/* Products Display Grid (High Density: 4 columns on desktop, 2 on mobile) */}
      {filteredProducts.length > 0 ? (
        <StaggerContainer key={selectedCategory} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <StaggerItem
              key={product.id}
              className={`group relative ${!product.available ? 'opacity-65' : ''}`}
            >
              <Link href={`/products/${product.id}`} className="block h-full relative">
                {/* Card Container for shadow and border background */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#775a19]/10 hover:border-[#775a19]/30 hover:shadow-lg transition-all duration-500 pb-3 flex flex-col h-full justify-between">
                  <div>
                    {/* Image wrapper */}
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-50 border-b border-zinc-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-zinc-300 bg-zinc-50">
                          <ShoppingBag className="h-8 w-8 stroke-[1.5] mb-2" />
                          <span className="text-[9px] uppercase tracking-wider font-semibold">لا توجد صورة</span>
                        </div>
                      )}

                      {/* Sold out overlay */}
                      {!product.available && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <span className="rounded-full border border-red-500/20 bg-red-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                            نفد
                          </span>
                        </div>
                      )}

                      {/* Hover Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    </div>

                    {/* Body Wrapper (Overlapping the image just like the homepage) */}
                    <div className="p-4 text-right bg-white relative z-20 -mt-5 mx-3 rounded-xl shadow-[0_-8px_16px_rgba(0,0,0,0.02)] border border-[#efeded] flex flex-col justify-between min-h-[110px]">
                      <div className="space-y-1">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#031636] group-hover:text-[#775a19] transition-colors leading-tight line-clamp-1">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-[10px] sm:text-xs text-[#44474e] leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer details inside the card */}
                  <div className="px-4 pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between flex-row-reverse text-[9px] sm:text-[10px]">
                    <span className="font-bold uppercase tracking-widest text-[#775a19]">
                      {categories.find((c) => c.id === product.category_id)?.name || 'مشروب'}
                    </span>

                    {product.available ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <Sparkles className="h-3 w-3" />
                        متوفر
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        غير متوفر
                      </span>
                    )}
                  </div>
                </div>

                {/* Floating Circular Price Tag (Positioned exactly like the home page, scaled down) */}
                <div className="absolute -top-2.5 -right-2.5 bg-gradient-to-br from-[#fed488] to-[#ffdea5] text-[#031636] w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-md border-2 border-white transform rotate-12 transition-transform duration-300 group-hover:scale-110 z-30">
                  <span className="text-[10px] font-bold font-sans flex flex-col items-center justify-center leading-none">
                    <span>{Number(product.price).toFixed(0)}</span>
                    <img src="/Saudi_Riyal_Symbol.webp" alt="ر.س" className="h-2.5 w-auto object-contain mt-0.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-2xl">
          <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300 mb-4 stroke-[1.5]" />
          <h3 className="text-zinc-500 font-medium mb-1">لم يتم العثور على أي عناصر</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            لم نجد أي منتجات تطابق معايير بحثك في هذه الفئة حالياً.
          </p>
        </div>
      )}
    </div>
  )
}
