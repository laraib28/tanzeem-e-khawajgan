import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <main className="relative bg-[#F9F5E8] min-h-screen -mt-[59px] pt-[59px]">
      {/* Green Curved Background - Starting from very top (behind navbar) */}
      <div className="absolute top-0 right-0 w-[35%] h-[70%] bg-[#1F816F] rounded-bl-[150px] hidden lg:block z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-8 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* ========== LEFT SIDE - Text Content ========== */}
          <div className="pt-12 space-y-6">
            {/* Small Heading */}
            <p className="text-[#1F816F] font-semibold text-sm tracking-wide uppercase">
              Healing Hearts, Healing Lives
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Being Part Of<br />
              Aid Foundation<br />
              Is A Way To Share
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur. Ultrices ultrices pulvinar
              maecenas neque. Sit tellus nunc enim cursus dolor ultrices sit
              ullamcorper aliquam aliquet.
            </p>
          </div>

          {/* ========== RIGHT SIDE - Cards ========== */}
          <div className="relative pt-16 lg:pt-8">
            
            {/* Main Large Card */}
            <div className="relative z-20 bg-[#1F816F] rounded-[40px] p-6 shadow-2xl max-w-sm">
              {/* Large Image - Rounded */}
              <div className="relative mb-6">
                <div className="relative h-80 rounded-3xl overflow-hidden">
                  <Image
                    src="/hero.jpg"
                    alt="Happy children"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Price */}
              <p className="text-[#F59E0B] font-bold text-2xl mb-3">$29</p>

              {/* Heading */}
              <h3 className="text-white text-2xl font-bold mb-4 leading-tight">
                Share Food With Others<br />In Need
              </h3>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F59E0B] rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>

              {/* Donate Button */}
              <button className="w-full bg-[#F59E0B] hover:bg-[#E17153] text-white py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                Donate Now
              </button>
            </div>

            {/* Small Card - Top Right */}
            <div className="absolute top-28 -right-8 z-30 bg-[#1F816F] rounded-3xl p-6 shadow-2xl w-56 hidden xl:block">
              {/* Small Image */}
              <div className="relative mb-4">
                <div className="relative h-40 rounded-tl-3xl rounded-br-3xl overflow-hidden">
                  <Image
                    src="/hero2.jpg"
                    alt="Smiling child"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Price */}
              <p className="text-[#F59E0B] font-bold text-xl mb-2">$29</p>

              {/* Heading */}
              <h4 className="text-white text-sm font-bold mb-3 leading-tight">
                Share Food With Others<br />In Need
              </h4>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F59E0B] rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>

              {/* Small Button */}
              <button className="w-full bg-[#F59E0B] hover:bg-[#E17153] text-white py-2 rounded-full font-bold text-sm transition shadow-lg">
                Donate Now
              </button>
            </div>

            {/* Circular Badge - Bottom Right */}
            <div className="absolute -bottom-4 -right-4 z-30 hidden lg:block">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#1F816F]">
                <div className="text-center">
                  <svg className="w-8 h-8 text-[#1F816F] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <p className="text-[10px] text-gray-600 font-semibold mt-1">EXPLORE<br />MORE</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Green Curved Section with Stats */}
      <div className="relative mt-0 lg:-mt-24">
        <div className="bg-[#1F816F] rounded-tr-[200px] pt-24 pb-12 px-8">
          <div className="max-w-4xl ml-8 lg:ml-20">
            <div className="grid grid-cols-3 gap-8 text-white">
              {/* Stat 1 */}
              <div>
                <h3 className="text-4xl lg:text-5xl font-bold mb-2">145+</h3>
                <p className="text-white/70 text-sm">Active Volunteers</p>
              </div>

              {/* Stat 2 */}
              <div>
                <h3 className="text-4xl lg:text-5xl font-bold mb-2">1200+</h3>
                <p className="text-white/70 text-sm">People Helped</p>
              </div>

              {/* Stat 3 */}
              <div>
                <h3 className="text-4xl lg:text-5xl font-bold mb-2">545+</h3>
                <p className="text-white/70 text-sm">Donations Made</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}