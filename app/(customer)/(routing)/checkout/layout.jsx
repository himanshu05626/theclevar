// app/layout.jsx  ❌ NO "use client"
import Providers from "@/app/component/providers";

export default function CheckoutLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="bg-[#0f0f0f]">
          {children}
          </div>
          </Providers>
      </body>
    </html>
  );
}
