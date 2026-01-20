import React from "react";

export default function HowToStartHelp() {
  return (
    <section className="bg-[#F9F5E8] py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Orange Card Container */}
        <div className="bg-[#E17153] rounded-[50px] px-12 py-16">
          
          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="text-white text-4xl lg:text-5xl font-bold mb-4">
              How To Start Help
            </h2>
            <p className="text-white/90 text-sm lg:text-base max-w-3xl mx-auto">
              In carrying out their duties, charitable foundations provide a variety of social services such as 
              education, food, medicine, housing, and others.
            </p>
          </div>

          {/* Three Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-16">
            
            {/* Step 1: Register Yourself */}
            <div className="text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">
                Register Yourself
              </h3>
              
              {/* Description */}
              <p className="text-white/80 text-sm">
                Sign up to join and be part of the good people who love to share
              </p>
            </div>

            {/* Step 2: Select Donate */}
            <div className="text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">
                Select Donate
              </h3>
              
              {/* Description */}
              <p className="text-white/80 text-sm">
                There are many things you can choose to share goodness with
              </p>
            </div>

            {/* Step 3: Share Happiness */}
            <div className="text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">
                Share Happiness
              </h3>
              
              {/* Description */}
              <p className="text-white/80 text-sm">
                Sharing happiness with those still send doing more good for others
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}