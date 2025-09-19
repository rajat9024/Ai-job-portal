import React from "react";
import "../styles/Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-container">
        <div className="footer-about">
          <h2>Job-Care</h2>
          <p>
            Your trusted platform to find your dream job or hire the best talent.  
            We connect job seekers and employers seamlessly.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/joblist">Find Jobs</a></li>
            <li><a href="/employerprofile">Post a Job</a></li>
           
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Job-Care. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
