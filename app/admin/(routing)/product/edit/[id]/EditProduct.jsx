"use client";

import React, { useEffect, useState } from "react";
import { updateProduct } from "./actions";
import { useToast } from "@/app/admin/context/ToastProvider";

export default function EditProduct({ categories, product }) {
  const [images, setImages] = useState(() => {
    if (!product?.product_images?.length) return [];

    const hasPrimary = product.product_images.some((img) => img.is_primary);

    return product.product_images.map((img, index) => ({
      id: img.id,
      url: img.image_url,
      image_url: img.image_url,
      is_primary: hasPrimary ? img.is_primary : index === 0,
    }));
  });

  const [variants, setVariants] = useState(() => {
    if (!product?.variants?.length) {
      return [{ size: "", stock_qty: 0 }];
    }

    return product.variants.map((variant) => ({
      id: variant.id,
      size: variant.size ?? "",
      stock_qty: variant.stock_qty ?? 0,
    }));
  });

  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const initialState = {
    success: false,
    errors: {},
    values: product,
  };

  const [state, action, pending] = React.useActionState(
    updateProduct,
    initialState
  );

  const { showToast } = useToast();

  useEffect(() => {
    if (state.success) {
      showToast({ type: "success", message: "Product updated successfully" });
    }

    if (state.errors && Object.keys(state.errors).length > 0) {
      if (state.errors.variants && state.values?.variants) {
        try {
          const parsedVariants = JSON.parse(state.values.variants);
          setVariants(
            Array.isArray(parsedVariants) && parsedVariants.length > 0
              ? parsedVariants
              : [{ size: "", stock_qty: 0 }]
          );
        } catch {
          setVariants([{ size: "", stock_qty: 0 }]);
        }
      }

      showToast({
        type: "error",
        message: state.errors.general || "Failed to update product",
      });
    }
  }, [state.success, state.errors, state.values, showToast]);

  const Input = ({
    label,
    name,
    type = "text",
    defaultValue,
    error,
    placeholder,
  }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );

  const TextArea = ({ label, name, defaultValue }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-24 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const addVariantRow = () => {
    setVariants((prev) => [...prev, { size: "", stock_qty: 0 }]);
  };

  const removeVariantRow = (index) => {
    setVariants((prev) => {
      if (prev.length === 1) {
        return [{ size: "", stock_qty: 0 }];
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  return (
    <div className="">
      <div className="bg-white border border-gray-300 rounded shadow-sm">
        <div className="border-b border-gray-300 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit Product</h1>
          <span className="text-xs text-gray-500">ID: {product.id}</span>
        </div>

        <form action={action} noValidate>
          <input type="hidden" name="id" value={product.id} />

          <div className="p-6 space-y-8">
            <section className="space-y-4">
              <h2 className="font-semibold text-xl">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Product Name"
                  name="name"
                  defaultValue={state.values?.name}
                  error={state.errors?.name}
                />

                <div className="space-y-1">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    defaultValue={state.values?.category}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={`${cat.id}||${cat.path}`}>
                        {cat.path}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input label="SKU" name="sku" defaultValue={state.values?.sku} />

              <TextArea
                label="Description"
                name="description"
                defaultValue={state.values?.description}
              />
            </section>

            <section className="space-y-4">
              <h2 className="font-semibold text-xl">Pricing</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Regular Price"
                  name="regular_price"
                  type="number"
                  defaultValue={state.values?.regular_price}
                  error={state.errors?.regular_price}
                />

                <Input
                  label="Sale Price"
                  name="sale_price"
                  type="number"
                  defaultValue={state.values?.sale_price}
                  error={state.errors?.sale_price}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-semibold text-xl">Inventory</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Input
                  label="Stock Quantity"
                  name="stock_qty"
                  type="number"
                  defaultValue={state.values?.stock_qty}
                />

                <Input
                  label="Low Stock Threshold"
                  name="low_stock_threshold"
                  type="number"
                  placeholder="Notify when stock below this"
                  error={state.errors?.low_stock_threshold}
                  defaultValue={state.values?.low_stock_threshold}
                />

                <Input
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  defaultValue={state.values?.weight}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Stepper Value"
                  name="stepper_value"
                  type="number"
                  defaultValue={state.values?.stepper_value}
                  error={state.errors?.stepper_value}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-semibold text-xl">Product Variants</h2>

              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
                  >
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-sm font-medium text-gray-700">Size</label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. M, L, XL"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-1">
                      <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                      <input
                        type="number"
                        value={variant.stock_qty}
                        onChange={(e) => updateVariant(index, "stock_qty", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeVariantRow(index)}
                      className="h-10 rounded-md border border-red-300 px-4 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addVariantRow}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                + Add Variant
              </button>

              <input
                type="hidden"
                name="variants"
                value={JSON.stringify(variants)}
              />

              {state.errors?.variants ? (
                <p className="text-xs text-red-600">{state.errors.variants}</p>
              ) : null}
            </section>

            <section className="space-y-4">
              <h2 className="font-semibold text-xl">Product Images</h2>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition cursor-pointer">
                <span>+ Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;

                    for (const file of files) {
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("uploadType", "productImage");

                      try {
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });

                        const data = await res.json();

                        if (res.ok && data.success) {
                          setImages((prev) => {
                            const existingUrls = new Set(
                              prev.map((img) => img.image_url || img.url)
                            );

                            if (existingUrls.has(data.imageUrl)) {
                              return prev;
                            }

                            return [
                              ...prev,
                              {
                                url: data.imageUrl,
                                image_url: data.imageUrl,
                                is_primary: prev.length === 0,
                              },
                            ];
                          });
                        }
                      } catch (err) {
                        console.error("Upload failed:", err);
                      }
                    }

                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg border overflow-hidden cursor-pointer transition ${
                      img.is_primary ? "ring-2 ring-blue-500" : "border-gray-200"
                    }`}
                    onClick={() =>
                      setImages((prev) =>
                        prev.map((p, i) => ({
                          ...p,
                          is_primary: i === index,
                        }))
                      )
                    }
                  >
                    <img src={img.url} className="h-32 w-full object-cover" />

                    {img.is_primary ? (
                      <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    ) : null}

                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (img.id) {
                          setDeletedImageIds((prev) => [...prev, img.id]);
                        }
                        setImages((prev) => prev.filter((_, i) => i !== index));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <input type="hidden" name="images" value={JSON.stringify(images)} />
              <input
                type="hidden"
                name="deletedImageIds"
                value={JSON.stringify(deletedImageIds)}
              />
            </section>

            <section className="space-y-4 p-4 rounded-lg">
              <h2 className="font-semibold text-xl">SEO Metadata</h2>

              <Input
                label="Meta Title"
                name="meta_title"
                defaultValue={state.values?.meta_title}
              />

              <TextArea
                label="Meta Description"
                name="meta_description"
                defaultValue={state.values?.meta_description}
              />

              <Input
                label="Focus Keyword"
                name="focus_keyword"
                defaultValue={state.values?.focus_keyword}
              />
            </section>
          </div>

          <div className="border-t border-gray-300 px-6 py-4 flex justify-start">
            <button
              disabled={pending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
