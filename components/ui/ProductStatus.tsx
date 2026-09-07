export type ProductStatusValue = "live" | "building" | "next" | "later";

const labels: Record<ProductStatusValue, string> = {
  live: "Live",
  building: "Building",
  next: "Next",
  later: "Later",
};

export default function ProductStatus({ status, className = "" }: { status: ProductStatusValue; className?: string }) {
  return (
    <span className={`nexus-product-status ${className}`} data-status={status}>
      <span aria-hidden="true" className="nexus-product-status__dot" />
      {labels[status]}
    </span>
  );
}
