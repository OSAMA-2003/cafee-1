'use client'

import React, { useState, useMemo, useTransition } from 'react'
import { Category, Product } from '@/types'
import { createProduct, updateProduct, deleteProduct, toggleProductAvailability, toggleProductFeatured } from '@/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Loader2, Coffee, Search, Image as ImageIcon } from 'lucide-react'

interface ProductsManagerProps {
  initialProducts: Product[]
  categories: Category[]
}

export function ProductsManager({ initialProducts, categories }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')
  const [isPending, startTransition] = useTransition()

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addFormState, setAddFormState] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    available: true,
    featured: false,
    imageFile: null as File | null,
    imagePreview: null as string | null,
  })

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editFormState, setEditFormState] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    available: true,
    featured: false,
    imageFile: null as File | null,
    imagePreview: null as string | null,
  })

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Sync props
  React.useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  // Filter products list
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory =
        selectedCategoryFilter === 'all' || prod.category_id === selectedCategoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategoryFilter])

  // Action: Toggle availability instantly
  const handleToggleAvailable = (id: string, available: boolean) => {
    startTransition(async () => {
      const res = await toggleProductAvailability(id, available)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`تم تحديث حالة توفر المنتج: ${available ? 'متوفر' : 'غير متوفر'}`)
      }
    })
  }

  // Action: Toggle featured instantly
  const handleToggleFeatured = (id: string, featured: boolean) => {
    startTransition(async () => {
      const res = await toggleProductFeatured(id, featured)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`تم تحديث حالة تمييز المنتج: ${featured ? 'مميز في الواجهة' : 'عادي'}`)
      }
    })
  }

  // Action: Add product
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addFormState.name.trim() || !addFormState.price || !addFormState.category_id) {
      toast.error('الاسم، السعر، والقسم حقول مطلوبة.')
      return
    }

    const formData = new FormData()
    formData.append('name', addFormState.name)
    formData.append('price', addFormState.price)
    formData.append('category_id', addFormState.category_id)
    formData.append('description', addFormState.description)
    formData.append('available', addFormState.available ? 'true' : 'false')
    formData.append('featured', addFormState.featured ? 'true' : 'false')
    if (addFormState.imageFile) {
      formData.append('image', addFormState.imageFile)
    }

    startTransition(async () => {
      const res = await createProduct(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('تمت إضافة المنتج بنجاح!')
        setAddFormState({
          name: '',
          price: '',
          category_id: '',
          description: '',
          available: true,
          featured: false,
          imageFile: null,
          imagePreview: null,
        })
        setIsAddOpen(false)
      }
    })
  }

  // Action: Edit product submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    if (!editFormState.name.trim() || !editFormState.price || !editFormState.category_id) {
      toast.error('الاسم، السعر، والقسم حقول مطلوبة.')
      return
    }

    const formData = new FormData()
    formData.append('name', editFormState.name)
    formData.append('price', editFormState.price)
    formData.append('category_id', editFormState.category_id)
    formData.append('description', editFormState.description)
    formData.append('available', editFormState.available ? 'true' : 'false')
    formData.append('featured', editFormState.featured ? 'true' : 'false')
    formData.append('existing_image_url', editingProduct.image_url || '')
    if (editFormState.imageFile) {
      formData.append('image', editFormState.imageFile)
    }

    startTransition(async () => {
      const res = await updateProduct(editingProduct.id, formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('تم تحديث بيانات المنتج بنجاح!')
        setEditingProduct(null)
        setIsEditOpen(false)
      }
    })
  }

  // Action: Delete product
  const handleDeleteSubmit = () => {
    if (!deletingProduct) return

    startTransition(async () => {
      const res = await deleteProduct(deletingProduct.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('تم حذف المنتج بنجاح!')
        setDeletingProduct(null)
        setIsDeleteOpen(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Controls: search, category selector, add button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-4 border-[#775a19]/25 bg-white text-[#031636] focus-visible:ring-[#775a19] rounded-lg text-right"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategoryFilter} onValueChange={(val) => setSelectedCategoryFilter(val || 'all')}>
            <SelectTrigger className="w-full sm:w-48 border-[#775a19]/25 bg-white text-[#031636] focus:ring-[#775a19] text-right">
              <SelectValue placeholder="جميع الأقسام" />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200 text-[#031636] text-right">
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Product Trigger */}
        <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto bg-[#031636] hover:bg-[#1a2b4c] text-[#ffdea5] border border-[#ffdea5]/30 font-bold gap-2 transition-all duration-200 shadow-md">
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="border-zinc-200 bg-white text-[#031636] backdrop-blur-md max-w-lg text-right">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader className="text-right">
                <DialogTitle className="text-lg font-bold font-serif text-[#031636]">إضافة منتج جديد</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs mt-1">
                  أنشئ منتجاً جديداً في المنيو. الحقول المميزة بعلامة * هي حقول إجبارية.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name" className="text-zinc-600 font-semibold">اسم المنتج *</Label>
                    <Input
                      id="add-name"
                      placeholder="مثال: لافندر لاتيه"
                      value={addFormState.name}
                      onChange={(e) => setAddFormState({ ...addFormState, name: e.target.value })}
                      className="border-[#775a19]/25 bg-white text-[#031636] focus-visible:ring-[#775a19] text-right"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-price" className="text-zinc-600 font-semibold">السعر (ر.س) *</Label>
                    <Input
                      id="add-price"
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                      value={addFormState.price}
                      onChange={(e) => setAddFormState({ ...addFormState, price: e.target.value })}
                      className="border-[#775a19]/25 bg-white text-[#031636] focus-visible:ring-[#775a19] text-right"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <Label className="text-zinc-600 font-semibold">القسم *</Label>
                    <Select
                      value={addFormState.category_id}
                      onValueChange={(val) => setAddFormState({ ...addFormState, category_id: val || '' })}
                    >
                      <SelectTrigger className="border-[#775a19]/25 bg-white text-[#031636] focus:ring-[#775a19] text-right">
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200 text-[#031636]">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 justify-end pr-2">
                      <Label htmlFor="add-available" className="text-zinc-600 font-semibold cursor-pointer text-xs">
                        متوفر في المخزن
                      </Label>
                      <Switch
                        id="add-available"
                        checked={addFormState.available}
                        onCheckedChange={(checked) => setAddFormState({ ...addFormState, available: checked })}
                      />
                    </div>
                    <div className="flex items-center gap-3 justify-end pr-2">
                      <Label htmlFor="add-featured" className="text-[#775a19] font-semibold cursor-pointer text-xs">
                        عرض في المميزة
                      </Label>
                      <Switch
                        id="add-featured"
                        checked={addFormState.featured}
                        onCheckedChange={(checked) => setAddFormState({ ...addFormState, featured: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-desc" className="text-zinc-600 font-semibold">الوصف والتفاصيل</Label>
                  <Textarea
                    id="add-desc"
                    placeholder="صف نكهة المنتج، حجمه، ومكوناته للمشترين..."
                    value={addFormState.description}
                    onChange={(e) => setAddFormState({ ...addFormState, description: e.target.value })}
                    className="border-[#775a19]/25 bg-white text-[#031636] focus-visible:ring-[#775a19] min-h-[70px] text-right leading-relaxed"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-zinc-600 font-semibold">صورة المنتج</Label>
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-zinc-100 border border-[#775a19]/10 shrink-0 flex items-center justify-center text-zinc-300">
                      {addFormState.imagePreview ? (
                        <img src={addFormState.imagePreview} alt="المعاينة" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5" />
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setAddFormState({
                            ...addFormState,
                            imageFile: file,
                            imagePreview: URL.createObjectURL(file),
                          })
                        }
                      }}
                      className="border-zinc-200 bg-white text-zinc-600 text-xs file:bg-zinc-100 file:text-zinc-700 file:border-0 file:rounded-md file:px-2.5 file:py-1 file:ml-2 hover:file:bg-zinc-200"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddOpen(false)}
                  className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#031636] hover:bg-[#1a2b4c] text-[#ffdea5] font-semibold"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'إضافة المنتج'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product List Table */}
      <div className="rounded-xl border border-[#775a19]/10 bg-white overflow-hidden shadow-sm">
        <Table className="text-right">
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableHead className="w-[80px] text-right text-[#031636] font-bold pr-6">الصورة</TableHead>
              <TableHead className="text-right text-[#031636] font-bold">الاسم</TableHead>
              <TableHead className="text-right text-[#031636] font-bold">القسم</TableHead>
              <TableHead className="text-right text-[#031636] font-bold">السعر</TableHead>
              <TableHead className="text-right text-[#031636] font-bold">متوفر</TableHead>
              <TableHead className="text-right text-[#031636] font-bold">مميز</TableHead>
              <TableHead className="text-left text-[#031636] font-bold pl-6">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-zinc-100 hover:bg-zinc-50/30 transition-colors">
                  {/* Photo cell */}
                  <TableCell className="pr-6 py-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 border border-[#775a19]/10 flex items-center justify-center shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Coffee className="h-4 w-4 text-zinc-300" />
                      )}
                    </div>
                  </TableCell>

                  {/* Name cell */}
                  <TableCell className="font-semibold text-[#031636]">
                    <div>
                      <p>{product.name}</p>
                      {product.description && (
                        <p className="text-[10px] text-zinc-400 font-light truncate max-w-xs mt-0.5 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Category cell */}
                  <TableCell className="text-zinc-500 text-xs">
                    {categories.find((c) => c.id === product.category_id)?.name || 'غير مصنف'}
                  </TableCell>

                  {/* Price cell */}
                  <TableCell className="font-bold text-[#775a19] text-sm">
                    {Number(product.price).toFixed(2)} ر.س
                  </TableCell>

                  {/* Available cell */}
                  <TableCell>
                    <Switch
                      checked={product.available}
                      disabled={isPending}
                      onCheckedChange={(checked) => handleToggleAvailable(product.id, checked)}
                    />
                  </TableCell>

                  {/* Featured cell */}
                  <TableCell>
                    <Switch
                      checked={product.featured}
                      disabled={isPending}
                      onCheckedChange={(checked) => handleToggleFeatured(product.id, checked)}
                    />
                  </TableCell>

                  {/* Actions cell */}
                  <TableCell className="text-left pl-6 space-x-1.5 space-x-reverse">
                    {/* Edit Trigger */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingProduct(product)
                        setEditFormState({
                          name: product.name,
                          price: product.price.toString(),
                          category_id: product.category_id,
                          description: product.description || '',
                          available: product.available,
                          featured: product.featured,
                          imageFile: null,
                          imagePreview: product.image_url || null,
                        })
                        setIsEditOpen(true)
                      }}
                      className="text-zinc-400 hover:bg-[#ffdea5]/25 hover:text-[#775a19] h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Delete Trigger */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeletingProduct(product)
                        setIsDeleteOpen(true)
                      }}
                      className="text-zinc-400 hover:bg-red-50 hover:text-red-600 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="text-center py-16 text-zinc-400">
                  <Coffee className="h-10 w-10 mx-auto mb-3 text-zinc-300 stroke-[1.5]" />
                  {'لم يتم العثور على أي منتجات. اضغط على "إضافة منتج جديد" للبدء.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-zinc-200 bg-white text-[#031636] backdrop-blur-md max-w-lg text-right">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="text-right">
              <DialogTitle className="text-lg font-bold font-serif text-[#031636]">تعديل بيانات المنتج</DialogTitle>
              <DialogDescription className="text-zinc-500 text-xs mt-1">
                قم بتعديل بيانات المنتج. سيتم تحديث التعديلات فور الحفظ.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name-field" className="text-zinc-600 font-semibold">اسم المنتج *</Label>
                  <Input
                    id="edit-name-field"
                    value={editFormState.name}
                    onChange={(e) => setEditFormState({ ...editFormState, name: e.target.value })}
                    className="border-[#775a19]/25 bg-white text-[#031636] focus-visible:ring-[#775a19] text-right"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price-field" className="text-zinc-600 font-semibold">السعر (ر.س) *</Label>
                  <Input
                    id="edit-price-field"
                    type="number"
                    step="0.01"
                    value={editFormState.price}
                    onChange={(e) => setEditFormState({ ...editFormState, price: e.target.value })}
                    className="border-[#775a19]/25 bg-white text-[#031636] focus-visible:ring-[#775a19] text-right"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <Label className="text-zinc-600 font-semibold">القسم *</Label>
                  <Select
                    value={editFormState.category_id}
                    onValueChange={(val) => setEditFormState({ ...editFormState, category_id: val || '' })}
                  >
                    <SelectTrigger className="border-[#775a19]/25 bg-white text-[#031636] focus:ring-[#775a19] text-right">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200 text-[#031636]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 justify-end pr-2">
                    <Label htmlFor="edit-available" className="text-zinc-600 font-semibold cursor-pointer text-xs">
                      متوفر في المخزن
                    </Label>
                    <Switch
                      id="edit-available"
                      checked={editFormState.available}
                      onCheckedChange={(checked) => setEditFormState({ ...editFormState, available: checked })}
                    />
                  </div>
                  <div className="flex items-center gap-3 justify-end pr-2">
                    <Label htmlFor="edit-featured" className="text-[#775a19] font-semibold cursor-pointer text-xs">
                      عرض في المميزة
                    </Label>
                    <Switch
                      id="edit-featured"
                      checked={editFormState.featured}
                      onCheckedChange={(checked) => setEditFormState({ ...editFormState, featured: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-desc-field" className="text-zinc-600 font-semibold">الوصف والتفاصيل</Label>
                <Textarea
                  id="edit-desc-field"
                  placeholder="وصف نكهة وحجم ومكونات المنتج..."
                  value={editFormState.description}
                  onChange={(e) => setEditFormState({ ...editFormState, description: e.target.value })}
                  className="border-[#775a19]/25 bg-white text-[#031636] focus-visible:ring-[#775a19] min-h-[70px] text-right leading-relaxed"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-zinc-600 font-semibold">صورة المنتج</Label>
                <div className="flex items-center gap-4 flex-row-reverse">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-zinc-100 border border-[#775a19]/10 shrink-0 flex items-center justify-center text-zinc-300">
                    {editFormState.imagePreview ? (
                      <img src={editFormState.imagePreview} alt="المعاينة" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setEditFormState({
                          ...editFormState,
                          imageFile: file,
                          imagePreview: URL.createObjectURL(file),
                        })
                      }
                    }}
                    className="border-zinc-200 bg-white text-zinc-600 text-xs file:bg-zinc-100 file:text-zinc-700 file:border-0 file:rounded-md file:px-2.5 file:py-1 file:ml-2 hover:file:bg-zinc-200"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#031636] hover:bg-[#1a2b4c] text-[#ffdea5] font-semibold"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ التعديلات'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border-zinc-200 bg-white text-[#031636] backdrop-blur-md max-w-md text-right">
          <DialogHeader className="text-right">
            <DialogTitle className="text-lg font-bold font-serif text-red-600">تأكيد حذف المنتج</DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-1">
              هل أنت متأكد من رغبتك في حذف المنتج <span className="font-bold text-[#031636]">&quot;{deletingProduct?.name}&quot;</span>؟
            </DialogDescription>
            <p className="text-[11px] text-[#44474e] mt-3 bg-zinc-50 border border-zinc-100 p-2.5 rounded-lg leading-relaxed">
              سيتم إزالة هذا المنتج وصورته التابعة له نهائياً من الخادم وقاعدة البيانات. لا يمكن التراجع عن هذا الإجراء لاحقاً.
            </p>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تأكيد الحذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
