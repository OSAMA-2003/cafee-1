import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductById, getProductsByCategory } from '@/actions/products'
import { getCategories } from '@/actions/categories'
import { ArrowRight, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react'
import { FadeIn, SlideIn } from '@/components/public/MotionWrapper'

export const revalidate = 0

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params

  // Fetch product details
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  // Fetch categories and other products of the same category in parallel
  const [categories, allCategoryProducts] = await Promise.all([
    getCategories(),
    getProductsByCategory(product.category_id),
  ])

  const categoryName = categories.find((c) => c.id === product.category_id)?.name || 'مأكولات'

  // Filter out the current product from the recommendations
  const similarProducts = allCategoryProducts.filter((p) => p.id !== product.id && p.available)

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#031636] pb-24 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffdea5]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#775a19]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 relative z-10">
        {/* Back Button */}
        <div className="mb-10 flex justify-start">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#775a19]/10 text-xs font-bold text-[#775a19] hover:bg-[#031636] hover:text-[#ffdea5] hover:border-[#031636] transition-all duration-300 shadow-sm"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للمنيو </span>

          </Link>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          {/* Product Image Column */}
          <div className="lg:col-span-6 flex justify-center">
            <FadeIn duration={0.8} className="w-full max-w-lg aspect-[4/5] relative rounded-3xl overflow-hidden border border-[#775a19]/15 shadow-xl bg-white group">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-zinc-300 bg-zinc-50/50">
                  <ShoppingBag className="h-16 w-16 stroke-[1.2] mb-3 text-zinc-400" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">لا توجد صورة</span>
                </div>
              )}

              {/* Floating Price Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-br from-[#fed488] to-[#ffdea5] text-[#031636] w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white transform rotate-12 transition-transform duration-300 group-hover:scale-110">
                <span className="text-sm font-bold font-sans flex flex-col items-center justify-center leading-none">
                  <span className="text-lg">{Number(product.price).toFixed(0)}</span>
                  <img src="/Saudi_Riyal_Symbol.webp" alt="ر.س" className="h-3.5 w-auto object-contain mt-1" />
                </span>
              </div>

              {/* Availability Overlay if unavailable */}
              {!product.available && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="rounded-full border border-red-500/30 bg-red-950/90 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-red-400 shadow-lg">
                    نفد من المخزن
                  </span>
                </div>
              )}
            </FadeIn>
          </div>

          {/* Product Description Column */}
          <div className="lg:col-span-6 text-right">
            <SlideIn direction="left" duration={0.7} className="space-y-6">
              {/* Category tag */}
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#775a19]/10 text-xs font-bold text-[#775a19] tracking-wider">
                {categoryName}
              </span>

              {/* Product Title */}
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#031636] leading-tight">
                {product.name}
              </h1>

              {/* Price & Availability details row */}
              <div className="flex items-center gap-6 justify-end py-2 border-y border-[#775a19]/10">
                {/* Availability Badge */}
                {product.available ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full text-xs border border-emerald-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    متوفر حالياً
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-bold text-red-500 bg-red-50 px-3.5 py-1.5 rounded-full text-xs border border-red-100">
                    <AlertCircle className="h-3.5 w-3.5" />
                    غير متوفر
                  </span>
                )}

                {/* Price Display */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-sans text-[#775a19]">
                    {Number(product.price).toFixed(2)}
                  </span>
                  <img src="/Saudi_Riyal_Symbol.webp" alt="ر.س" className="h-5 w-auto object-contain" />
                </div>
              </div>

              {/* Description details */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#031636]">الوصف:</h3>
                <p className="text-sm sm:text-base text-[#44474e] leading-relaxed max-w-xl">
                  {product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً. ولكننا نضمن لك جودته ومكوناته الطازجة المحضرة بكل حب.'}
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-6 grid grid-cols-2 gap-4 border-t border-zinc-200/60">
                <div className="bg-white p-4 rounded-xl border border-zinc-200/50 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-zinc-400 mb-1">المكونات</span>
                  <span className="text-xs font-bold text-[#031636]">طازجة 100%</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200/50 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-zinc-400 mb-1">التحضير</span>
                  <span className="text-xs font-bold text-[#031636]">يومي وشغوف</span>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>

        {/* Similar Products Slider Section */}
        {similarProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-[#775a19]/10 relative">
            <SlideIn direction="up">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-[#031636]">
                  قد يعجبك أيضاً
                </h2>
                <p className="text-xs text-[#44474e] mt-2">
                  اكتشف المزيد من خياراتنا المميزة في فئة {categoryName}
                </p>
                <div className="h-0.5 w-16 bg-[#775a19] mx-auto mt-4"></div>
              </div>
            </SlideIn>

            {/* Slider Container (Pauses on Hover via .slider-container in globals.css) */}
            <div className="slider-container py-4 relative overflow-hidden" dir="ltr">
              {/* Fade masks */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fbf9f8] to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fbf9f8] to-transparent z-10 pointer-events-none" />

              {/* Loop Track */}
              <div className="flex overflow-hidden relative w-full">
                {/* Track 1 */}
                <div className="flex animate-slide-infinite whitespace-nowrap gap-6 shrink-0 py-2 pr-6">
                  {similarProducts.map((simProduct) => (
                    <Link
                      key={simProduct.id}
                      href={`/products/${simProduct.id}`}
                      className="inline-block w-[240px] bg-white rounded-2xl overflow-hidden shadow-sm border border-[#775a19]/10 hover:border-[#775a19]/35 hover:shadow-lg transition-all duration-300 pb-3 shrink-0 group relative text-right"
                    >
                      <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-50 border-b border-zinc-100">
                        {simProduct.image_url ? (
                          <img
                            src={simProduct.image_url}
                            alt={simProduct.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-zinc-300 bg-zinc-50">
                            <ShoppingBag className="h-8 w-8 stroke-[1.5] mb-2" />
                            <span className="text-[9px] uppercase tracking-wider font-semibold">لا توجد صورة</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Floating Price */}
                        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-[#fed488] to-[#ffdea5] text-[#031636] w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-md border-2 border-white transform rotate-12 transition-transform duration-300 group-hover:scale-110 z-10">
                          <span className="text-[9px] font-bold font-sans flex flex-col items-center justify-center leading-none">
                            <span>{Number(simProduct.price).toFixed(0)}</span>
                            <img src="/Saudi_Riyal_Symbol.webp" alt="ر.س" className="h-2.5 w-auto object-contain mt-0.5" />
                          </span>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-3 mx-2 rounded-xl border border-zinc-100 shadow-[0_-4px_8px_rgba(0,0,0,0.01)] -mt-4 bg-white relative z-10">
                        <h3 className="font-serif text-xs font-bold text-[#031636] group-hover:text-[#775a19] transition-colors leading-tight line-clamp-1">
                          {simProduct.name}
                        </h3>
                        {simProduct.description && (
                          <p className="text-[9px] text-[#44474e] mt-1 line-clamp-1 leading-normal">
                            {simProduct.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Track 2 (Duplicate for infinite seamless scroll) */}
                <div className="flex animate-slide-infinite whitespace-nowrap gap-6 shrink-0 py-2 pr-6" aria-hidden="true">
                  {similarProducts.map((simProduct) => (
                    <Link
                      key={`dup-${simProduct.id}`}
                      href={`/products/${simProduct.id}`}
                      className="inline-block w-[240px] bg-white rounded-2xl overflow-hidden shadow-sm border border-[#775a19]/10 hover:border-[#775a19]/35 hover:shadow-lg transition-all duration-300 pb-3 shrink-0 group relative text-right"
                    >
                      <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-50 border-b border-zinc-100">
                        {simProduct.image_url ? (
                          <img
                            src={simProduct.image_url}
                            alt={simProduct.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-zinc-300 bg-zinc-50">
                            <ShoppingBag className="h-8 w-8 stroke-[1.5] mb-2" />
                            <span className="text-[9px] uppercase tracking-wider font-semibold">لا توجد صورة</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Floating Price */}
                        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-[#fed488] to-[#ffdea5] text-[#031636] w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-md border-2 border-white transform rotate-12 transition-transform duration-300 group-hover:scale-110 z-10">
                          <span className="text-[9px] font-bold font-sans flex flex-col items-center justify-center leading-none">
                            <span>{Number(simProduct.price).toFixed(0)}</span>
                            <img src="/Saudi_Riyal_Symbol.webp" alt="ر.س" className="h-2.5 w-auto object-contain mt-0.5" />
                          </span>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-3 mx-2 rounded-xl border border-zinc-100 shadow-[0_-4px_8px_rgba(0,0,0,0.01)] -mt-4 bg-white relative z-10">
                        <h3 className="font-serif text-xs font-bold text-[#031636] group-hover:text-[#775a19] transition-colors leading-tight line-clamp-1">
                          {simProduct.name}
                        </h3>
                        {simProduct.description && (
                          <p className="text-[9px] text-[#44474e] mt-1 line-clamp-1 leading-normal">
                            {simProduct.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
