import { createPublicClient, http, type Address } from "viem";
import { base } from "viem/chains";
import axios from "axios";
import farbarter_abi from "./farbarter_abi.json";

export interface ListingDetails {
  seller: Address;
  fid: number;
  price: string;
  remainingSupply: number;
  metadata: ListingMetadata;
  isActive: boolean;
  totalSales: number;
  preferredToken: string;
  preferredChain: number;
}

export interface ListingMetadata {
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  supply: number;
  isOnline: boolean;
  price: string;
}

const FARBARTER_CONTRACT_ADDRESS =
  "0xbAeCa7e569eFea6e020014EAb898373407bBe826" as Address;

const client = createPublicClient({
  chain: base,
  transport: http(),
});

export async function getListingDetails(
  listingId: string
): Promise<ListingDetails> {
  if (!listingId || isNaN(Number(listingId))) {
    throw new Error("Invalid listing ID");
  }

  try {
    const details = (await client.readContract({
      address: FARBARTER_CONTRACT_ADDRESS,
      abi: farbarter_abi,
      functionName: "getListingDetails",
      args: [BigInt(listingId)],
    })) as [
      Address,
      bigint,
      bigint,
      bigint,
      string,
      boolean,
      bigint,
      string,
      bigint
    ];

    const metadata = await fetchMetadataFromIpfs(details[4]);
    console.log("the metadata is", metadata);

    return {
      seller: details[0],
      fid: Number(details[1]),
      price: metadata?.price,
      remainingSupply: Number(details[3]),
      metadata,
      isActive: details[5],
      totalSales: Number(details[6]),
      preferredToken: details[7],
      preferredChain: Number(details[8]),
    };
  } catch (error) {
    console.error("Error fetching listing details:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch listing details: ${error.message}`);
    }
    throw new Error("Failed to fetch listing details");
  }
}

async function fetchMetadataFromIpfs(
  ipfsHash: string
): Promise<ListingMetadata> {
  try {
    const response = await axios.get(
      `https://anky.mypinata.cloud/ipfs/${ipfsHash}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching metadata from IPFS:", error);
    throw new Error("Failed to fetch metadata from IPFS");
  }
}
