"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

interface WalletConnectProps {
  isDarkMode: boolean;
}

export function WalletConnect({ isDarkMode }: WalletConnectProps) {
  const buttonColor = isDarkMode ? "#0fa594" : "#FCFF51";
  const textColor = "#000000";

  return (
    <div className="flex justify-center">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="px-4 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-medium cursor-pointer"
                      style={{
                        backgroundColor: buttonColor,
                        color: textColor,
                      }}
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-4 py-3 rounded-lg border-2 border-red-500 bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-medium cursor-pointer"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex gap-2">
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="px-4 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-medium cursor-pointer"
                      style={{
                        backgroundColor: buttonColor,
                        color: textColor,
                      }}
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
