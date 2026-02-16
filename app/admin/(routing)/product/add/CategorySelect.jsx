"use client";

import { useState, useRef } from "react";

export default function CategorySelect({
  categories,
  value,
  onChange,
  error,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = categories.filter((cat) =>
    cat.path.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      {/* <label className="label">Category</label> */}

      {/* INPUT */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Type to search category..."
        className="input p-2 border border-gray-300 rounded w-full"
      />

      {/* DROPDOWN */}
      {open && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow">
          {filtered.length === 0 && (
            <li className="p-2 text-sm text-gray-400">
              No category found
            </li>
          )}

          {filtered.map((cat) => (
            <li
              key={cat.id}
              onClick={() => {
                setQuery(cat.path);
                onChange(`${cat.id}||${cat.path}`);
                setOpen(false);
              }}
              className="cursor-pointer p-2 hover:bg-gray-100 text-sm"
            >
              {cat.path}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
