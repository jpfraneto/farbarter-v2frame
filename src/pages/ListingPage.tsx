import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getListingDetails } from "../lib/listings";
import ListingContainer from "../components/listings/ListingContainer";

export default function ListingPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    async function fetchListing() {
      if (!listingId) return;

      try {
        const listingData = await getListingDetails(listingId);
        setListing(listingData);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    }

    fetchListing();
  }, [listingId]);

  if (!listingId || !listing) return null;

  const frameMetadata = {
    version: "vNext",
    image: listing.metadata.imageUrl,
    buttons: [
      {
        label: "View Listing",
        action: "link",
        target: `${window.location.origin}/listings/${listingId}`,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{`${listing.metadata.name} | Farbarter`}</title>
        <meta name="description" content={listing.metadata.description} />
        <meta property="fc:frame" content={JSON.stringify(frameMetadata)} />
      </Helmet>
      <ListingContainer listingId={listingId} />
    </>
  );
}
