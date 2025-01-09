import { Link } from "react-router-dom";
import { formatUnits } from "viem";
import { ListingCardProps } from "./ListingsGrid";

export const ListingCard = ({ listing }: ListingCardProps) => {
  const formatPrice = (price: string) => {
    const priceInUsd = Number(formatUnits(BigInt(price), 6));
    return priceInUsd.toFixed(2);
  };
  console.log("INSIDE THE LISTING CARD", listing);

  return (
    <Link to={`/listings/${listing.id}`}>
      <div className="bg-[#1A1625]/90 rounded-xl border border-[#7C3AED] overflow-hidden hover:border-[#A855F7] transition-all duration-300">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={listing.imageUrl}
            alt={`Listing ${listing.id}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-[#1A1625]/90 px-3 py-1 rounded-full border border-[#7C3AED]">
            <span className="text-sm font-medium">
              {formatPrice(listing.price)} USDC
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {listing.sellerProfile?.pfp && (
                <img
                  src={listing.sellerProfile.pfp}
                  alt="Seller"
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-[#E2E8F0]/90 text-sm">
                @{listing.sellerProfile?.username || "unknown"}
              </span>
            </div>
            <span className="text-[#E2E8F0]/70 text-sm">#{listing.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#E2E8F0]/80 text-sm">
              Available: {listing.remainingSupply}
            </span>
            <span className="text-[#E2E8F0]/80 text-sm">
              Sales: {listing.totalSales}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
