"use client"

import type React from "react"
import { useRouter } from "next/navigation"

const HeroSection: React.FC = () => {
  const router = useRouter()

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-20">
      <div className="faded-bg-overlay" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/5 rounded-full blur-3xl -z-10" />

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="button-pill">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground/70">Introducing Seamless Collaboration</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Your{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-30" />
              <span className="text-gradient">
                Virtual Canvas
              </span>
            </span>{" "}
            for Seamless{" "}
            <span className="relative inline-block">
              <span className="blurred-gradient-overlay" />
              <span className="text-gradient">
                Collaboration
              </span>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Sketch, share, and collaborate with your team in real time, no matter where you are. Experience the future
            of teamwork today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in-right">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full text-base transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Get Started for Free
            </button>
            <button className="px-8 py-3.5 bg-secondary/50 text-foreground font-semibold rounded-full text-base border border-border/50 transition-all duration-300 hover:bg-secondary hover:border-border hover:shadow-lg active:scale-95 backdrop-blur-sm">
              Watch a Demo
            </button>
          </div>

          <div className="py-12 border-t border-border/30">
            <p className="text-sm text-foreground/50 mb-6">Trusted by Engineers and Students Across</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              {["SEES", "ULES", "GDSC UNILAG", "ECX UNILAG"].map((brand) => (
                <div
                  key={brand}
                  className="text-sm font-medium text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
