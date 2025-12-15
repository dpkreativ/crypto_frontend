"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, PortfolioItem } from "@/data/adminData";
import apiClient from "@/lib/axios-config";

interface AdminContextType {
  users: User[];
  isLoading: boolean;
  updateUser: (updatedUser: User) => void;
  updateUserAsset: (userId: number, asset: PortfolioItem) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users and their assets
        const res = await apiClient.get("/api/admin/users-assets");
        const apiData = res.data;

        console.log("Fetched users and assets from backend:", apiData);

        if (Array.isArray(apiData)) {
          // Direct array response
          const mappedUsers = apiData.map((u: any) => ({
            ...u,
            portfolio: u.assets
              ? u.assets.map((a: any) => ({
                  symbol: a.symbol,
                  quantity:
                    typeof a.quantity === "string"
                      ? parseFloat(a.quantity)
                      : a.quantity,
                }))
              : [],
          }));
          setUsers(mappedUsers);
        } else if (apiData && Array.isArray(apiData.data)) {
          // Wrapped response { success: true, data: [...] }
          const mappedUsers = apiData.data.map((u: any) => ({
            ...u,
            portfolio: u.assets
              ? u.assets.map((a: any) => ({
                  symbol: a.symbol,
                  quantity:
                    typeof a.quantity === "string"
                      ? parseFloat(a.quantity)
                      : a.quantity,
                }))
              : [],
          }));
          setUsers(mappedUsers);
        } else {
          console.warn("Backend returned non-array structure:", apiData);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users/assets:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUser = (updatedUser: User) => {
    // Optimistic update for the whole user object (legacy/backup)
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const updateUserAsset = async (userId: number, asset: PortfolioItem) => {
    // 1. Optimistic Update
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user.id === userId) {
          const existingAssetIndex = user.portfolio.findIndex(
            (p) => p.symbol === asset.symbol
          );
          let newPortfolio = [...user.portfolio];

          if (existingAssetIndex >= 0) {
            if (asset.quantity <= 0) {
              // Remove if quantity is 0 or less (assuming removal logic)
              newPortfolio = newPortfolio.filter(
                (p) => p.symbol !== asset.symbol
              );
            } else {
              newPortfolio[existingAssetIndex] = asset;
            }
          } else if (asset.quantity > 0) {
            newPortfolio.push(asset);
          }

          return { ...user, portfolio: newPortfolio };
        }
        return user;
      });
    });

    // 2. API Call
    try {
      await apiClient.post("/api/admin/update-user-asset", {
        user_id: userId,
        symbol: asset.symbol,
        quantity: asset.quantity,
      });
    } catch (error) {
      console.error("Failed to update asset on backend:", error);
      // In a real app, we would revert the optimistic update here
    }
  };

  return (
    <AdminContext.Provider
      value={{ users, isLoading, updateUser, updateUserAsset }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};
