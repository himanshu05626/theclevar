import AboutPage from "../../customer/components/Aboutus/About";
import LetsWorkTogether from "../../customer/components/Aboutus/LetsWorkTogether";
import PartnersAndBrands from "../../customer/components/Aboutus/PartnersAndBrands";
import WhatWeDo from "../../customer/components/Aboutus/WhatWeDo";
import FAQAccordion from "../../customer/components/home/FAQAccordion";
import ServiceHighlights from "../../customer/components/home/ServiceHighlights";

export const metadata = {
  title: "About Us - Founder Himanshu Sharma | The Clevar",
  description: "Meet Himanshu Sharma, the Founder of Theclevar.com. Discover our journey in building a premium customizable fashion brand and integrating immersive 3D visualization.",
  keywords: [
    "Himanshu Sharma",
    "Founder of The Clevar",
    "The Clevar About Us",
    "Custom Dresses India",
    "Premium Fashion",
    "3D Shopping Experience",
    "Gen-Z Fashion Brand"
  ],
  authors: [{ name: "Himanshu Sharma", url: "https://theclevar.com" }],
  openGraph: {
    title: "About Us - Founder Himanshu Sharma | The Clevar",
    description: "Meet Himanshu Sharma, the Founder of Theclevar.com. Discover our journey in building a premium customizable fashion brand.",
    url: "https://theclevar.com/about-us",
    siteName: "The Clevar",
    images: [
      {
        url: "/founder.jpeg",
        width: 1200,
        height: 1600,
        alt: "Himanshu Sharma, Founder of The Clevar"
      }
    ],
    locale: "en_IN",
    type: "profile"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Us - Founder Himanshu Sharma | The Clevar",
    "description": "Meet Himanshu Sharma, the Founder of Theclevar.com. Discover our journey in building a premium customizable fashion brand.",
    "url": "https://theclevar.com/about-us",
    "mainEntity": {
      "@type": "Person",
      "name": "Himanshu Sharma",
      "jobTitle": "Founder",
      "image": "https://theclevar.com/founder.jpeg",
      "description": "Founder of Theclevar.com, redefining online shopping by offering premium apparel with customization options.",
      "sameAs": [
        "https://theclevar.com"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "The Clevar",
        "url": "https://theclevar.com"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPage />
      <LetsWorkTogether />
      <FAQAccordion />
      <ServiceHighlights />
    </>
  );
}
