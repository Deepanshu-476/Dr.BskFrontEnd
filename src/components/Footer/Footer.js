import "./Footer.css";
import logo from "../../logo/logo1.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { Smartphone } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-wave"></div>

      {/* option 1: */}
      {/* <div className="fo oter-container footer_flex1">
        <div className="foot er-col footerLogoSec  ">

          <a className='logo_size' href="/">
            <img src={logo} alt="Logo" className="logo" />
          </a>

          <div>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a className="text-black textDecorNone" href="tel:+919115513759">+91-911-551-3759 </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a className="text-black textDecorNone" href="tel:+919115915933">+91-911-591-5933 </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <a className="text-black textDecorNone" href="mailto:ukgermanpharmaceutical@gmail.com">ukgermanpharmaceutical@gmail.com</a>
              </div>
            </div>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/people/Dr-BSKs/61576600531948/"
                target="blank"
                aria-label="Facebook"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111392.png"
                  alt="Facebook"
                />
              </a>
              <a
                href="https://www.instagram.com/drbsk_humanhealth?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="blank"
                aria-label="Instagram"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                  alt="Instagram"
                />
              </a>
              <a
                href="https://www.youtube.com/@Dr.BSKsURUMEED-w4o"
                target="blank"
                aria-label="YouTube"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                  alt="YouTube"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/dr-bsk-s/"
                target="blank"
                aria-label="LinkedIn"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
                  alt="LinkedIn"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="footer_flex">

          <div className="foo ter-col footerLinkSec">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a onClick={() => navigate('/aboutus')}>About us</a></li>
              <li><a onClick={() => navigate('/fever')}>Our Products</a></li>
          
              <li><a onClick={() => navigate('/video')}>Video Gallery</a></li>
              <li><a onClick={() => navigate('/photo')}>Photo Gallery</a></li>
              <li><a onClick={() => navigate('/blogs')}>Blogs</a></li>
              <li><a onClick={() => navigate('/contactus')}>Contact us</a></li>
            </ul>
          </div>

 
          <div className="foo ter-col footerLinkSec">
            <h4>Our Policies</h4>
            <ul className="footer-links">
              <li>
                <a onClick={() => navigate('/terms')}>Terms and Conditions</a>
              </li>
              <li>
                <a onClick={() => navigate('/privacy')}>Privacy Policy</a>
              </li>
         
              <li>
                <a onClick={() => navigate('/shipping')}>Shipping and Delivery Policy</a>
              </li>
              <li>
                <a onClick={() => navigate('/return')}>Return, Refund and Cancellation Policy</a>
              </li>
            </ul>
          </div>

    
          <div className="foo ter-col footerLinkSec">
            <h4>Registered Office</h4>
            <address>
              UK German Pharmaceuticals,
              <br /> Akal Academy Road,
              <br />
              Opp. Malwa Gramin Bank,
              <br /> Cheema Mandi -148029,
              <br />
              Distt. Sangrur (Punjab) India
            </address>
          </div>
        </div>
      </div> */}

      {/* option 2: */}
      <div className="fo oter-container footer_flex1">
        <div className=" footerLogoS ec footerWidth1  ">
          <span>
            <a className='d-flex justify-content-start ms-2 logo_size_footer' href="/">
              <img src={logo} alt="Logo" className="logo logo_size_footer" />
            </a>
          </span>

          <div>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a className="text-black textDecorNone" href="tel:+919115513759">+91-911-551-3759 </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a className="text-black textDecorNone" href="tel:+919115915933">+91-911-591-5933 </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <a className="text-black textDecorNone" href="mailto:ukgermanpharmaceutical@gmail.com">ukgermanpharmaceutical@gmail.com</a>
              </div>
            </div>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/people/Dr-BSKs/61576600531948/"
                target="blank"
                aria-label="Facebook"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111392.png"
                  alt="Facebook"
                />
              </a>
              <a
                href="https://www.instagram.com/drbsk_humanhealth?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="blank"
                aria-label="Instagram"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                  alt="Instagram"
                />
              </a>
              <a
                href="https://www.youtube.com/@Dr.BSKsURUMEED-w4o"
                target="blank"
                aria-label="YouTube"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                  alt="YouTube"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/dr-bsk-s/"
                target="blank"
                aria-label="LinkedIn"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
                  alt="LinkedIn"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Company */}
        <div className=" footerLinkSec footerWidth ">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a onClick={() => navigate('/aboutus')}>About us</a></li>
            <li><a onClick={() => navigate('/fever')}>Our Products</a></li>
            {/* <li><a onClick={() => navigate('/testimonial')}>Customer Speaks</a></li> */}
            <li><a onClick={() => navigate('/video')}>Video Gallery</a></li>
            <li><a onClick={() => navigate('/photo')}>Photo Gallery</a></li>
            <li><a onClick={() => navigate('/blogs')}>Blogs</a></li>
            <li><a onClick={() => navigate('/contactus')}>Contact us</a></li>
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div className=" footerLinkSec footerWidth ">
          <h4>Our Policies</h4>
          <ul className="footer-links">
            <li>
              <a onClick={() => navigate('/terms')}>Terms and Conditions</a>
            </li>
            <li>
              <a onClick={() => navigate('/privacy')}>Privacy Policy</a>
            </li>

            <li>
              <a onClick={() => navigate('/shipping')}>Shipping and Delivery Policy</a>
            </li>
            <li>
              <a onClick={() => navigate('/return')}>Return, Refund and Cancellation Policy</a>
            </li>
          </ul>
        </div>

        {/* Column 5: Contact */}
        <div className=" footerLinkSec footerWidth ">
          <h4>Registered Office</h4>
          <address>
            UK German Pharmaceuticals,
            <br /> Akal Academy Road,
            <br />
            Opp. Malwa Gramin Bank,
            <br /> Cheema Mandi -148029,
            <br />
            Distt. Sangrur (Punjab) India
          </address>
        </div>
      </div>



      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {new Date().getFullYear()} Dr.BSK's. All Rights Reserved.</p>
          <a className="text-white textDecorNone" target="blank" href="https://careerinfowisitsolution.com/">Crafted With ❤ by CIIS - Career Infowis IT Solutions Pvt Ltd</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
