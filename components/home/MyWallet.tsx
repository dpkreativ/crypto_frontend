"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AiOutlineCloseCircle, AiOutlineSwap } from "react-icons/ai";
import { MdBackup } from "react-icons/md";
import { BiCandles } from "react-icons/bi";
import { SiBitcoin } from "react-icons/si";
import apiClient from "@/lib/axios-config";
import { FaRobot } from "react-icons/fa";

const accountOptions: string[] = ["Account 1", "Account 2"];
export default function MyWallet() {
  const [accountOption, setAccountOption] = useState<string>(accountOptions[0]);
  // Use the correct type for modalElement
  const modalElement = useRef<HTMLDivElement | null>(null);
  const [coins, setCoins] = useState<any>();
  const [privacyChecked, setPrivacyChecked] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await apiClient.get("/api/wallet/get_coin_price");
        if (res.data.status_code) {
          setCoins(res.data);
        }
      } catch (err) {
        console.error("Error in API call:", err);
        // alert(err.response?.data?.msg || "Something went wrong");
      }
    };
    fetchWallets();
  }, []);

  useEffect(() => {
    const body = document.body;

    const showModal = async () => {
      body?.classList.add("notiPrivacyDone");
      const bootstrap = await import("bootstrap");
      const modalEl = document.getElementById("modalNoti");
      if (!modalEl) return;

      const myModal = new bootstrap.Modal(modalEl, { keyboard: false });

      // Delay before showing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      myModal.show();

      modalElement.current?.addEventListener("hidden.bs.modal", () => {
        myModal.hide();
      });

      // When user clicks Allow, store in sessionStorage
      // document.getElementById("btnAllow")?.addEventListener("click", () => {
      //   sessionStorage.setItem("allowNotifications", "true");
      // });
      // document.getElementById("btnAllow")?.addEventListener("click", () => {
      //   if (privacyChecked) {
      //     localStorage.setItem("allowNotifications", "true");
      //   }
      // });
    };

    // Only show modal if not previously allowed
    // if (!sessionStorage.getItem("allowNotifications")) {
    //   showModal();
    // }
    // if (!localStorage.getItem("allowNotifications")) {
    //   showModal();
    // }
    const choice = localStorage.getItem("allowNotifications");
    if (!choice) {
      showModal();
    }
  }, []);

  const handleAllow = () => {
    if (!privacyChecked) return;
    localStorage.setItem("allowNotifications", "allow");
  };

  const handleDontAllow = () => {
    localStorage.setItem("allowNotifications", "deny");
  };

  return (
    <>
      <div className="bg-menuDark tf-container">
        <div className="pt-12 pb-12 mt-4">
          <h5>
            <span className="text-primary">My Wallet</span>
          </h5>
          <h1 className="mt-16">
            <a href="#">${(coins ? coins?.total_value : 0)?.toFixed(2)}</a>
          </h1>
          <ul className="mt-16 grid-4 m--16">
            <li>
              <Link
                href={`/buy`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <i className="icon icon-wallet" />
                </span>
                Buy
              </Link>
            </li>
            <li>
              <Link
                href={`/deposit`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <i className="icon icon-way2" />
                </span>
                Receive
              </Link>
            </li>
            <li>
              <Link
                href={`/exchange-market`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <i className="icon icon-way" />
                </span>
                Send
              </Link>
            </li>
            <li>
              <Link
                href={`/swap`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <AiOutlineSwap
                    style={{ width: "32px", height: "32px" }}
                    className="text-white"
                  />
                </span>
                Swap
              </Link>
            </li>
            {/* <li>
              <Link
                href={`/linkwallet`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <MdBackup style={{ width: '32px', height: '32px' }} className="text-white" />
                </span>
                Backup
              </Link>
            </li> */}
          </ul>
          <ul className="mt-16 grid-4 m--16">
            {/* <li>
              <Link
                href='#'
                onClick={async (e) => {
                  e.preventDefault();
                  const bootstrap = await import("bootstrap");
                  const botModalEl = document.getElementById("modalBot");
                  if (!botModalEl) return;
                  const myBotModal = new bootstrap.Modal(botModalEl);
                  myBotModal.show();
                }}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <FaRobot style={{ width: '32px', height: '32px' }} className="text-white" />
                </span>
                Bot
              </Link>
            </li> */}
            <li>
              <Link
                href={`/linkwallet`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <MdBackup
                    style={{ width: "32px", height: "32px" }}
                    className="text-white"
                  />
                </span>
                Backup
              </Link>
            </li>
            <li>
              <Link
                href={`/assets/index`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <SiBitcoin
                    style={{ width: "32px", height: "32px" }}
                    className="text-white"
                  />
                </span>
                Stock
              </Link>
            </li>
            <li>
              <Link
                href={`/minings/index`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <i className="icon icon-exchange" />
                </span>
                Mining
              </Link>
            </li>
            <li>
              <Link
                href={`/investments/index`}
                className="tf-list-item d-flex flex-column gap-8 align-items-center"
              >
                <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                  <BiCandles
                    style={{ width: "32px", height: "32px" }}
                    className="text-white"
                  />
                </span>
                Stacking
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <>
        {/* noti popup */}
        <div
          className="modal fade modalCenter"
          id="modalNoti"
          ref={modalElement}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-sm">
              <div className="p-16 line-bt text-center">
                <h4>“Backedby Quantum” Would Like To Send You Notifications</h4>
                <p className="mt-8 text-large">
                  Notifications may include alerts, sounds, and icon badges.
                  These can be configured in Settings.
                </p>
              </div>
              <div className="grid-2">
                <a
                  href="#"
                  className="line-r text-center text-button fw-6 p-10 text-secondary btn-hide-modal"
                  data-bs-dismiss="modal"
                  onClick={handleDontAllow}
                >
                  Don’t Allow
                </a>
                <a
                  href="#"
                  id="btnAllow"
                  className={`text-center text-button fw-6 p-10 text-primary btn-hide-modal ${
                    !privacyChecked ? "disabled" : ""
                  }`}
                  data-bs-toggle="modal"
                  data-bs-target="#notiPrivacy"
                  onClick={handleAllow}
                >
                  Allow
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* noti popup 2*/}
        <div className="modal fade modalCenter" id="notiPrivacy">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-20">
              <div className="heading">
                <h3>Privacy</h3>
                {/* ... privacy text ... */}
                <div className="cb-noti mt-12">
                  <input
                    type="checkbox"
                    className="tf-checkbox"
                    id="cb-ip"
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                  />
                  <label htmlFor="cb-ip">
                    I agree to the Term of service and Privacy policy
                  </label>
                </div>
              </div>
              <div className="mt-20">
                <button
                  className="tf-btn md primary"
                  data-bs-dismiss="modal"
                  disabled={!privacyChecked}
                  onClick={() => {
                    if (privacyChecked)
                      localStorage.setItem("allowNotifications", "true");
                  }}
                >
                  I Accept
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bot popup */}
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
      </>
    </>
  );
}
