"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GoBackButton from "./BackButton";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import apiClient from "@/lib/axios-config";
import { AiOutlineCloseCircle } from "react-icons/ai";

type CardColor = "black" | "silver" | "gold";

const cardStyles: Record<
  CardColor,
  {
    background: string;
    circleTopRight: string;
    circleBottomLeft: string;
    depositAddress: string;
    xlmAmount: string;
  }
> = {
  black: {
    background:
      "linear-gradient(135deg, #2b2b2b 0%, #121212 45%, #3a3a3a 100%)",
    circleTopRight: "rgba(255,255,255,0.03)",
    circleBottomLeft: "rgba(255,255,255,0.03)",
    depositAddress: "GACMPQFBN6ZRTH4LZZVWB4XEFJEXYAP6U",
    xlmAmount: "$20,000",
  },
  silver: {
    background:
      "linear-gradient(135deg, #d5d5dbff 0%, #bcbcbcff 40%, #6f6f70ff 100%)",
    circleTopRight: "rgba(186, 180, 180, 0.7)",
    circleBottomLeft: "rgba(0,0,0,0.06)",
    depositAddress: "K8ZJ4WQPL2MHX7FAN9YVC3DRTSGEB5UO",
    xlmAmount: "$50,000",
  },
  gold: {
    background:
      "linear-gradient(135deg, #f6d365 0%, #e8b93a 40%, #b88416 100%)",
    circleTopRight: "rgba(255,255,255,0.12)",
    circleBottomLeft: "rgba(0,0,0,0.06)",
    depositAddress: "R7VQX2LZWFN6PGJ8K3DUB4YAHM5TESC9",
    xlmAmount: "$100,000",
  },
};

