"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import apiClient from "@/lib/axios-config";

import Navbar from "@/components/Navbar";
import { User, MARKET_PRICES } from "@/data/adminData";
import { useAdminContext } from "@/context/AdminContext";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params?.id);

  const { users, isLoading, updateUserAsset } = useAdminContext();

  const [user, setUser] = useState<User | null>(null);
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [tokenQuantity, setTokenQuantity] = useState("");

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(
    new Set()
  );
  const [cryptoList, setCryptoList] = useState<any[]>([]);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const res = await apiClient.get("/api/crypto/prices");
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setCryptoList(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedToken(res.data.data[0].name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch crypto prices:", error);
      }
    };
    fetchCryptos();
  }, []);

  /* --------------------------------------------------
     Load user from context
  -------------------------------------------------- */
  useEffect(() => {
    if (!isLoading) {
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [isLoading, users, userId]);

  if (isLoading || !user) {
    return <div className="tw-text-white tw-p-8">Loading user...</div>;
  }

  // Helper to get price for a symbol from fetched list or static fallback
  const getPrice = (symbol: string) => {
    const crypto = cryptoList.find((c) => c.name === symbol);
    return crypto ? crypto.current_value : MARKET_PRICES[symbol] || 0;
  };

  /* --------------------------------------------------
     Handlers
  -------------------------------------------------- */
  const handleAddToken = () => {
    const qty = parseFloat(tokenQuantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Enter a valid positive quantity.");
      return;
    }

    const existingIndex = user.portfolio.findIndex(
      (item) => item.symbol === selectedToken
    );

    const updatedPortfolio = [...user.portfolio];

    if (existingIndex >= 0) {
      updatedPortfolio[existingIndex] = {
        ...updatedPortfolio[existingIndex],
        quantity: updatedPortfolio[existingIndex].quantity + qty,
      };
    } else {
      updatedPortfolio.push({ symbol: selectedToken, quantity: qty });
    }

    setUser({ ...user, portfolio: updatedPortfolio });
    setTokenQuantity("");
    setHasChanges(true);
  };

  const handleRemoveToken = (symbol: string) => {
    setUser({
      ...user,
      portfolio: user.portfolio.filter((item) => item.symbol !== symbol),
    });

    setPendingDeletions((prev) => new Set(prev).add(symbol));
    setHasChanges(true);
  };

  const handleUpdateQuantity = (symbol: string, qty: number) => {
    if (qty < 0 || isNaN(qty)) return;

    setUser({
      ...user,
      portfolio: user.portfolio.map((item) =>
        item.symbol === symbol ? { ...item, quantity: qty } : item
      ),
    });

    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const symbol of pendingDeletions) {
        await updateUserAsset(user.id, { symbol, quantity: 0 });
      }

      for (const item of user.portfolio) {
        await updateUserAsset(user.id, item);
      }

      toast.success("Changes saved successfully");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateTotalValue = () =>
    user.portfolio.reduce((sum, item) => {
      const price = getPrice(item.symbol);
      return sum + item.quantity * price;
    }, 0);

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */
  return (
    <div className="tw-min-h-screen tw-bg-dark-background tw-text-white">
      <Navbar />

      <div className="tw-container tw-mx-auto tw-p-8">
        <Link
          href="/admin"
          className="tw-text-gray-400 hover:tw-text-white tw-mb-6 tw-inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* ... Header ... */}
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-8">
          <h1 className="tw-text-3xl tw-font-bold tw-text-primary-green">
            Manage Portfolio: {user.name}
          </h1>
          <div className="tw-flex tw-items-center tw-gap-6">
            <div className="tw-text-xl">
              <span className="tw-text-gray-400">Total Value: </span>
              <span className="tw-font-bold tw-text-primary-cyan">
                $
                {calculateTotalValue().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="tw-bg-primary-blue tw-text-black tw-font-bold tw-px-6 tw-py-2 tw-rounded disabled:tw-opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Add Token */}
        <div className="tw-bg-card-dark-bg tw-p-6 tw-rounded-lg tw-mb-8">
          <div className="tw-flex tw-gap-4">
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="tw-bg-dark-background tw-border tw-border-gray-600 tw-rounded tw-px-4 tw-py-2 tw-text-white"
            >
              {cryptoList.length > 0 ? (
                cryptoList.map((crypto) => (
                  <option key={crypto.id} value={crypto.name}>
                    {crypto.name} (${crypto.current_value.toLocaleString()})
                  </option>
                ))
              ) : (
                <option disabled>Loading cryptos...</option>
              )}
            </select>

            <input
              type="number"
              value={tokenQuantity}
              onChange={(e) => setTokenQuantity(e.target.value)}
              placeholder="Quantity"
              className="tw-bg-dark-background tw-border tw-border-gray-600 tw-rounded tw-px-4 tw-py-2"
            />

            <button
              onClick={handleAddToken}
              className="tw-bg-primary-green tw-text-black tw-font-bold tw-px-6 tw-rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="tw-bg-card-dark-bg tw-rounded-lg tw-overflow-hidden">
          {user.portfolio.length === 0 ? (
            <div className="tw-p-8 tw-text-gray-500 tw-text-center">
              No assets in portfolio
            </div>
          ) : (
            <table className="tw-w-full">
              <thead className="tw-bg-neutral-900 tw-text-gray-400">
                <tr>
                  <th className="tw-p-4">Token</th>
                  <th className="tw-p-4 tw-text-right">Quantity</th>
                  <th className="tw-p-4 tw-text-right">Value</th>
                  <th className="tw-p-4 tw-text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {user.portfolio.map((item) => {
                  const price = getPrice(item.symbol);
                  return (
                    <tr key={item.symbol}>
                      <td className="tw-p-4">{item.symbol}</td>
                      <td className="tw-p-4 tw-text-right">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.symbol,
                              parseFloat(e.target.value)
                            )
                          }
                          className="tw-bg-transparent tw-border-b tw-border-gray-600 tw-text-right"
                        />
                      </td>
                      <td className="tw-p-4 tw-text-right">
                        $
                        {(item.quantity * price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="tw-p-4 tw-text-center">
                        <button
                          onClick={() => handleRemoveToken(item.symbol)}
                          className="tw-text-red-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
