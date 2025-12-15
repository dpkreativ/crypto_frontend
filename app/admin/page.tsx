"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { MARKET_PRICES, PortfolioItem } from "@/data/adminData";
import { useAdminContext } from "@/context/AdminContext";

export default function AdminPage() {
  const { users, isLoading } = useAdminContext();

  console.log("Users on admin page:", users);

  const [prices, setPrices] = React.useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = React.useState(true);

  // Imports needed if not already present, but apiClient is usually in a lib
  // We need to import apiClient. It wasn't imported in the original file.
  // Wait, I need to check imports.

  React.useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { default: apiClient } = await import("@/lib/axios-config");
        const res = await apiClient.get("/api/crypto/prices");
        if (res.data?.data) {
          const priceMap: Record<string, number> = {};
          res.data.data.forEach((p: any) => {
            priceMap[p.name] = p.current_value;
          });
          setPrices(priceMap);
        }
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchPrices();
  }, []);

  // Helper to calculate total wallet balance
  const calculateBalance = (portfolio: PortfolioItem[]) => {
    return portfolio.reduce((acc, item) => {
      // Use fetched price, fallback to MARKET_PRICES (if kept) or 0
      const price = prices[item.symbol] ?? MARKET_PRICES[item.symbol] ?? 0;
      return acc + item.quantity * price;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="tw-min-h-screen tw-bg-dark-background tw-text-white tw-font-sans">
        <Navbar />
        <div className="tw-container tw-mx-auto tw-p-8 tw-text-center">
          <h1 className="tw-text-2xl tw-animate-pulse tw-text-primary-green">
            Loading Dashboard...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-min-h-screen tw-bg-dark-background tw-text-white tw-font-sans">
      <Navbar />
      <div className="tw-container tw-mx-auto tw-p-8">
        <h1 className="tw-text-3xl tw-font-bold tw-mb-8 tw-text-primary-green">
          Admin Dashboard
        </h1>

        <div className="tw-bg-card-dark-bg tw-rounded-lg tw-shadow-lg tw-overflow-hidden">
          <div className="tw-overflow-x-auto">
            <table className="tw-w-full tw-text-left">
              <thead className="tw-bg-neutral-900 tw-text-primary-blue tw-uppercase tw-text-sm">
                <tr>
                  <th className="tw-py-4 tw-px-6">ID</th>
                  <th className="tw-py-4 tw-px-6">Name</th>
                  <th className="tw-py-4 tw-px-6">Email</th>
                  <th className="tw-py-4 tw-px-6">Total Balance (Est.)</th>
                  <th className="tw-py-4 tw-px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="tw-divide-y tw-divide-gray-700">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="tw-py-8 tw-text-center tw-text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="tw-hover:tw-bg-gray-700/50 tw-transition-colors"
                    >
                      <td className="tw-py-4 tw-px-6">{user.id}</td>
                      <td className="tw-py-4 tw-px-6">{user.name}</td>
                      <td className="tw-py-4 tw-px-6 tw-text-gray-400">
                        {user.email}
                      </td>
                      <td className="tw-py-4 tw-px-6 tw-font-bold tw-text-primary-yellow">
                        $
                        {calculateBalance(user.portfolio || []).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )}
                      </td>
                      <td className="tw-py-4 tw-px-6">
                        <Link
                          href={`/admin/user/${user.id}`}
                          className="tw-text-primary-cyan hover:tw-text-cyan-300 tw-font-medium tw-px-4 tw-py-2 tw-rounded hover:tw-bg-white/5 tw-transition-all tw-inline-block"
                        >
                          Manage Portfolio
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
