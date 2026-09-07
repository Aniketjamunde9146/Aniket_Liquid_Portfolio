"use client";

import { useState } from "react";
import Splash from "./components/Splash";
import Navbar from "./components/Navbar";

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [heroReady, setHeroReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <Splash
          onDone={() => {
            setHeroReady(true);
            setShowSplash(false);
          }}
        />
      )}
      {heroReady && <Navbar />}
      {children}
    </>
  );
}