export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="h-80 bg-gray-200 rounded" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 w-2/3" />
          <div className="h-4 bg-gray-200 w-1/3" />
          <div className="h-10 bg-gray-200 w-1/4" />
        </div>
      </div>
    </div>
  );
}
