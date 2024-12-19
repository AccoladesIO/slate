import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/017/033/097/original/simple-abstract-background-design-suitable-for-ppt-backgrounds-and-others-free-vector.jpg')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-purple-500 bg-opacity-30"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4 max-w-[800px] mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
          Your <span className="text-white p-3 px-6  inline-block bg-purple-500 cedarville-cursive-regular" style={{
            clipPath: "polygon(0 0, 90% 0, 100% 100%, 10% 100%)",
          }}>Virtual</span> Canvas for Seamless <span className="text-white p-3 px-6 inline-block bg-purple-500 cedarville-cursive-regular" style={{
            clipPath: "polygon(0 0, 90% 0, 100% 100%, 10% 100%)",
          }}>Collaboration</span>
        </h1>
        <p className="text-sm md:text-base mb-6 max-w-2xl">
          Sketch, share, and collaborate with your team in real time, no matter where you are. Experience the future of teamwork today.
        </p>
        <div className="space-x-4 space-y-4">
          <button className="px-6 text-sm py-3 bg-white text-purple-500 font-semibold rounded-md shadow-md hover:bg-purple-100 transition outline-none">
            Get Started for Free
          </button>
          <button className="px-6 py-3 text-sm bg-purple-700 text-white font-semibold rounded-md shadow-md hover:bg-purple-600 transition outline-none">
            Watch a Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
