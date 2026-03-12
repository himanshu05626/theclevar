"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";

export default function ClarityInit() {
  useEffect(() => {
    clarity.init("vurcak3h2c"); // your clarity project id
  }, []);

  return null;
}