export default function UserInfo() {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [formData, setFormData] = useState({
    depositAddress: "GACMPQFBN6ZRTH4LZZVWB4XEFJEXYAP6U",
    xlmAmount: "$20,000",
    name: "",
    email: "",
    phone: "",
    transactionId: "",
    transactionImg: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [selectedColor, setSelectedColor] = useState<CardColor>("black");
  const current = cardStyles[selectedColor];

  const [errors, setErrors] = useState({
    phone: "",
    transactionId: "",
    transactionImg: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get("/api/auth/get_users");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.user?.name || "",
        email: user?.user?.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const mapping = cardStyles[selectedColor];
    setFormData((prev) => ({
      ...prev,
      depositAddress: mapping.depositAddress,
      xlmAmount: mapping.xlmAmount,
    }));
  }, [selectedColor]);

  const handleColorChange = (color: CardColor) => {
    setSelectedColor(color);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file") {
      const file = files && files[0] ? files[0] : null;
      if (!file) {
        setFormData((prev) => ({ ...prev, transactionImg: null }));
        setErrors((prev) => ({ ...prev, transactionImg: "" }));
        return;
      }
      const maxSize = 8 * 1024 * 1024; // 8MB
      if (!file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, transactionImg: null }));
        setErrors((prev) => ({
          ...prev,
          transactionImg: "Only image files allowed",
        }));
        return;
      }
      if (file.size > maxSize) {
        setFormData((prev) => ({ ...prev, transactionImg: null }));
        setErrors((prev) => ({
          ...prev,
          transactionImg: "File too large (max 8MB)",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, transactionImg: file }));
      setErrors((prev) => ({ ...prev, transactionImg: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!formData.transactionId?.trim())
      newErrors.transactionId = "Transaction ID is required";
    if (!formData.transactionImg)
      newErrors.transactionImg = "Please upload a transaction screenshot";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const file = formData.transactionImg;
    if (file) {
      const maxSize = 8 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((p: any) => ({
          ...p,
          transactionImg: "File too large (max 8MB)",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((p: any) => ({
          ...p,
          transactionImg: "Only image files allowed",
        }));
        return;
      }
    }
    try {
      const fd = new FormData();
      fd.append("depositAddress", formData.depositAddress);
      fd.append("xlmAmount", formData.xlmAmount);
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("transactionId", formData.transactionId);

      if (file) fd.append("image", file, file.name);

      const response = await apiClient.post(
        "/api/auth/add_transaction_card",
        fd,
        {
          headers: { "Content-Type": undefined as any },
        }
      );

      if (response?.data?.status_code) {
        toast.success("Transaction submitted successfully!");
        setFormData({
          depositAddress: current.depositAddress,
          xlmAmount: current.xlmAmount,
          name: user?.user?.name || "",
          email: user?.user?.email || "",
          phone: "",
          transactionId: "",
          transactionImg: null,
        });
        setAgree(false);
      } else {
        toast.error(response?.data?.message || "Something went wrong!");
      }
    } catch (error: any) {
      console.error("Error submitting transaction:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit transaction");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/log-in");
  };

  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <a href="#" className="left back-btn">
          <GoBackButton />
        </a>
        <Link href={`/qr-code`} className="right text-secondary">
          <i className="icon-barcode" />
        </Link>
      </div>
      <div className="pt-45 pb-16">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4 d-flex justify-content-between align-items-center">
            <Link className="box-account" href={`/profile`}>
              <Image
                alt="img"
                className="avt"
                src="/images/avt/avt2.jpg"
                width={120}
                height={120}
              />
              <div className="info">
                <h5>{user?.user?.name}</h5>
                <p className="text-small text-secondary mt-8 mb-8">
                  Profile and settings
                </p>
                <span className="tag-xs style-2 round-2 red">Unverified</span>
              </div>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <button
                className="text-danger"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  padding: 0,
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
              <Link className="arr-right" href={`/profile`}>
                <i className="icon-arr-right" />
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Card</h5>
            <div
              className="mt-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "350px",
                    height: "220px",
                    borderRadius: "12px",
                    background: current.background,
                    color: selectedColor === "silver" ? "#111" : "#fff",
                    padding: "20px",
                    position: "relative",
                    fontFamily: "Arial, sans-serif",
                    overflow: "hidden",
                    boxShadow:
                      selectedColor === "silver"
                        ? "0 6px 18px rgba(0,0,0,0.08)"
                        : "0 6px 18px rgba(0,0,0,0.45)",
                    border:
                      selectedColor === "silver"
                        ? "1px solid rgba(0,0,0,0.06)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-80px",
                      right: "-80px",
                      width: "160px",
                      height: "160px",
                      background: current.circleTopRight,
                      borderRadius: "50%",
                      mixBlendMode:
                        selectedColor === "silver" ? "overlay" : "normal",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "-60px",
                      left: "-60px",
                      width: "120px",
                      height: "120px",
                      background: current.circleBottomLeft,
                      borderRadius: "50%",
                      mixBlendMode:
                        selectedColor === "silver" ? "overlay" : "normal",
                    }}
                  ></div>

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ fontSize: "15px", lineHeight: "16px" }}>
                      <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                        BackedByQuantum
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: selectedColor === "silver" ? "#111" : "#fff",
                        }}
                      >
                        Web3-QUANTUM FINANCIAL SYSTEM
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold" }}>QFS Card</div>
                  </div>

                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      marginTop: "36px",
                      color: selectedColor === "silver" ? "#111" : "#fff",
                      textShadow:
                        selectedColor === "silver"
                          ? "none"
                          : "0 1px 0 rgba(0,0,0,0.3)",
                    }}
                  >
                    XXXX- XXXX- XXXX- XXXX
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "28px",
                      color: selectedColor === "silver" ? "#333" : "#ddd",
                    }}
                  >
                    <div style={{ fontSize: "14px" }}>{user?.user?.name}</div>
                    <div style={{ fontSize: "14px" }}>
                      Exp: <span style={{ fontWeight: "bold" }}>12/26</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 16,
                  alignItems: "center",
                }}
              >
                {(["black", "silver", "gold"] as CardColor[]).map((c) => {
                  const isSelected = selectedColor === c;
                  const previewBg = cardStyles[c].background;
                  const label =
                    c === "gold" ? "Gold" : c === "silver" ? "Silver" : "Black";
                  return (
                    <label
                      key={c}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="cardColor"
                        value={c}
                        checked={isSelected}
                        onChange={() => handleColorChange(c)}
                        style={{ display: "none" }}
                        aria-label={`${label} card`}
                      />
                      <div
                        onClick={() => handleColorChange(c)}
                        style={{
                          width: 66,
                          height: 40,
                          borderRadius: 8,
                          background: previewBg,
                          border: isSelected
                            ? "3px solid rgba(255,255,255,0.95)"
                            : "2px solid rgba(255,255,255,0.12)",
                          boxShadow: isSelected
                            ? "0 6px 18px rgba(255,255,255,0.12)"
                            : "0 4px 12px rgba(0,0,0,0.2)",
                          transition: "all 150ms ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <div
                        style={{ marginTop: 6, fontSize: 12, color: "#cfcfcf" }}
                      >
                        {label}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  justifyContent: "center",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <label style={{ marginBottom: "10px" }}>
                    Deposit Address
                  </label>
                  <input
                    type="text"
                    value={formData.depositAddress}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <label style={{ marginBottom: "10px" }}>XLM amount</label>
                  <input
                    type="text"
                    value={formData.xlmAmount}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      color: "green",
                      fontWeight: "bold",
                    }}
                  />
                  <h5 style={{ marginTop: "20px", marginBottom: "20px" }}>
                    Shipping Details
                  </h5>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    // readOnly
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    // readOnly
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                    {errors.phone && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "10px",
                        }}
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="text"
                      name="transactionId"
                      placeholder="Transaction ID"
                      value={formData.transactionId}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                    {errors.transactionId && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "10px",
                        }}
                      >
                        {errors.transactionId}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      color: "white",
                      fontSize: "12px",
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "10px",
                    }}
                  >
                    <label className="pb-2">
                      Attach screenshot of transaction
                    </label>
                    <input
                      type="file"
                      name="transactionImg"
                      onChange={handleChange}
                      style={{ marginBottom: "10px" }}
                    />
                    {errors.transactionImg && (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        {errors.transactionImg}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="checkbox"
                      name="agree"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />{" "}
                    I accept QFS Shipping terms and conditions
                  </div>

                  <button
                    type="submit"
                    disabled={!agree}
                    style={{
                      background: agree
                        ? "linear-gradient(to right, #005bbb, #003f7f)"
                        : "#696969ff",
                      color: "#bcb5b5ff",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      width: "100%",
                      marginTop: "20px",
                    }}
                  >
                    Pre-Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>Buy cryptocurrencies</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <a
                  href="#cryptocurrency"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                  data-bs-toggle="modal"
                >
                  <i className="icon icon-currency" />
                  Currency
                </a>
              </li>
              <li>
                <Link
                  href={`/exchange-market`}
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-swap" />
                  Exchange
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="bg-menuDark tf-container"
          style={{ marginBottom: "72px" }}
        >
          <div className="pt-12 pb-12 mt-4">
            <h5>Exchange</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <a
                  href="/swap"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-convert" />
                  Convert
                </a>
              </li>
              <li>
                <a
                  href="/minings/index"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-metalogo" />
                  Consign
                </a>
              </li>
              <li>
                <a
                  href="/deposit"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-bank" />
                  Deposit
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-fileText" />
                  Futures contract
                </a>
              </li> */}
              {/* <li>
                <a
                  href="#"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-graph" />
                  Ageless
                </a>
              </li> */}
              {/* <li>
                <a
                  href="#"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-grid-nine" />
                  Choice
                </a>
              </li> */}
              <li>
                <a
                  href="/investments/index"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-game-control" />
                  Simulated trading
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    const bootstrap = await import("bootstrap");
                    const botModalEl = document.getElementById("modalBot");
                    if (!botModalEl) return;
                    const myBotModal = new bootstrap.Modal(botModalEl);
                    myBotModal.show();
                  }}
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-robot" />
                  Bot
                </a>
              </li>
              <li>
                <a
                  href="/deposit/confirm"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center text-break text-center"
                >
                  <i className="icon icon-database" />
                  Copy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="modal fade modalCenter"
          id="modalBot"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content rounded-lg shadow-lg border-0 text-center"
              style={{ padding: "24px" }}
            >
              <AiOutlineCloseCircle
                className="mx-auto text-red-500"
                size={80}
              />
              <h4>Action Disabled</h4>
              <p className="mt-8 text-large">
                This Action is disabled Coming Soon.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  marginTop: "20px",
                  width: "auto",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  style={{ width: "auto" }}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bg-menuDark tf-container" style={{ marginBottom: "64px" }}>
          <div className="pt-12 pb-12 mt-4">
            <h5>Help center</h5>
            <ul className="mt-16 grid-3 gap-12">
              <li>
                <a
                  href="#"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center"
                >
                  <i className="icon icon-globe" />
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center"
                >
                  <i className="icon icon-headset" />
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div> */}
        {/* <div className="bg-menuDark tf-container">
          <a
            href="#"
            className="pt-12 pb-12 mt-4 d-flex justify-content-between align-items-center"
          >
            <h5>About Backedby Quantum</h5>
            <span className="arr-right">
              <i className="icon-arr-right" />
            </span>
          </a>
        </div> */}
      </div>
      {/*cryptocurrency */}
      <div className="modal fade modalRight" id="cryptocurrency">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
              <span className="left" data-bs-dismiss="modal" aria-hidden="true">
                <i className="icon-left-btn" />
              </span>
              <h3>Choose cryptocurrency</h3>
            </div>
            <div className="overflow-auto pt-45 pb-16">
              <div className="tf-container">
                <div className="mt-8 search-box box-input-field">
                  <i className="icon-search" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrency"
                    required
                    className="clear-ip"
                  />
                  <i className="icon-close" />
                </div>
                <h5 className="mt-12">Popular search</h5>
                <ul className="mt-16">
                  <li>
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-3.jpg"
                        width={75}
                        height={75}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">Ethereum</p>
                          <span className="text-secondary text-small">ETH</span>
                        </div>
                        <span className="text-small">$30.776,93</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-1.jpg"
                        width={80}
                        height={80}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">Bitcoin</p>
                          <span className="text-secondary text-small">BTC</span>
                        </div>
                        <span className="text-small">$1.936,79</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-14.jpg"
                        width={64}
                        height={65}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">TetherUS</p>
                          <span className="text-secondary text-small">
                            USDT
                          </span>
                        </div>
                        <span className="text-small">$0,999999</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-7.jpg"
                        width={59}
                        height={60}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">BNB</p>
                          <span className="text-secondary text-small">BNB</span>
                        </div>
                        <span className="text-small">$243,41</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-9.jpg"
                        width={64}
                        height={65}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">Ripple</p>
                          <span className="text-secondary text-small">XRP</span>
                        </div>
                        <span className="text-small">$0,487814</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-4.jpg"
                        width={80}
                        height={80}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">Cardano</p>
                          <span className="text-secondary text-small">ADA</span>
                        </div>
                        <span className="text-small">$0,294842</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-11.jpg"
                        width={64}
                        height={64}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">BUSD</p>
                          <span className="text-secondary text-small">
                            BUSD
                          </span>
                        </div>
                        <span className="text-small">$0,999899</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-8.jpg"
                        width={64}
                        height={65}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">trueUSD</p>
                          <span className="text-secondary text-small">
                            TUSD
                          </span>
                        </div>
                        <span className="text-small">$0,999999</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-5.jpg"
                        width={60}
                        height={60}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">Coin98</p>
                          <span className="text-secondary text-small">C98</span>
                        </div>
                        <span className="text-small">$0,169888</span>
                      </div>
                    </a>
                  </li>
                  <li className="mt-16">
                    <a href="#" className="coin-item style-2 gap-12">
                      <Image
                        alt="img"
                        className="img"
                        src="/images/coin/coin-6.jpg"
                        width={64}
                        height={65}
                      />
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">Kurama</p>
                          <span className="text-secondary text-small">KRM</span>
                        </div>
                        <span className="text-small">$21.89,39</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
