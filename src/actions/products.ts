'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Product } from '@/types'

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }

  return data || []
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price') as string
  const categoryId = formData.get('category_id') as string
  const available = formData.get('available') === 'true'
  const featured = formData.get('featured') === 'true'
  const imageFile = formData.get('image') as File | null

  if (!name || !priceStr || !categoryId) {
    return { error: 'Name, price, and category are required fields.' }
  }

  const price = parseFloat(priceStr)
  if (isNaN(price) || price < 0) {
    return { error: 'Price must be a positive number.' }
  }

  const supabase = await createClient()
  let imageUrl = ''

  // If there's an image file uploaded
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    
    // Convert File to ArrayBuffer then Buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: storageError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
      })

    if (storageError) {
      return { error: `Failed to upload image: ${storageError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    imageUrl = publicUrl
  }

  const { error } = await supabase
    .from('products')
    .insert([
      {
        name,
        description: description || null,
        price,
        image_url: imageUrl || null,
        category_id: categoryId,
        available,
        featured,
      },
    ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/menu')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price') as string
  const categoryId = formData.get('category_id') as string
  const available = formData.get('available') === 'true'
  const featured = formData.get('featured') === 'true'
  const imageFile = formData.get('image') as File | null
  const existingImageUrl = formData.get('existing_image_url') as string

  if (!name || !priceStr || !categoryId) {
    return { error: 'Name, price, and category are required fields.' }
  }

  const price = parseFloat(priceStr)
  if (isNaN(price) || price < 0) {
    return { error: 'Price must be a positive number.' }
  }

  const supabase = await createClient()
  let imageUrl = existingImageUrl || ''

  // If there's a new image file uploaded
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    
    // Convert File to ArrayBuffer then Buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: storageError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
      })

    if (storageError) {
      return { error: `Failed to upload image: ${storageError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    // Delete old image if we want to clean up and it belongs to this storage
    if (existingImageUrl && existingImageUrl.includes('product-images')) {
      try {
        const parts = existingImageUrl.split('/')
        const oldFileName = parts[parts.length - 1]
        await supabase.storage.from('product-images').remove([oldFileName])
      } catch (e) {
        console.error('Failed to remove old image:', e)
      }
    }

    imageUrl = publicUrl
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description: description || null,
      price,
      image_url: imageUrl || null,
      category_id: categoryId,
      available,
      featured,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/menu')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  // Retrieve product to delete its image from storage first
  const { data: product } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', id)
    .single()

  if (product?.image_url && product.image_url.includes('product-images')) {
    try {
      const parts = product.image_url.split('/')
      const fileName = parts[parts.length - 1]
      await supabase.storage.from('product-images').remove([fileName])
    } catch (e) {
      console.error('Failed to delete image from storage:', e)
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/menu')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function toggleProductAvailability(id: string, available: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ available })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/menu')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function toggleProductFeatured(id: string, featured: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ featured })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/menu')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product by ID:', error.message)
    return null
  }

  return data
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products by category:', error.message)
    return []
  }

  return data || []
}

