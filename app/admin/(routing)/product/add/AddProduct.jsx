"use client";

import React, { useEffect } from "react";
import { addProduct } from "./actions";
import { useToast } from "@/app/admin/context/ToastProvider";
import UploadImage from "@/app/component/UploadImage";
import CategorySelect from "./CategorySelect";
import { useRouter } from "next/navigation";
import FormInput from "./FormInput";

const initialState = {
  success: false,
  errors: {},
  values: {},
};

export default function AddProductForm({ categories }) {
  const router = useRouter();

  const [state, action, pending] = React.useActionState(
    addProduct,
    initialState
  );
const [variants, setVariants] = React.useState([
  { size: "", stock_qty: 0 },
]);

  const [category, setCategory] = React.useState(
    state.values?.category || ""
  );

  const [images, setImages] = React.useState([]);

  const { showToast } = useToast();

  useEffect(() => {
    if (state.success) {
      showToast({
        type: "success",
        message: "Product added successfully",
      });
      router.push(`/admin/product/add/${state.productId}/tier-price`);
    }

    if (state.errors && Object.keys(state.errors).length > 0) {
      showToast({
        type: "error",
        message: state.errors.general || "Failed to add product",
      });
    }
  }, [state.success, state.errors, showToast, router]);
const addVariantRow = () => {
  setVariants((prev) => [...prev, { size: "", stock_qty: 0 }]);
};

const removeVariantRow = (index) => {
  setVariants((prev) => prev.filter((_, i) => i !== index));
};

const updateVariant = (index, field, value) => {
  setVariants((prev) =>
    prev.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    )
  );
};

  return (
    <div>
      <div className="bg-white border border-gray-300 rounded shadow-sm">
        {/* HEADER */}
        <div className="border-b border-gray-300 px-6 py-4">
          <h1 className="text-xl font-semibold">Add Product</h1>
        </div>

        <form action={action} noValidate>
          <div className="p-6 space-y-8">

            {/* BASIC INFORMATION */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Product Name"
                  name="name"
                  required
                  defaultValue={state.values?.name}
                  error={state.errors?.name}
                />

                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <CategorySelect
                    categories={categories}
                    value={category}
                    onChange={setCategory}
                    error={state.errors?.category}
                  />
                  <input type="hidden" name="category" value={category} />
                </div>
              </div>

              <FormInput
                label="SKU"
                name="sku"
                defaultValue={state.values?.sku}
                error={state.errors?.sku}
              />

              <FormInput
                label="Description"
                name="description"
                textarea
                defaultValue={state.values?.description}
              />
            </section>

            {/* PRICING */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Pricing</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Regular Price"
                  name="regular_price"
                  type="number"
                  required
                  defaultValue={state.values?.regular_price}
                  error={state.errors?.regular_price}
                />

                <FormInput
                  label="Sale Price"
                  name="sale_price"
                  type="number"
                  defaultValue={state.values?.sale_price}
                />
              </div>
            </section>

            {/* INVENTORY */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Inventory</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <FormInput
                  label="Stock Quantity"
                  name="stock_qty"
                  type="number"
                  required
                  defaultValue={state.values?.stock_qty}
                  error={state.errors?.stock_qty}
                />

                <FormInput
                  label="Low Stock Threshold"
                  name="low_stock_threshold"
                  type="number"
                  defaultValue={state.values?.low_stock_threshold}
                  error={state.errors?.low_stock_threshold}
                />

           

                <FormInput
                  label="Stepper Value"
                  name="stepper_value"
                  type="number"
                  required
                  defaultValue={state.values?.stepper_value}
                  error={state.errors?.stepper_value}
                />
              </div>
            </section>
            {/* VARIANTS */}
<section className="space-y-4">
  <h2 className="text-xl font-semibold">Product Variants (Sizes)</h2>

  <div className="space-y-3">
    {variants.map((variant, index) => (
      <div key={index} className="grid grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Size (S, M, L)"
          className="border rounded px-3 py-2"
          value={variant.size}
          onChange={(e) =>
            updateVariant(index, "size", e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Stock"
          className="border rounded px-3 py-2"
          value={variant.stock_qty}
          onChange={(e) =>
            updateVariant(index, "stock_qty", e.target.value)
          }
        />

        <button
          type="button"
          onClick={() => removeVariantRow(index)}
          className="bg-red-500 text-white rounded px-3"
        >
          Remove
        </button>
      </div>
    ))}
  </div>

  <button
    type="button"
    onClick={addVariantRow}
    className="bg-gray-200 px-4 py-2 rounded"
  >
    + Add Size
  </button>

  {/* hidden input */}
  <input
    type="hidden"
    name="variants"
    value={JSON.stringify(variants)}
  />
</section>


            {/* PRODUCT IMAGES */}
           {/* ───────── PRODUCT IMAGES ───────── */}
<section className="space-y-4">
  <h2 className="text-xl font-semibold">Product Images</h2>

  <UploadImage
    uploadType="productImage"
    onSuccess={(urls) => {
      setImages((prev) => [
        ...prev,
        ...urls.map((url) => ({
          url,
          is_default: prev.length === 0, // first image default
        })),
      ]);
    }}
  />

  {/* IMAGE PREVIEW GRID */}
  {images.length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((img, index) => (
        <div
          key={index}
          className={`relative rounded-lg  overflow-hidden cursor-pointer
            ${
              img.is_default
                ? "ring-2 ring-blue-500"
                : "border-gray-200"
            }`}
          onClick={() =>
            setImages((prev) =>
              prev.map((p, i) => ({
                ...p,
                is_default: i === index,
              }))
            )
          }
        >
          <img
            src={img.url}
            alt="Product"
            className="h-32 w-full object-cover"
          />

          {/* PRIMARY BADGE */}
          {img.is_default && (
            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Primary
            </span>
          )}

          {/* REMOVE BUTTON */}
          <button
            type="button"
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setImages((prev) =>
                prev.filter((_, i) => i !== index)
              );
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

  {/* HIDDEN INPUT FOR SERVER ACTION */}
  <input
    type="hidden"
    name="images"
    value={JSON.stringify(images)}
  />
</section>


            {/* SEO */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">SEO Metadata</h2>

              <FormInput
                label="Meta Title"
                name="meta_title"
                required
                defaultValue={state.values?.meta_title}
                error={state.errors?.meta_title}
              />

              <FormInput
                label="Meta Description"
                name="meta_description"
                textarea
                required
                defaultValue={state.values?.meta_description}
                error={state.errors?.meta_description}
              />

              <FormInput
                label="Focus Keyword"
                name="focus_keyword"
                required
                defaultValue={state.values?.focus_keyword}
                error={state.errors?.focus_keyword}
              />
            </section>
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-300 px-6 py-4">
            <button
              disabled={pending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
