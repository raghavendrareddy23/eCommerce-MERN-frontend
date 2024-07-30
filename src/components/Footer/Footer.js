import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-blue-900 text-gray-300 py-12" id='contact'>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">About Us</h2>
                        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-sm hover:text-white">Home</Link></li>
                            <li><Link to="/shop" className="text-sm hover:text-white">Shop</Link></li>
                            <li><Link to="/about-us" className="text-sm hover:text-white">About Us</Link></li>
                            <li><Link to="/contact" className="text-sm hover:text-white">Contact</Link></li>
                            <li><Link to="/orders" className="text-sm hover:text-white">Orders</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                        <p className="text-sm">123 Street Name, City, Country</p>
                        <p className="text-sm">email@example.com</p>
                    </div>
                </div>
                <div className="border-t border-gray-600 mt-8 pt-8 text-sm text-center">
                    &copy; 2024 Your E-commerce. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
