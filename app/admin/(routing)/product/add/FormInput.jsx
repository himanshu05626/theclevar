"use client";

export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  defaultValue = "",
  error,
  placeholder = "",
  textarea = false,
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`w-full h-24 rounded-md px-3 py-2 border ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`w-full rounded-md px-3 py-2 border ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
      )}

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
