import React from 'react'
import Link from 'next/link'
import { getProducts } from '@/actions/products'
import { getCafeInfo } from '@/actions/cafe'
import { Coffee, Sofa, ConciergeBell, MapPin, Phone, Mail, ArrowUpLeft, ArrowLeft } from 'lucide-react'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/public/MotionWrapper'

// Force dynamic data fetching so homepage loads fresh content
export const revalidate = 0

export default async function HomePage() {
  const [cafeInfo, products] = await Promise.all([
    getCafeInfo(),
    getProducts(),
  ])

  const cafeName = cafeInfo?.name || 'SOIE'
  const cafeDesc = cafeInfo?.description || 'استمتع بأجود أنواع القهوة في أجواء راقية هادئة. تجربة تُحاكي الحواس وتجمع بين الأصالة والحداثة في نسيج حريري من النكهات.'
  const cafeAddress = cafeInfo?.address || 'طريق الملك فهد، حي الياسمين، الرياض'
  const cafePhone = cafeInfo?.phone || '+966 50 123 4567'
  const logoUrl = cafeInfo?.logo_url || '/logo.png'
  const cafeCover = cafeInfo?.cover_url || '/hero1.jpg'

  const galleryImages = [
    { src: 'https://instagram.fcai21-2.fna.fbcdn.net/v/t51.82787-15/645935219_17865914505595656_7556095951987743119_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzg0NzAyMTU4MjA2MTc0MzE4NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTAxNS5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=Kc5rG0kSoIAQ7kNvwG5KPn0&_nc_oc=AdrW6F77p_pw6zA8WQXOQop3QY6d1NxRE3th3oXCM8JUj_sI61IGS4cfXf2-o3GuL4w&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai21-2.fna&_nc_gid=9WZE1jmLWvuKTKUxVrnCug&_nc_ss=7a22e&oh=00_AQB3Yb4rlcQFlYhSL7rH59KZZ1BtzYspfmtNmwK1er1R9w&oe=6A50B19E', alt: 'تصميم داخلي راقي' },
    { src: 'https://instagram.fcai21-3.fna.fbcdn.net/v/t51.82787-15/641201439_17865610101595656_5224102711212296587_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=Mzg0NTc2NjcyMTE5ODE1MDQ5Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTAxNS5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=2JfFUUUV_RkQ7kNvwGBFtoi&_nc_oc=AdpTYvXV2CwODDlmLxlWqyFQIgmy6Avd_qfTQwB4fR84EE9YWpHzETUyxDYqp-3V6Ow&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai21-3.fna&_nc_gid=9WZE1jmLWvuKTKUxVrnCug&_nc_ss=7a22e&oh=00_AQCLQjnJ0ViiFnDTbwMScp2BCiiepBzyqJwJoT9Ohq1wBQ&oe=6A50B617', alt: 'فن الحليب على القهوة' },
    { src: 'https://instagram.fcai21-4.fna.fbcdn.net/v/t51.82787-15/648745377_17865771111595656_8685991653212477946_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=Mzg0NjQxODk3NzUwNTc3NTQ1Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTAxMy5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=IRQMa4Mbjb0Q7kNvwEATN93&_nc_oc=AdrTr_TRq6UaWZMthdqsvMGuqZ0thH_NYrkkX3vXyFES5nGDpP9uceS64owInS1VTSo&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai21-4.fna&_nc_gid=9WZE1jmLWvuKTKUxVrnCug&_nc_ss=7a22e&oh=00_AQA1E_D-a4NMzjflZx9fbErKO_H-OXtuHir_DiAtNFseuQ&oe=6A50956A', alt: 'مخبوزات وحلويات فاخرة' },
    { src: 'https://instagram.fcai21-4.fna.fbcdn.net/v/t51.82787-15/648225246_17865771132595656_531911954037608118_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=Mzg0NjQxOTA3NDMzNTUwNTAwMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTAxMy5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=IHn8-N2SSDEQ7kNvwFyLTpG&_nc_oc=Adp8GsXmRwg9maAgf6VRMfyIDzyHAq_AOn4lHDYugf3D7_fAnoG0O8bq2iqxCb7903E&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai21-4.fna&_nc_gid=9WZE1jmLWvuKTKUxVrnCug&_nc_ss=7a22e&oh=00_AQBc2Qt9v6iBILTis80Dh5nYlmVm5Hab05StDKtca3h8Iw&oe=6A50916C', alt: 'تراس خارجي هادئ' },
    { src: 'https://instagram.fcai21-3.fna.fbcdn.net/v/t51.82787-15/649077628_17865914589595656_7983800446504859642_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzg0NzAyMTg4NjY5NDA0ODE3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTAxNi5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=JJucei5IcMIQ7kNvwFAT2Sc&_nc_oc=Adpb3EuExx5fa57vUbEKl_wfJyw-0ahQRi1rMbLDGAn9fsVDPalpj1snIQXPfOPqWqg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai21-3.fna&_nc_gid=9WZE1jmLWvuKTKUxVrnCug&_nc_ss=7a22e&oh=00_AQCdInQ9wrmmsP50nVhyevCov_MfuRVPMgHUzdbnh8fYNw&oe=6A50B119', alt: 'تصميم داخلي راقي' }
  ]

  // Filter active products marked as featured in the database
  const featuredProducts = products.filter((p) => p.available && p.featured)

  return (
    <div className="relative overflow-x-hidden">
      {/* 1. Cinematic Hero Section */}
      <section
        className="relative bg-[#031636] min-h-[90vh] flex items-center justify-center overflow-hidden py-24 bg-cover bg-start bg-no-repeat"
        style={{ backgroundImage: `url('${cafeCover}')` }}
      >
        {/* Overlays to match the cinematic blend */}
        <div className="absolute inset-0 bg-[#031636]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031636] via-transparent to-[#031636]/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
          <FadeIn duration={0.8}>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#ffdea5] to-transparent mb-8 mx-auto"></div>

            <div className="flex flex-col items-center">
              <img
                src={logoUrl}
                alt={cafeName}
                className="h-28 md:h-36 w-auto object-cover drop-shadow-[0_0_15px_rgba(255,222,165,0.4)] mb-6"
              />
              <h1 className="font-serif text-3xl md:text-5xl text-[#fbf9f8] font-normal opacity-90">
                فن القهوة والراحة
              </h1>
            </div>

            <p className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mt-8">
              {cafeDesc}
            </p>

            <div className="pt-12">
              <Link
                href="#featured"
                className="font-serif  inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#ffdea5] to-[#fed488] text-[#031636] rounded-sm hover:from-[#fed488] hover:to-[#ffdea5] transition-all duration-300 font-bold text-2xl shadow-[0_10px_30px_-10px_rgba(255,222,165,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(255,222,165,0.6)] transform hover:-translate-y-1"
              >
                منتجاتنا المميزة
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. Features Section (Asymmetrical Offset Grid) */}
      <section id="about" className="py-28 bg-[#fbf9f8] relative">
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#775a19_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <SlideIn direction="up">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#031636]">مميزاتنا</h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#775a19] to-transparent mx-auto mt-6"></div>
            </div>
          </SlideIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-12">
            {/* Feature 1 (Offset Left) */}
            <StaggerItem className="md:col-span-5 md:col-start-1 group transition-all duration-300 hover:-translate-y-1">
              <div className="p-10 bg-white border border-[#775a19]/10 rounded-xl relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#775a19]/5 rounded-bl-full transition-transform duration-700 group-hover:scale-150"></div>
                <div className="w-20 h-20 rounded-full bg-[#fbf9f8] shadow-[0_10px_30px_rgba(3,22,54,0.06)] flex items-center justify-center mb-6 border border-[#775a19]/20 relative z-10 mx-auto md:mx-0">
                  <Coffee className="text-[#775a19] h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#031636] mb-4 text-center md:text-right relative z-10">
                  جودة القهوة
                </h3>
                <p className="text-sm text-[#44474e] leading-relaxed text-center md:text-right relative z-10">
                  حبوب بن مختارة بعناية ومحمصة للكمال لتقديم كوب مثالي في كل مرة. نعتني بكل قطرة لتصلك غنية بالنكهات.
                </p>
              </div>
            </StaggerItem>

            {/* Feature 2 (Center Overlapping Dark Card) */}
            <StaggerItem className="md:col-span-6 md:col-start-7 md:-mt-20 relative z-20 group transition-all duration-300 hover:-translate-y-1">
              <div className="p-12 bg-[#031636] text-white rounded-xl shadow-[0_20px_50px_rgba(3,22,54,0.25)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffdea5_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />
                <div className="w-24 h-24 rounded-full bg-[#ffdea5]/10 flex items-center justify-center mb-8 border border-[#ffdea5]/30 relative z-10 mx-auto md:mx-0 backdrop-blur-sm">
                  <Sofa className="text-[#ffdea5] h-10 w-10" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#ffdea5] mb-4 text-center md:text-right relative z-10">
                  أجواء مريحة
                </h3>
                <p className="text-base text-zinc-300 leading-relaxed text-center md:text-right relative z-10">
                  مساحات مصممة بعناية لتوفر لك الهدوء والراحة بعيداً عن صخب المدينة. إضاءة خافتة وتفاصيل حريرية تأسر الحواس وتمنحك بيئة ملهمة.
                </p>
              </div>
            </StaggerItem>

            {/* Feature 3 (Offset Right) */}
            <StaggerItem className="md:col-span-5 md:col-start-3 md:-mt-8 group transition-all duration-300 hover:-translate-y-1">
              <div className="p-10 bg-white border border-[#775a19]/10 rounded-xl relative overflow-hidden shadow-sm">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#775a19]/5 rounded-tr-full transition-transform duration-700 group-hover:scale-150"></div>
                <div className="w-20 h-20 rounded-full bg-[#fbf9f8] shadow-[0_10px_30px_rgba(3,22,54,0.06)] flex items-center justify-center mb-6 border border-[#775a19]/20 relative z-10 mx-auto md:mx-0">
                  <ConciergeBell className="text-[#775a19] h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#031636] mb-4 text-center md:text-right relative z-10">
                  خدمة ممتازة
                </h3>
                <p className="text-sm text-[#44474e] leading-relaxed text-center md:text-right relative z-10">
                  طاقم عمل محترف يحرص على تلبية طلباتك بأرقى مستويات الضيافة. نهتم بالتفاصيل الدقيقة لضمان رضاك التام.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. Products Section */}
      <section className="py-28 bg-[#f5f3f3] relative" id="featured">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #031636 0, #031636 1px, transparent 1px, transparent 50px)' }}></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <SlideIn direction="up">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="mb-6 md:mb-0 text-right">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#031636] mb-4">قائمتنا المميزة</h2>
                <div className="h-0.5 w-32 bg-[#775a19] mr-0 ml-auto"></div>
              </div>
              <Link href="/menu" className="font-semibold text-[#775a19] hover:text-[#031636] transition-colors flex items-center gap-2 group">
                <span className="border-b border-transparent group-hover:border-[#031636] transition-all pb-1">عرض الكل</span>
                <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </SlideIn>

          {featuredProducts.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredProducts.map((product, idx) => (
                <StaggerItem key={product.id} className={`group relative ${idx === 1 ? 'md:mt-12' : ''}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        src={product.image_url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80'}
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-8 text-right bg-white relative z-20 -mt-6 mx-4 rounded-xl shadow-[0_-10px_20px_rgba(0,0,0,0.03)] border border-[#efeded]">
                      <h3 className="font-serif text-2xl font-bold text-[#031636] group-hover:text-[#775a19] transition-colors mb-3">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#44474e] leading-relaxed line-clamp-2">
                        {product.description || 'وصف شهي ومميز للمنتج المحضر طازجاً في مقهانا اليوم.'}
                      </p>
                    </div>
                  </div>

                  {/* Floating Gold Price Tag */}
                  <div
                    className="absolute -top-4 -right-4 bg-gradient-to-br from-[#fed488] to-[#ffdea5] text-[#031636] w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white transform rotate-12 transition-transform duration-300 group-hover:scale-110"
                    style={{ animationDelay: `${idx * 0.5}s` }}
                  >
                    <span className="text-xs font-bold font-sans flex flex-col items-center justify-center leading-none">
                      <span>{Number(product.price).toFixed(0)}</span>
                      <img src="/Saudi_Riyal_Symbol.webp" alt="ر.س" className="h-3 w-auto object-contain mt-0.5" />
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-20 bg-white border border-[#775a19]/10 rounded-2xl max-w-xl mx-auto shadow-sm">
              <Coffee className="mx-auto h-12 w-12 text-[#775a19]/40 mb-4 stroke-[1.5]" />
              <h3 className="text-[#031636] font-serif text-xl font-bold mb-2">ترقبوا قائمتنا المميزة قريباً</h3>
              <p className="text-xs text-[#44474e] max-w-xs mx-auto leading-relaxed mb-6">
                نقوم حالياً باختيار أفضل وأفخر الأطباق والمشروبات لعرضها لكم هنا. تفضل بزيارة صفحة المنيو الكاملة لاستكشاف كل عروضنا.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#031636] hover:bg-[#1a2b4c] text-[#ffdea5] rounded-full text-xs font-bold transition-all duration-300"
              >
                تصفح المنيو الكامل
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section (Automated Slider) */}
      <section className="py-32 bg-[#031636] relative overflow-hidden slider-container" id="gallery" >
        <div className="absolute inset-0 bg-[radial-gradient(#ffdea5_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none" />
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#ffdea5] via-[#fed488] to-white">
              مكاننا
            </h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#775a19] to-transparent mx-auto mt-6"></div>
          </div>

          {/* Slider Track (Twin tracks for seamless infinite loop) */}
          <div className="flex overflow-hidden relative w-full" dir="ltr">
            <div className="flex animate-slide-infinite whitespace-nowrap gap-6 py-4 shrink-0">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="inline-block w-[320px] md:w-[400px] aspect-[4/5] overflow-hidden rounded-2xl border border-[#ffdea5]/20 shadow-2xl transition-all duration-500 hover:scale-105 shrink-0 group relative"
                >
                  <img
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={img.src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <span className="text-sm font-semibold text-white font-serif tracking-wide">{img.alt}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex animate-slide-infinite whitespace-nowrap gap-6 py-4 shrink-0" aria-hidden="true">
              {galleryImages.map((img, idx) => (
                <div
                  key={`dup-${idx}`}
                  className="inline-block w-[320px] md:w-[400px] aspect-[4/5] overflow-hidden rounded-2xl border border-[#ffdea5]/20 shadow-2xl transition-all duration-500 hover:scale-105 shrink-0 group relative"
                >
                  <img
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={img.src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <span className="text-sm font-semibold text-white font-serif tracking-wide">{img.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact Section (Dashboard Style) */}
      <section className="py-28 bg-[#031636] relative overflow-hidden" id="contact">
        <div className="absolute inset-0 bg-[radial-gradient(#ffdea5_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#775a19]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#ffdea5]/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white/5 backdrop-blur-xl border border-[#ffdea5]/25 p-8 md:p-16 rounded-[2.5rem] shadow-2xl">
            <SlideIn direction="right" className="lg:col-span-5 space-y-8 text-right flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#ffdea5] via-[#fed488] to-white mb-6">
                  تواصل معنا
                </h2>
                <p className="text-base text-zinc-300 leading-relaxed">
                  نسعد دائمًا باستقبالكم والاستماع إلى ملاحظاتكم. يمكنكم التواصل معنا عبر القنوات التالية أو زيارتنا مباشرة لتجربة الفخامة.
                </p>
              </div>

              <div className="space-y-6 mt-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4 text-white group hover:translate-x-1.5 transition-transform duration-300">
                  <div className="w-11 h-11 rounded-full bg-[#775a19]/20 flex items-center justify-center group-hover:bg-[#775a19]/30 transition-colors">
                    <MapPin className="text-[#ffdea5] h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{cafeAddress}</span>
                </div>
                <div className="flex items-center gap-4 text-white group hover:translate-x-1.5 transition-transform duration-300">
                  <div className="w-11 h-11 rounded-full bg-[#775a19]/20 flex items-center justify-center group-hover:bg-[#775a19]/30 transition-colors">
                    <Phone className="text-[#ffdea5] h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium" dir="ltr">{cafePhone}</span>
                </div>
                <div className="flex items-center gap-4 text-white group hover:translate-x-1.5 transition-transform duration-300">
                  <div className="w-11 h-11 rounded-full bg-[#775a19]/20 flex items-center justify-center group-hover:bg-[#775a19]/30 transition-colors">
                    <Mail className="text-[#ffdea5] h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">hello@soiecafe.com</span>
                </div>
              </div>
            </SlideIn>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tile 1: Instagram */}
                <StaggerItem>
                  <a
                    href="https://www.instagram.com/soiecafe.sa/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 rounded-2xl hover:bg-[#ffdea5]/10 transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between min-h-[160px] w-full block"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ffdea5]/10 rounded-full blur-2xl group-hover:bg-[#ffdea5]/20 transition-colors duration-500"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <svg className="h-8 w-8 text-[#ffdea5] group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      <ArrowUpLeft className="h-5 w-5 text-white/50 group-hover:text-[#ffdea5] group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-all" />
                    </div>
                    <span className="font-serif text-xl font-bold text-white group-hover:text-[#ffdea5] transition-colors relative z-10">
                      إنستجرام
                    </span>
                  </a>
                </StaggerItem>

                {/* Tile 2: Snapchat */}
                <StaggerItem>
                  <a
                    href="https://www.snapchat.com/@soiecafe.sa"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 rounded-2xl hover:bg-[#ffdea5]/10 transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between min-h-[160px] w-full block"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ffdea5]/10 rounded-full blur-2xl group-hover:bg-[#ffdea5]/20 transition-colors duration-500"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <svg className="h-8 w-8 text-[#ffdea5] group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.766c-.63 0-1.293.078-1.895.14-2.183.228-3.834 1.834-4.148 4.095-.08.577-.183 1.157-.263 1.734-.047.34-.14.67-.296.974A5.47 5.47 0 013.916 11.7c-.504.428-.775 1.054-.733 1.705.035.534.343.938.86 1.096.72.22 1.343.642 1.815 1.23.364.453.388 1.082.081 1.517-.282.4-.648.887-.992 1.455-.383.633-.146 1.45.526 1.814.542.294 1.158.441 1.782.441.564 0 1.123-.12 1.637-.354a5.05 5.05 0 001.077-.665c.611-.515 1.393-.8 2.2-.8.807 0 1.59.285 2.201.8.3.255.663.483 1.078.665.513.234 1.072.354 1.636.354.624 0 1.24-.147 1.782-.441.672-.364.91-1.18.526-1.814-.344-.568-.71-1.055-.992-1.455-.307-.435-.283-1.064.08-1.517.473-.588 1.096-1.01 1.817-1.23.517-.158.825-.562.86-1.096.042-.65-.23-1.277-.733-1.705a5.47 5.47 0 01-1.482-1.99c-.156-.304-.25-.634-.296-.974-.08-.577-.183-1.157-.263-1.734-.314-2.26-1.965-3.867-4.148-4.095-.602-.062-1.265-.14-1.895-.14z" />
                      </svg>
                      <ArrowUpLeft className="h-5 w-5 text-white/50 group-hover:text-[#ffdea5] group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-all" />
                    </div>
                    <span className="font-serif text-xl font-bold text-white group-hover:text-[#ffdea5] transition-colors relative z-10">
                      سناب شات
                    </span>
                  </a>
                </StaggerItem>

                {/* Tile 3: TikTok */}
                <StaggerItem>
                  <a
                    href="https://www.tiktok.com/@soiecafe.sa"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 rounded-2xl hover:bg-[#ffdea5]/10 transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between min-h-[160px] w-full block"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ffdea5]/10 rounded-full blur-2xl group-hover:bg-[#ffdea5]/20 transition-colors duration-500"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <svg className="h-8 w-8 text-[#ffdea5] group-hover:scale-110 transition-transform fill-current animate-pulse-slow" viewBox="0 0 24 24">
                        <path d="M19.589 6.686a4.793 4.793 0 01-3.292-1.29 4.793 4.793 0 01-1.29-3.292h-3.44v14.4c.007.828-.32 1.624-.91 2.214a3.125 3.125 0 01-4.428 0 3.125 3.125 0 010-4.428 3.125 3.125 0 012.214-.91c.204-.002.408.016.608.056V9.98c-1.35-.175-2.72-.008-3.98.496a7.125 7.125 0 00-4.04 5.368 7.125 7.125 0 003.54 7.216 7.125 7.125 0 008.024-.544 7.125 7.125 0 002.668-5.516V7.086c1.096.792 2.424 1.22 3.784 1.22h.64V4.866h-.64a4.793 4.793 0 01-3.008-1.09 4.793 4.793 0 01-1.09-3.008V0h-3.44v6.686z" />
                      </svg>
                      <ArrowUpLeft className="h-5 w-5 text-white/50 group-hover:text-[#ffdea5] group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-all" />
                    </div>
                    <span className="font-serif text-xl font-bold text-white group-hover:text-[#ffdea5] transition-colors relative z-10">
                      تيك توك
                    </span>
                  </a>
                </StaggerItem>

                {/* Tile 4: Twitter (X) */}
                {/* <StaggerItem>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 rounded-2xl hover:bg-[#ffdea5]/10 transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between min-h-[160px] w-full block"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ffdea5]/10 rounded-full blur-2xl group-hover:bg-[#ffdea5]/20 transition-colors duration-500"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <svg className="h-8 w-8 text-[#ffdea5] group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <ArrowUpLeft className="h-5 w-5 text-white/50 group-hover:text-[#ffdea5] group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-all" />
                    </div>
                    <span className="font-serif text-xl font-bold text-white group-hover:text-[#ffdea5] transition-colors relative z-10">
                      تويتر (X)
                    </span>
                  </a>
                </StaggerItem> */}

                {/* Tile 5: Facebook */}
                {/* <StaggerItem className="sm:col-span-2 mt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-r from-[#fed488]/15 to-[#ffdea5]/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group relative overflow-hidden flex items-center justify-between w-full block"
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-14 h-14 rounded-full bg-[#031636]/80 border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Users className="h-6 w-6 text-[#ffdea5]" />
                      </div>
                      <span className="font-serif text-xl font-bold text-white group-hover:text-[#ffdea5] transition-colors text-right">
                        مجتمع سويه على فيسبوك
                      </span>
                    </div>
                    <ArrowLeft className="h-6 w-6 text-white/50 group-hover:text-[#ffdea5] group-hover:-translate-x-1.5 transition-all relative z-10" />
                  </a>
                </StaggerItem> */}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
