import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from "react-icons/fa";
import './footer.css'
import { Link } from 'react-router-dom'
import assets from '../../assets/assets'
const footer = () => {
  return (
   <footer className='footer'>
    <div className="footer__container">
      <div className="footer-right">
        <div className="upper">
          <div className="footer-logo">
            <img src={assets.logo} className='main1' alt="" />
          </div>
          <div className="line-foot"></div>
          <div className="footer-heading">
           Scribble Club
          </div>
        </div>
        <div className="footer-down">
          <div className="social-head">
            Social Media
          </div>
         <div className="social-icons">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/poorneshcantdraw?igsh=dWJjYmFhMjB0OGE0" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://x.com/Poorneshcandraw?t=CUUkLaQdJSmbhDEXJQZu3w&s=09" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaPinterestP />
          </a>
         </div>
        </div>
      </div>
      <div className="footer-left">
        <div className="foot-front">
          <h1 className='service'>Customer Service</h1>
          <Link to='/support'>Support</Link>
          <Link to='/privacy-policy' >Privacy Policy</Link>
          <Link to='tos' >Terms of Service</Link>
          <Link to='/faq' >FAQ</Link>
        </div>
        <div className="foot-rear">
          <h1 className='service'>Contact Us</h1>
          <p><FaMapMarkerAlt /> 123 Art Street, New York, USA</p>
          <p><FaPhone /> +1 234 567 890</p>
          <p><FaEnvelope /> support@artweb.com</p>
          <p><FaClock /> Mon - Sat: 9:00 AM - 7:00 PM</p>
          <p><FaWhatsapp /> Chat with us on WhatsApp</p>
             <hr />
      <br />
        </div>
      </div>
    </div>
    <div className="footer-rights">
     <div className="line-p"></div>
     <div className="matter">
       © Artweb 2025. All Rights Reserved.
     </div>
     <div className="line-q"></div>
    </div>
   </footer>
  )
}

export default footer
