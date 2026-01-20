import React from "react";
import Image from "next/image";

export default function GiveHelp() {
  // Donation card data
  const donationCards = [
    {
      id: 1,
      category: "Daily Needs",
      title: "Share Food With Others In Need",
      description: "In carrying out their duties, charitable foundations provide a variety of social services such as education, food, medicine, housing, and others.",
      image: "/help-card-1.jpg"
    },
    {
      id: 2,
      category: "Homeless",
      title: "Share Food With Others In Need",
      description: "In carrying out their duties, charitable foundations provide a variety of social services such as education, food, medicine, housing, and others.",
      image: "/help-card-2.jpg"
    },
    {
      id: 3,
      category: "Daily Needs",
      title: "Share Food With Others In Need",
      description: "In carrying out their duties, charitable foundations provide a variety of social services such as education, food, medicine, housing, and others.",
      image: "/help-card-3.jpg"
    },
    {
      id: 4,
      category: "Education",
      title: "Share Food With Others In Need",
      description: "In carrying out their duties, charitable foundations provide a variety of social services such as education, food, medicine, housing, and others.",
      image: "/help-card-4.jpg"
    },
    {
      id: 5,
      category: "Homeless",
      title: "Share Food With Others In Need",
      description: "In carrying out their duties, charitable foundations provide a variety of social services such as education, food, medicine, housing, and others.",
      image: "/help-card-5.jpg"
    },
    {
      id: 6,
      category: "Daily Needs",
      title: "Share Food With Others In Need",
      description: "In carrying out their duties, charitable foundations provide a variety of social services such as education, food, medicine, housing, and others.",
      image: "/help-card-6.jpg"
    }
  ];

  return (
    <section className="bg-[#F9F5E8] py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          {/* Left - Heading */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Let's Give Help To<br />Those In Need
            </h2>
          </div>

          {/* Right - Description */}
          <div className="max-w-md">
            <p className="text-gray-600 text-sm leading-relaxed">
              Charitable foundations provide a variety of social services such as education, food, medicine, housing, and others.
            </p>
            <a href="#" className="text-[#E17153] font-semibold text-sm mt-2 inline-block hover:underline">
              Show More →
            </a>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donationCards.map((card) => (
            <div 
              key={card.id} 
              className="bg-white rounded-3xl overflow-hidden border-2 border-black shadow-lg hover:shadow-xl transition"
            >
              {/* Image Section */}
              <div className="relative h-56">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                {/* Green Badge */}
                <div className="absolute top-4 right-4 bg-[#1F816F] text-white px-4 py-1 rounded-full text-xs font-semibold">
                  {card.category}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Category Tag */}
                <p className="text-[#E17153] text-xs font-semibold mb-2 uppercase tracking-wide">
                  {card.category}
                </p>

                {/* Title */}
                <h3 className="text-gray-900 text-xl font-bold mb-3 leading-tight">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Donate Button */}
                <button className="w-full bg-[#E17153] hover:bg-[#d16043] text-white py-3 rounded-full font-semibold transition transform hover:scale-105">
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}