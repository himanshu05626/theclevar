let productDetailsPromise;

export function getProductDetails() {
  if (!productDetailsPromise) {
    productDetailsPromise = fetch("/api/quick-order-detail", {
      credentials: "include",
    }).then((res) => res.json());
  }
  return productDetailsPromise;
}
