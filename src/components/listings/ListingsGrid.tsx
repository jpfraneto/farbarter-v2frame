import { Link } from "react-router-dom";
import { ListingCard } from "./ListingCard";

export interface ListingCardProps {
  listing: {
    id: number;
    seller: string;
    fid: number;
    price: string;
    remainingSupply: number;
    metadata: string;
    isActive: boolean;
    totalSales: number;
    imageUrl?: string;
    sellerProfile?: {
      username: string;
      displayName: string;
      pfp: string;
    };
  };
}

const ListingsGrid = ({
  listings,
}: {
  listings: ListingCardProps["listing"][];
}) => {
  const lastThreeListings = listings.slice(0, 3);

  return (
    <div className="w-full max-w-6xl mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#A855F7]">
        🏪 Last 3 Listings:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lastThreeListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <Link to="/listings" className="text-sm text-[#E2E8F0]/80">
        View All
      </Link>
    </div>
  );
};

export default ListingsGrid;
