// app/layout.jsx  ❌ NO "use client"
import Providers from "@/app/component/providers";

export default function CheckoutLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="bg-gray-100">
          {children}
          </div>
          </Providers>
      </body>
    </html>
  );
}
