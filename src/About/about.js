import React from 'react';
import img1 from "../assets/electronic-engineering-1-1024x682.jpg";

const AboutUs = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Company Info Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg mb-4">
            We are a leading eCommerce platform dedicated to bringing you the best products at unbeatable prices. 
            Our journey began with a simple idea: to create an online shopping experience that is both enjoyable and convenient.
          </p>
          <p className="text-lg">
            Our mission is to provide high-quality products and exceptional customer service. We believe in the power 
            of innovation and are committed to continuously improving our services to meet and exceed our customers' expectations.
          </p>
        </div>
        
        {/* Team Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Meet Our Team</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img 
                src={img1} 
                alt="Team Member" 
                className="w-24 h-24 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">Raghavendra Reddy Munagala</h3>
                <p className="text-gray-600">CEO & Founder</p>
                <p className="mt-2">
                  Raghavendra Reddy is passionate about delivering outstanding shopping experiences and leads our team with vision and dedication.
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <img 
                src={img1}
                alt="Team Member" 
                className="w-24 h-24 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold">Raghava Reddy</h3>
                <p className="text-gray-600">Head of Marketing</p>
                <p className="mt-2">
                  Raghava brings creativity and expertise to our marketing efforts, ensuring that our brand stands out in the crowded eCommerce landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
