"use client";

import { useState } from "react";
import Splash from "./components/Splash";
import Navbar from "./components/Navbar";

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Splash onDone={() => setHeroReady(true)} />
      {heroReady && <Navbar />}
      {children}
    </>
  );
}