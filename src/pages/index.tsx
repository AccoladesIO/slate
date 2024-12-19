import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/ui/Hero";
import NavBar from "@/components/ui/NavBar";
import { useContextValue } from "@/utils/hooks/Context";
import React from "react";

export default function Home() {
  const { someValue } = useContextValue()
  return (
    <div className="w-full">
      <NavBar />
      <HeroSection />
      <Footer />
    </div>
  );
}
