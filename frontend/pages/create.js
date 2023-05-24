import { Contract } from "ethers";
import { isAddress, parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useWalletClient, erc721ABI, useAccount } from "wagmi";
import { getContract } from "@wagmi/core";
import {MarketplaceABI} from "../abis/";
import Navbar from "../components/Navbar";
import styles from "../styles/Create.module.css";
import { MARKETPLACE_ADDRESS } from "../constants";

const ERC721ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Create() {
  // State variables to contain information about the NFT being sold
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showListingLink, setShowListingLink] = useState(false);

  // Get signer from wagmi
  const { data: signer } = useWalletClient();
  const {address} = useAccount()

  // Main function to be called when 'Create' button is clicked
  async function handleCreateListing() {
    // Set loading status to true
    setLoading(true);

    try {
      // Make sure the contract address is a valid address
      const isValidAddress = isAddress(nftAddress);
      if (!isValidAddress) {
        throw new Error(`Invalid contract address`);
      }

      // Request approval over NFTs if requred, then create listing
      await requestApproval();
      await createListing();

      // Start displaying a button to view the NFT details
      setShowListingLink(true);
    } catch (error) {
      console.error(error);
    }

    // Set loading status to false
    setLoading(false);
  }

  // Function to check if NFT approval is required
  async function requestApproval() {

    // Initialize a contract instance for the NFT contract
    const ERC721Contract = getContract({
      address: nftAddress,
      abi: ERC721ABI
    });

    // Make sure user is owner of the NFT in question
    // const tokenOwner = await ERC721Contract.ownerOf(tokenId);
    // if (tokenOwner.toLowerCase() !== address.toLowerCase()) {
    //   throw new Error(`You do not own this NFT`);
    // }

    // Check if user already gave approval to the marketplace
    const isApproved = await ERC721Contract.isApprovedForAll(
      address,
      MARKETPLACE_ADDRESS
    );

    // If not approved
    if (!isApproved) {
      console.log("Requesting approval over NFTs...");

      // Send approval transaction to NFT contract
      const approvalTxn = await ERC721Contract.setApprovalForAll(
        MARKETPLACE_ADDRESS,
        true
      );
      await approvalTxn.wait();
    }
  }

  // Function to call `createListing` in the marketplace contract
  async function createListing() {
    // Initialize an instance of the marketplace contract
    const MarketplaceContract = getContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
    });

    // Send the create listing transaction
    const createListingTxn = await MarketplaceContract.createListing(
      nftAddress,
      tokenId,
      parseEther(price)
    );
    await createListingTxn.wait();
  }

  return (
    <>
      {/* Show the navigation bar */}
      <Navbar />

      {/* Show the input fields for the user to enter contract details */}
      <div className={styles.container}>
        <input
          type="text"
          placeholder="NFT Address 0x..."
          value={nftAddress}
          onChange={(e) => setNftAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price (in CELO)"
          value={price}
          onChange={(e) => {
            if (e.target.value === "") {
              setPrice("0");
            } else {
              setPrice(e.target.value);
            }
          }}
        />
        {/* Button to create the listing */}
        <button onClick={handleCreateListing} disabled={loading}>
          {loading ? "Loading..." : "Create"}
        </button>

        {/* Button to take user to the NFT details page after listing is created */}
        {showListingLink && (
          <Link href={`/${nftAddress}/${tokenId}`}>
            <a>
              <button>View Listing</button>
            </a>
          </Link>
        )}
      </div>
    </>
  );
}
