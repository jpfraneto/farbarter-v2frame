import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getListingDetails } from "../lib/listings";
import ListingContainer from "../components/listings/ListingContainer";

export default function ListingPage() {
  const { listingId } = useParams<{ listingId: string }>();

  useEffect(() => {
    async function updateMetadata() {
      if (!listingId) return;

      try {
        const listing = await getListingDetails(listingId);

        // Update document metadata
        document.title = `${listing.metadata.name} | Farbarter`;

        // Update meta description
        let metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (!metaDescription) {
          metaDescription = document.createElement("meta");
          metaDescription.setAttribute("name", "description");
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute("content", listing.metadata.description);

        // Add Farcaster frame metadata
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

        let frameMetaTag = document.querySelector('meta[property="fc:frame"]');
        if (!frameMetaTag) {
          frameMetaTag = document.createElement("meta");
          frameMetaTag.setAttribute("property", "fc:frame");
          document.head.appendChild(frameMetaTag);
        }
        frameMetaTag.setAttribute("content", JSON.stringify(frameMetadata));
      } catch (error) {
        console.error("Error updating metadata:", error);
      }
    }

    updateMetadata();

    // Cleanup function
    return () => {
      const frameMetaTag = document.querySelector('meta[property="fc:frame"]');
      if (frameMetaTag) {
        document.head.removeChild(frameMetaTag);
      }
    };
  }, [listingId]);

  if (!listingId) return null;

  return <ListingContainer listingId={listingId} />;
}
