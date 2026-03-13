"use client";

import React, { useEffect, useState } from "react";
import { addProduct } from "./actions";
import { useToast } from "@/app/admin/context/ToastProvider";
import UploadImage from "@/app/component/UploadImage";
import CategorySelect from "./CategorySelect";
import { useRouter } from "next/navigation";
import FormInput from "./FormInput";

import {
  SparklesIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

const initialState = {
  success: false,
  errors: {},
  values: {}
};

export default function AddProductForm({ categories }) {

  const router = useRouter();
  const { showToast } = useToast();

  const [state, action, pending] = React.useActionState(
    addProduct,
    initialState
  );

  const [mode, setMode] = useState("ai");
  const [aiLoading, setAiLoading] = useState(false);

  const [variants, setVariants] = useState([
    { size: "", stock_qty: 0 }
  ]);

  const [category, setCategory] = useState("");

  const [images, setImages] = useState([]);

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (state.success) {
      showToast({
        type: "success",
        message: "Product added successfully"
      });

      router.push(`/admin/product/add/${state.productId}/tier-price`);
    }

    if (state.errors && Object.keys(state.errors).length > 0) {
      showToast({
        type: "error",
        message: state.errors.general || "Failed to add product"
      });
    }

  }, [state.success, state.errors]);



  /* ---------------- AI IMAGE UPLOAD ---------------- */

  const handleAiUpload = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    try {

      setAiLoading(true);

      const res = await fetch("/admin/api/fetch-product", {
        method: "POST",
        headers: {
          "Content-Type": file.type
        },
        body: file
      });

      const result = await res.json();

      if (result.status === "success") {

        const data = result.data;

        setFormValues(data);

        setCategory(data.category || "");

        if (data.variants) {
          setVariants(data.variants);
        }

        showToast({
          type: "success",
          message: "AI filled product information"
        });

      }

    } catch (err) {

      showToast({
        type: "error",
        message: "AI processing failed"
      });

    } finally {
      setAiLoading(false);
    }
  };



  /* ---------------- VARIANT LOGIC ---------------- */

  const addVariantRow = () => {
    setVariants(prev => [...prev, { size: "", stock_qty: 0 }]);
  };

  const removeVariantRow = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {

    setVariants(prev =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    );
  };



  return (
    <div>

      {/* MODE SELECTOR */}

      <div className="flex gap-4 mb-6 mt-2">

        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex items-center gap-2 px-4 py-2 rounded border border-gray-300 ${
            mode === "manual"
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          <PencilSquareIcon className="w-5 h-5"/>
          Manual Fill
        </button>

        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded border border-gray-300 ${
            mode === "ai"
              ? "bg-purple-600 text-white"
              : "bg-white"
          }`}
        >
          <SparklesIcon className="w-5 h-5"/>
          AI Fill
        </button>

      </div>


      {/* AI IMAGE UPLOAD */}

      {mode === "ai" && (
        <div className="mb-6 border border-gray-300 p-4 rounded bg-gray-50">

          <h3 className="font-semibold mb-3">
            Upload product image for AI
          </h3>

          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:bg-blue-500 file:text-white
                      file:border-0 cursor-pointer file:rounded
                      hover:file:bg-blue-600"
            onChange={handleAiUpload}
          />

          {aiLoading && (
            <p className="text-sm mt-2 text-gray-500">
              AI analyzing image...
            </p>
          )}

        </div>
      )}



      <div className="bg-white border border-gray-300 rounded shadow-sm">

        <div className="border-b border-gray-300 px-6 py-4">
          <h1 className="text-xl font-semibold">Add Product</h1>
        </div>


        <form action={action} noValidate>

          <div className="p-6 space-y-8">


            {/* BASIC INFO */}

            <section className="space-y-4">

              <h2 className="text-xl font-semibold">
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <FormInput
                  key={formValues.name}
                  label="Product Name"
                  name="name"
                  required
                  defaultValue={formValues.name}
                />

                <div className="space-y-1">

                  <label className="text-sm font-medium">
                    Category
                  </label>

                  <CategorySelect
                    categories={categories}
                    value={category}
                    onChange={setCategory}
                  />

                  <input
                    type="hidden"
                    name="category"
                    value={category}
                  />

                </div>

              </div>

              <FormInput
                key={formValues.sku}
                label="SKU"
                name="sku"
                defaultValue={formValues.sku}
              />

              <FormInput
                key={formValues.description}
                label="Description"
                name="description"
                textarea
                defaultValue={formValues.description}
              />

            </section>



            {/* PRICING */}

            <section className="space-y-4">

              <h2 className="text-xl font-semibold">Pricing</h2>

              <div className="grid md:grid-cols-2 gap-6">

                <FormInput
                  key={formValues.regular_price}
                  label="Regular Price"
                  name="regular_price"
                  type="number"
                  required
                  defaultValue={formValues.regular_price}
                />

                <FormInput
                  key={formValues.sale_price}
                  label="Sale Price"
                  name="sale_price"
                  type="number"
                  defaultValue={formValues.sale_price}
                />

              </div>

            </section>



            {/* INVENTORY */}

            <section className="space-y-4">

              <h2 className="text-xl font-semibold">Inventory</h2>

              <div className="grid md:grid-cols-3 gap-6">

                <FormInput
                  key={formValues.stock_qty}
                  label="Stock Quantity"
                  name="stock_qty"
                  type="number"
                  defaultValue={formValues.stock_qty}
                />

                <FormInput
                  key={formValues.low_stock_threshold}
                  label="Low Stock Threshold"
                  name="low_stock_threshold"
                  type="number"
                  defaultValue={formValues.low_stock_threshold}
                />

                <FormInput
                  key={formValues.stepper_value}
                  label="Stepper Value"
                  name="stepper_value"
                  type="number"
                  defaultValue={formValues.stepper_value}
                />

              </div>

            </section>



            {/* VARIANTS */}

            <section className="space-y-4">

              <h2 className="text-xl font-semibold">
                Product Variants
              </h2>

              {variants.map((variant, index) => (

                <div key={index} className="grid grid-cols-3 gap-3">

                  <input
                    type="text"
                    placeholder="Size"
                    className="border rounded px-3 py-2"
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(index,"size",e.target.value)
                    }
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    className="border rounded px-3 py-2"
                    value={variant.stock_qty}
                    onChange={(e) =>
                      updateVariant(index,"stock_qty",e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeVariantRow(index)}
                    className="bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>

                </div>

              ))}

              <button
                type="button"
                onClick={addVariantRow}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                + Add Size
              </button>

              <input
                type="hidden"
                name="variants"
                value={JSON.stringify(variants)}
              />

            </section>



            {/* IMAGES */}

            <section className="space-y-4">

              <h2 className="text-xl font-semibold">
                Product Images
              </h2>

              <UploadImage
                uploadType="productImage"
                onSuccess={(urls) => {

                  setImages(prev => [
                    ...prev,
                    ...urls.map(url => ({
                      url,
                      is_default: prev.length === 0
                    }))
                  ]);

                }}
              />

              <input
                type="hidden"
                name="images"
                value={JSON.stringify(images)}
              />

            </section>



            {/* SEO */}

            <section className="space-y-4">

              <h2 className="text-xl font-semibold">
                SEO Metadata
              </h2>

              <FormInput
                key={formValues.meta_title}
                label="Meta Title"
                name="meta_title"
                defaultValue={formValues.meta_title}
              />

              <FormInput
                key={formValues.meta_description}
                label="Meta Description"
                name="meta_description"
                textarea
                defaultValue={formValues.meta_description}
              />

              <FormInput
                key={formValues.focus_keyword}
                label="Focus Keyword"
                name="focus_keyword"
                defaultValue={formValues.focus_keyword}
              />

            </section>

          </div>


          <div className="border-t border-gray-300 px-6 py-4">

            <button
              disabled={pending}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {pending ? "Saving..." : "Save Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}