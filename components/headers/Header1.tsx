import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/Group 220.png";
import { notifications } from "@/data/notifications";
import { useRouter } from "next/navigation";

type HeaderProps = {
  coins: any[];
};

export default function Header1({ coins }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedValue) {
      setResults([]);
      return;
    }
    const filtered = coins.filter((coin) =>
      Object.keys(coin.unique_id)[0]
        .toLowerCase()
        .includes(debouncedValue.toLowerCase())
    );
    setResults(filtered);
  }, [debouncedValue]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    setResults([]);
  }, []);

  return (
    <>
      <div className="header-style2 fixed-top bg-menuDark">
        <div className="d-flex justify-content-between align-items-center gap-14">
          <div className="box-account style-2">
            <Link href={`/user-info`}>
              <Image
                alt="img"
                className="avt"
                src={logo}
                width={120}
                height={120}
              />
            </Link>
            <div
              className="search-box box-input-field style-2"
              style={{ position: "relative" }}
            >
              <a href={`/home-search`} className="icon-search" />
              <input
                type="text"
                placeholder="Looking for crypto"
                required
                className="clear-ip"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <i
                  className="icon-close"
                  style={{ cursor: "pointer" }}
                  onClick={handleClear}
                />
              )}
              {searchTerm &&
                (results.length > 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      backgroundColor: "#393737",
                      color: "#fff",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      marginTop: "4px",
                      zIndex: 1000,
                    }}
                  >
                    {results.map((item, idx) => {
                      const coinId = Object.keys(item?.unique_id)[0];
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            fontSize: "14px",
                            borderBottom:
                              idx !== results.length - 1
                                ? "1px solid #333"
                                : "none",
                          }}
                          onClick={() => {
                            console;
                            setSearchTerm(item);
                            setResults([]);
                            router.push(`/coin/${item?.name}`);
                          }}
                        >
                          {coinId}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      backgroundColor: "#393737",
                      color: "#fff",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      marginTop: "4px",
                      zIndex: 1000,
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    No Result Found
                  </div>
                ))}
            </div>
          </div>
          <div className="d-flex align-items-center gap-8">
            {/* <Link href={`/list-blog`} className="icon-gift" /> */}
            <a
              href="#notification"
              className="icon-noti box-noti"
              data-bs-toggle="modal"
            />
          </div>
        </div>
      </div>{" "}
      <div className="modal fade modalRight" id="notification">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
              <span className="left" data-bs-dismiss="modal" aria-hidden="true">
                <i className="icon-left-btn" />
              </span>
              <h3>Notification</h3>
            </div>
            <div className="overflow-auto pt-45 pb-16">
              <div className="tf-container">
                <ul className="mt-12">
                  {notifications.map((notification, index) => (
                    <li className={notification.additionalClasses} key={index}>
                      <a href="#" className="noti-item bg-menuDark">
                        <div
                          className={`pb-8 ${
                            notification.link ? "line-bt" : ""
                          }`}
                        >
                          <p
                            className={`text-button fw-6 ${
                              notification.isSecondary ? "text-secondary" : ""
                            }`}
                          >
                            {notification.content}
                          </p>
                        </div>
                        {notification.link && (
                          <Link
                            className="d-block mt-8"
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                            }}
                            href={notification.link}
                          >
                            Click to Check
                          </Link>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
