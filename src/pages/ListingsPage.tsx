import { useState, useEffect } from "react";
import { ListingCard } from "../components/listings/ListingCard";
import { Helmet } from "react-helmet";

interface Listing {
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
}

interface ListingData {
  id: number;
  seller: string;
  fid: number;
  price: string;
  remainingSupply: number;
  metadata: string;
  isActive: boolean;
  totalSales: number;
}

interface ProfileData {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🎯 Initial useEffect triggered");
    fetchListings();
  }, []);

  const fetchListings = async () => {
    console.log("📋 Fetching listings...");
    try {
      // Fetch listings from Ponder indexer
      const response = await fetch("https://ponder.farbarter.com/listings");
      const json_response = await response.json();
      const listingsData = json_response.items as ListingData[];
      console.log(
        "📦 Raw listings data received:",
        listingsData.length,
        "items"
      );

      // Get unique FIDs to fetch user profiles
      const fids = [...new Set(listingsData.map((l) => l.fid))];
      console.log("👥 Unique FIDs found:", fids.length);

      // Fetch user profiles from Farcaster
      const profilesResponse = await fetch(
        `https://farcaster.anky.bot/farcaster/user/bulk?fids=${fids.join(",")}`
      );
      const json_profilesResponse = await profilesResponse.json();
      const profilesData = json_profilesResponse.users as ProfileData[];
      console.log("👤 Profiles fetched:", profilesData.length);

      // Fetch metadata for each listing
      const enhancedListings = await Promise.all(
        listingsData.map(async (listing: ListingData) => {
          try {
            const metadataResponse = await fetch(
              `https://anky.mypinata.cloud/ipfs/${listing.metadata}`
            );
            const metadata = await metadataResponse.json();
            return {
              ...listing,
              imageUrl: metadata.imageUrl,
              sellerProfile: profilesData.find((p) => p.fid === listing.fid),
            };
          } catch (error) {
            console.error(
              `Error fetching metadata for listing ${listing.id}:`,
              error
            );
            return {
              ...listing,
              imageUrl: `https://picsum.photos/seed/${listing.id}/400/300`, // Fallback image
              sellerProfile: profilesData.find((p) => p.fid === listing.fid),
            };
          }
        })
      );

      console.log("✨ Enhanced listings created:", enhancedListings.length);
      setListings(enhancedListings);
    } catch (error) {
      console.error("💥 Error fetching listings:", error);
    } finally {
      console.log("🏁 Finished loading listings");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#13111C] text-[#E2E8F0] relative font-[Space_Grotesk]">
      <Helmet>
        <title>All Listings - Farbarter</title>
        <meta
          name="description"
          content="Browse all listings on Farbarter - The P2P Marketplace for Farcaster"
        />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center p-8 relative bg-[radial-gradient(circle_at_top_right,#7C3AED_0%,transparent_60%),radial-gradient(circle_at_bottom_left,#C084FC_0%,transparent_60%)]">
        <h1 className="text-5xl md:text-6xl font-bold my-8 bg-gradient-to-r from-[#A855F7] via-[#7C3AED] to-[#6366F1] bg-clip-text text-transparent">
          All Listings
        </h1>

        {loading ? (
          <div className="w-full max-w-6xl flex items-center justify-center my-16">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#7C3AED]" />
          </div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
