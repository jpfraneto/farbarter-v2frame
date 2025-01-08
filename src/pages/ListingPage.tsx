import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getListingDetails, type ListingDetails } from "../lib/listings";
import axios from "axios";

const ListingPage: React.FC = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReserved, setIsReserved] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!listingId) throw new Error("No listing ID provided");
        const details = await getListingDetails(listingId);
        setListing(details);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch listing"
        );
      }
    };

    fetchListing();
  }, [listingId]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!listing) return <div className="p-4">Loading...</div>;

  // Create the Frame embed metadata
  const frameEmbed = {
    version: "next",
    imageUrl: listing.metadata.imageUrl,
    button: {
      title: `Buy for ${listing.price} USDC`,
      action: {
        type: "launch_frame",
        name: "Farbarter",
        url: `${window.location.origin}/listings/${listingId}/buy`,
        splashImageUrl: listing.metadata.imageUrl,
        splashBackgroundColor: "#000000",
      },
    },
  };

  async function buyListing() {
    try {
      const response = await axios.get(
        `https://farcaster.anky.bot/farbarter/generate-payment-link/${listingId}`
      );
      console.log(response);
      const data = response.data;
      console.log("the data is", data);
      setIsReserved(true);
      setPaymentLink(data.url.paymentLink);
      setTimeout(() => {
        setIsReserved(false);
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Helmet>
        <meta name="fc:frame" content={JSON.stringify(frameEmbed)} />
        <meta property="og:title" content={listing.metadata.name} />
        <meta
          property="og:description"
          content={listing.metadata.description}
        />
        <meta property="og:image" content={listing.metadata.imageUrl} />
      </Helmet>

      <div className="w-full min-h-screen bg-[#13111C] text-[#E2E8F0] font-[Space_Grotesk] overflow-x-hidden">
        <div className="min-h-screen flex justify-center items-center p-4 md:p-8 relative bg-[radial-gradient(circle_at_top_right,#7C3AED_0%,transparent_60%),radial-gradient(circle_at_bottom_left,#C084FC_0%,transparent_60%)]">
          <div className="w-full max-w-3xl bg-[#1A1625]/90 rounded-xl border border-[#7C3AED] overflow-hidden shadow-xl">
            <div className="relative w-full">
              <img
                src={listing.metadata.imageUrl}
                alt={listing.metadata.name}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            <div className="p-4 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#A855F7]">
                {listing.metadata.name}
              </h1>
              <p className="text-sm md:text-base text-[#E2E8F0]/80 mb-6">
                {listing.metadata.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1A1625]/80 p-3 md:p-4 rounded-xl border border-[#7C3AED]">
                  <h2 className="text-xs md:text-sm text-[#A855F7]">Price</h2>
                  <p className="text-lg md:text-xl font-semibold text-[#E2E8F0]">
                    {listing.price} USDC
                  </p>
                </div>
                <div className="bg-[#1A1625]/80 p-3 md:p-4 rounded-xl border border-[#7C3AED]">
                  <h2 className="text-xs md:text-sm text-[#A855F7]">
                    Available
                  </h2>
                  <p className="text-lg md:text-xl font-semibold text-[#E2E8F0]">
                    {listing.remainingSupply} left
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1A1625]/80 p-3 md:p-4 rounded-xl border border-[#7C3AED]">
                  <h2 className="text-xs md:text-sm text-[#A855F7]">
                    Location
                  </h2>
                  <p className="text-sm md:text-base text-[#E2E8F0]">
                    {listing.metadata.location}
                  </p>
                </div>
                <div className="bg-[#1A1625]/80 p-3 md:p-4 rounded-xl border border-[#7C3AED]">
                  <h2 className="text-xs md:text-sm text-[#A855F7]">Seller</h2>
                  <p className="text-sm md:text-base text-[#E2E8F0]">
                    FID: {listing.fid}
                  </p>
                </div>
                <div className="bg-[#1A1625]/80 p-3 md:p-4 rounded-xl border border-[#7C3AED]">
                  <h2 className="text-xs md:text-sm text-[#A855F7]">Type</h2>
                  <p className="text-sm md:text-base text-[#E2E8F0]">
                    {listing.metadata.isOnline ? "Online" : "In Person"}
                  </p>
                </div>
              </div>

              {listing.isActive ? (
                <>
                  {isReserved ? (
                    <div className="flex gap-4 mt-6">
                      <a
                        className="w-3/5 bg-[#7C3AED] text-white py-3 md:py-4 px-6 rounded-xl hover:bg-[#6D28D9] transition-colors font-bold text-base md:text-lg"
                        href={paymentLink || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        pay {listing.price} USDC now
                      </a>
                    </div>
                  ) : (
                    <div className="flex gap-4 mt-6">
                      <button
                        className="w-3/5 bg-[#7C3AED] text-white py-3 md:py-4 px-6 rounded-xl hover:bg-[#6D28D9] transition-colors font-bold text-base md:text-lg"
                        onClick={buyListing}
                      >
                        Buy for {listing.price} USDC
                      </button>
                      <button
                        className="w-2/5 bg-[#7C3AED] text-white py-3 md:py-4 px-6 rounded-xl hover:bg-[#6D28D9] transition-colors font-bold text-base md:text-lg"
                        onClick={() => (window.location.href = "/")}
                      >
                        Back
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full mt-6 bg-[#1A1625]/80 text-[#E2E8F0]/50 py-3 md:py-4 px-6 rounded-xl text-center border border-[#7C3AED]">
                  Listing Not Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingPage;
