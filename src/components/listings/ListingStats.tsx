interface ListingStatsProps {
  price: string;
  remainingSupply: number;
  totalSupply: number;
  location: string;
  isOnline: boolean;
  fid: number;
}

export function ListingStats({
  price,
  remainingSupply,
  totalSupply,
  location,
  isOnline,
  fid,
}: ListingStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-700">
      <div>
        <h3 className="text-sm font-mono text-cyan-400">Price</h3>
        <p className="mt-1 text-xl font-bold text-white">{price} eth</p>
      </div>
      <div>
        <h3 className="text-sm font-mono text-cyan-400">Available</h3>
        <p className="mt-1 text-xl font-bold text-white">
          {remainingSupply} / {totalSupply}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-mono text-cyan-400">Location</h3>
        <p className="mt-1 text-white">
          {location}
          {isOnline && " (Online)"}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-mono text-cyan-400">Seller FID</h3>
        <p className="mt-1 text-white">{fid}</p>
      </div>
    </div>
  );
}
