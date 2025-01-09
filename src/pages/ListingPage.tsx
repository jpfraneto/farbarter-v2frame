import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getListingDetails, type ListingDetails } from "../lib/listings";
import axios from "axios";
import sdk from "@farcaster/frame-sdk";

const ListingPage: React.FC = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReserved, setIsReserved] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [isFarcasterClient, setIsFarcasterClient] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!listingId) throw new Error("No listing ID provided");
        const details = await getListingDetails(listingId);
        setListing(details);
        setError(null);
        try {
          const farcasterContext = await sdk.context;
          if (farcasterContext?.user?.fid) {
            console.log("the client... it is a farcaster client");
            setIsFarcasterClient(true);
          }
        } catch (error) {
          console.log("the client... it is not a farcaster client", error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch listing"
        );
      }
    };

    fetchListing();
  }, [listingId]);

  if (!listing)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin">
          <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin-reverse"></div>
        </div>
      </div>
    );

  // Create the Frame embed metadata

  async function buyListing() {
    setIsGeneratingPayment(true);
    try {
      const response = await axios.get(
        `https://farcaster.anky.bot/farbarter/generate-payment-link/${listingId}`
      );
      const data = response.data;
      console.log("the data is", data);
      setPaymentLink(data.paymentUrl);
      setError(null);
      setTimeout(() => {
        setIsReserved(false);
        setPaymentLink(null);
      }, 5 * 60 * 1000);
      setIsReserved(true);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate payment link"
      );
    } finally {
      setIsGeneratingPayment(false);
    }
  }
  const frameEmbedInfo = {
    version: "next",
    imageUrl: listing.metadata.imageUrl,
    button: {
      title: `buy for ${listing.price} USDC`,
      action: {
        type: "launch_frame",
        name: "Farbarter",
        url: `https://farbarter.com/listings/${listingId}`,
        splashImageUrl: listing.metadata.imageUrl,
        splashBackgroundColor: "#4D8C97",
      },
    },
  };

  return (
    <>
      <Helmet>
        <meta name="fc:frame" content={JSON.stringify(frameEmbedInfo)} />

        <meta property="og:title" content={listing.metadata.name} />
        <meta
          property="og:description"
          content={listing.metadata.description}
        />
        <meta property="og:image" content={listing.metadata.imageUrl} />
      </Helmet>

      <div className="w-full min-h-screen bg-[#13111C] text-[#E2E8F0] font-[Space_Grotesk] overflow-x-hidden">
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
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
                  {isFarcasterClient ? (
                    <>
                      <button
                        onClick={() => {
                          // call directly the smart contract to complete the purchase
                        }}
                      >
                        Pay {listing.price} USDC now
                      </button>
                    </>
                  ) : (
                    <>
                      {isReserved ? (
                        <div className="flex flex-col gap-4 mt-6">
                          <a
                            className="w-3/5 bg-[#7C3AED] text-white py-3 md:py-4 px-6 rounded-xl hover:bg-[#6D28D9] transition-colors font-bold text-base md:text-lg"
                            href={paymentLink || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Pay {listing.price} USDC now
                          </a>
                          <button
                            className="text-sm text-[#E2E8F0]/50 hover:text-[#E2E8F0]/80 transition-colors"
                            onClick={() =>
                              navigator.clipboard.writeText(paymentLink || "")
                            }
                          >
                            Copy payment link
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-4 mt-6">
                          <button
                            className="w-3/5 bg-[#7C3AED] text-white py-3 md:py-4 px-6 rounded-xl hover:bg-[#6D28D9] transition-colors font-bold text-base md:text-lg flex justify-center items-center"
                            onClick={buyListing}
                            disabled={isGeneratingPayment}
                          >
                            {isGeneratingPayment ? (
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              `Buy for ${listing.price} USDC`
                            )}
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
