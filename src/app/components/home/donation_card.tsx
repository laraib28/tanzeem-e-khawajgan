import React from "react";
import Image from "next/image";

export default function DonationCard() {
  return (
    <section className="bg-[#F9F5E8] py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Top Text - Trusted by volunteers */}
        <div className="text-center mb-12">
          <p className="text-gray-700 text-sm font-medium">
            Trusted by more than 5 million volunteers in 120 countries
          </p>
        </div>

        {/* Logos Row */}
        <div className="flex justify-center items-center gap-12 mb-16 flex-wrap">
          <div className="text-[#E17153] font-bold text-xl">🗣 TEAMTALK</div>
          <div className="text-[#E17153] font-bold text-xl">✕ ExDone</div>
          <div className="text-[#E17153] font-bold text-xl">🚀 NEXTFLOWS</div>
          <div className="text-[#E17153] font-bold text-xl">◉ GlobalAid</div>
          <div className="text-[#E17153] font-bold text-xl">📊 MarketSavy</div>
          <div className="text-[#E17153] font-bold text-xl">⊕ EpicDev</div>
        </div>

        {/* Main Donation Card */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-black">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Left Side - Content */}
            <div className="p-12 lg:p-16">
              {/* Price Tag */}
              <div className="mb-6">
                <h2 className="text-[#E17153] text-5xl font-bold">
                  $20<span className="text-2xl font-normal">/MON</span>
                </h2>
                <p className="text-gray-500 text-sm mt-2">Or Make One Time Donation</p>
              </div>

              {/* Heading */}
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Share Food With Others Who Is In Need
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                In carrying out their duties, charitable foundations provide a variety of social services 
                such as education, food, medicine, housing, and others.
              </p>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Raised: $69,152</span>
                  <span className="font-semibold">Goal: $89,000</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#E17153] rounded-full transition-all duration-500" 
                    style={{width: '78%'}}
                  ></div>
                </div>
              </div>

              {/* Donate Button */}
              <button className="w-full bg-[#E17153] hover:bg-[#d16043] text-white py-4 px-8 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                Donate Now
              </button>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] lg:h-auto">
              <Image
                src="/donation-card.jpg"
                alt="Happy children together"
                fill
                className="object-cover"
              />

              {/* Circular Badge - Bottom Right */}
              <div className="absolute bottom-6 right-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#1F816F]">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-[#1F816F] mx-auto .rotate-[-45deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="text-[8px] text-gray-600 font-bold mt-1 leading-tight">
                      EXPLORE<br />MORE
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}