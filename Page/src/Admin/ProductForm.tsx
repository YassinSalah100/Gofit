"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"

// Mock categories
const categories = [
  "Footwear",
  "Apparel",
  "Equipment",
  "Accessories",
  "Electronics",
  "Nutrition",
  "Team Sports",
  "Training Gear",
]

// Define types for our data structures
interface ProductVariant {
  id: number
  size: string
  color: string
  stock: number
}

interface ProductSpecification {
  key: string
  value: string
}

interface ProductData {
  id?: number
  name: string
  description: string
  category: string
  price: string
  stock: string
  status: string
  images: string[]
  variants: ProductVariant[]
  specifications: ProductSpecification[]
}

interface FormErrors {
  name?: string
  description?: string
  category?: string
  price?: string
  stock?: string
  images?: string
}

const ProductForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = id !== "new"

  // Mock product data for edit mode
  const mockProduct: ProductData = {
    id: 1,
    name: "Premium Running Shoes",
    description:
      "High-performance running shoes designed for serious athletes. Features advanced cushioning and support for long-distance running.",
    category: "Footwear",
    price: "129.99",
    stock: "45",
    status: "Active",
    images: ["/placeholder.svg?height=200&width=200"],
    variants: [
      { id: 1, size: "S", color: "Black", stock: 15 },
      { id: 2, size: "M", color: "Black", stock: 20 },
      { id: 3, size: "L", color: "Black", stock: 10 },
    ],
    specifications: [
      { key: "Material", value: "Synthetic mesh" },
      { key: "Weight", value: "10.2 oz" },
      { key: "Closure", value: "Lace-up" },
    ],
  }

  const [product, setProduct] = useState<ProductData>({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    images: [],
    variants: [],
    specifications: [],
  })

  const [newVariant, setNewVariant] = useState<{ size: string; color: string; stock: string }>({
    size: "",
    color: "",
    stock: "",
  })
  const [newSpec, setNewSpec] = useState<{ key: string; value: string }>({ key: "", value: "" })
  const [errors, setErrors] = useState<FormErrors>({})

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the product data from an API
      setProduct(mockProduct)
    }
  }, [isEditMode, mockProduct])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would handle file upload to a server or cloud storage
    // For this demo, we'll just use a placeholder
    if (e.target.files && e.target.files[0]) {
      const newImageUrl = "/placeholder.svg?height=200&width=200"
      setProduct({ ...product, images: [...product.images, newImageUrl] })
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = [...product.images]
    updatedImages.splice(index, 1)
    setProduct({ ...product, images: updatedImages })
  }

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewVariant({ ...newVariant, [name]: value })
  }

  const addVariant = () => {
    if (newVariant.size && newVariant.color && newVariant.stock) {
      const variant: ProductVariant = {
        id: Date.now(),
        size: newVariant.size,
        color: newVariant.color,
        stock: Number.parseInt(newVariant.stock, 10),
      }
      setProduct({ ...product, variants: [...product.variants, variant] })
      setNewVariant({ size: "", color: "", stock: "" })
    }
  }

  const removeVariant = (id: number) => {
    const updatedVariants = product.variants.filter((variant) => variant.id !== id)
    setProduct({ ...product, variants: updatedVariants })
  }

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSpec({ ...newSpec, [name]: value })
  }

  const addSpec = () => {
    if (newSpec.key && newSpec.value) {
      const spec: ProductSpecification = { ...newSpec }
      setProduct({ ...product, specifications: [...product.specifications, spec] })
      setNewSpec({ key: "", value: "" })
    }
  }

  const removeSpec = (index: number) => {
    const updatedSpecs = [...product.specifications]
    updatedSpecs.splice(index, 1)
    setProduct({ ...product, specifications: updatedSpecs })
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}
    if (!product.name) newErrors.name = "Product name is required"
    if (!product.description) newErrors.description = "Description is required"
    if (!product.category) newErrors.category = "Category is required"
    if (!product.price) newErrors.price = "Price is required"
    if (isNaN(Number.parseFloat(product.price))) newErrors.price = "Price must be a number"
    if (!product.stock) newErrors.stock = "Stock is required"
    if (isNaN(Number.parseInt(product.stock, 10))) newErrors.stock = "Stock must be a number"
    if (product.images.length === 0) newErrors.images = "At least one image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    // In a real app, you would send the data to your backend
    console.log("Submitting product:", product)

    // Redirect back to products list
    navigate("/admin/products")
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center">
          <Link to="/admin/products" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode ? "Update product information" : "Create a new product listing"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={product.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.description ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.category ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.price ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="text"
                  id="stock"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.stock ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm`}
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={product.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Product Images</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 rounded-full bg-white p-1 text-gray-500 shadow-sm hover:text-red-500 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-700">Add Image</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Product Variants</h2>
          </div>
          <div className="px-6 py-4">
            <div className="mb-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="variant-size" className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <input
                    type="text"
                    id="variant-size"
                    name="size"
                    value={newVariant.size}
                    onChange={handleVariantChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="variant-color" className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <input
                    type="text"
                    id="variant-color"
                    name="color"
                    value={newVariant.color}
                    onChange={handleVariantChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="variant-stock" className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="variant-stock"
                    name="stock"
                    value={newVariant.stock}
                    onChange={handleVariantChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="mt-4 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Variant
              </button>
            </div>

            {product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Added Variants</h3>
                <div className="mt-2 overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Size
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Color
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Stock
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {product.variants.map((variant) => (
                        <tr key={variant.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{variant.size}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{variant.color}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{variant.stock}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Product Specifications</h2>
          </div>
          <div className="px-6 py-4">
            <div className="mb-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="spec-key" className="block text-sm font-medium text-gray-700">
                    Specification
                  </label>
                  <input
                    type="text"
                    id="spec-key"
                    name="key"
                    value={newSpec.key}
                    onChange={handleSpecChange}
                    placeholder="e.g. Material, Weight, etc."
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="spec-value" className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type="text"
                    id="spec-value"
                    name="value"
                    value={newSpec.value}
                    onChange={handleSpecChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addSpec}
                className="mt-4 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Specification
              </button>
            </div>

            {product.specifications.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Added Specifications</h3>
                <div className="mt-2 overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Specification
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Value
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{spec.key}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{spec.value}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeSpec(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/admin/products"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {isEditMode ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
