import Footer from '../../components/Footer/Footer'
import './linkDetail.css'
import Head from '../Head/Head'

const Terms = () => {
  return (
    <div>
      <Head />
      <div className="container">
        
        <section className="terms-section my-5">
          <h1 className="section-title">Terms & Conditions</h1>

          <div className="effective-date">
            <p>
              Effective Date: July 3, 2025<br/>
                Last Updated: July 3, 2025
            </p>
          </div>

          <p className="intro-text">
            Welcome to Dr. BSK's UK German Pharmaceuticals ("Company", "we", "our", or "us"). By accessing our website [www.ukgermanpharmaceuticals.com] ("Website"), you agree to comply with and be bound by the following Terms and Conditions. If you disagree with any part of these terms, please do not use our Website.
          </p>

          <div className="terms-content">
            <article className="term-item">
              <h2 className="term-title">1. Use of the Website</h2>
              <p className="term-text">This Website is intended for informational and commercial purposes related to our animal healthcare and electropathy-based products. You may use the Website for lawful purposes only.</p>
            </article>

            <article className="term-item">
              <h2 className="term-title">2. Intellectual Property</h2>
              <p className="term-text">All content on this Website, including logos, images, text, product information, and software, is the property of UK German Pharmaceuticals and protected under applicable copyright, trademark, and intellectual property laws.</p>
            </article>

            <article className="term-item">
              <h2 className="term-title">3. Product Information & Medical Disclaimer</h2>
              <p className="term-text">Our products are feed supplements and are not intended to diagnose, treat, cure, or prevent any disease. Consult a licensed veterinary professional before administering any product. Information on the Website is for educational purposes only.</p>
            </article>

            <article className="term-item">
              <h2 className="term-title">4. Orders & Payments</h2>
              <p className="term-text">Orders placed through the Website are subject to product availability, pricing changes, and shipping policies. We reserve the right to cancel or reject any order at our discretion.</p>
            </article>

            <article className="term-item">
              <h2 className="term-title">5. Limitation of Liability</h2>
              <p className="term-text">We are not liable for any direct or indirect damages arising from the use of our Website or products. Your use of our Website and products is at your own risk.</p>
            </article>

            <article className="term-item">
              <h2 className="term-title">6. Third-Party Links</h2>
              <p className="term-text">Our Website may contain links to third-party websites. We are not responsible for the content or privacy practices of these sites.</p>
            </article>

            <article className="term-item">
              <h2 className="term-title">7. Changes to Terms</h2>
              <p className="term-text">We reserve the right to modify these Terms at any time. Continued use of the Website after any changes constitutes your acceptance of the new Terms.</p>
            </article>
          </div>
        </section>

        
        <section className="privacy-section mb-5">
          <h1 className="section-title">Privacy Policy</h1>

          <div className="effective-date">
            <p>
              Effective Date: July 3, 2025<br/>
                Last Updated: July 3, 2025
            </p>
          </div>

          <p className="intro-text">
            At Dr. BSK's UK German Pharmaceuticals, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our Website.
          </p>

          <div className="privacy-content">
            <article className="privacy-item">
              <h2 className="privacy-title">1. Information We Collect</h2>
              <p className="privacy-text">We may collect the following types of information:</p>
              <ul className="privacy-list">
                <li><strong>Personal Information:</strong> Name, phone number, email address, and postal address when you place an order or contact us.</li>
                <li><strong>Non-Personal Data:</strong> Browser type, IP address, and usage statistics through cookies and analytics tools.</li>
              </ul>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">2. How We Use Your Information</h2>
              <p className="privacy-text">We use your information to:</p>
              <ul className="privacy-list">
                <li>Fulfill orders and provide customer support</li>
                <li>Improve our Website and services</li>
                <li>Send updates, offers, and relevant communications (with your consent)</li>
              </ul>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">3. Sharing Your Information</h2>
              <p className="privacy-text">We do not sell, rent, or share your personal information with third parties, except:</p>
              <ul className="privacy-list">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To service providers for payment processing or shipping</li>
              </ul>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">4. Cookies</h2>
              <p className="privacy-text">We use cookies to enhance your browsing experience and collect anonymized data about Website usage. You can disable cookies through your browser settings.</p>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">5. Data Security</h2>
              <p className="privacy-text">We take reasonable technical and administrative measures to protect your data from unauthorized access, disclosure, or misuse.</p>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">6. Your Rights</h2>
              <p className="privacy-text">You may request access, correction, or deletion of your personal data by contacting us at [your email].</p>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">7. Changes to Privacy Policy</h2>
              <p className="privacy-text">We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with the updated effective date.</p>
            </article>
          </div>
        </section>

          <section className="contact-section">
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-text">If you have any questions about our Terms & Conditions or Privacy Policy, please contact:</p>

          <address className="contact-address">
            <p className="company-name">Dr. BSK's UK German Pharmaceuticals</p>
            <p>Cheema, Punjab – 148031, India</p>
            <p>Email: <a className='text-dark textDecorNone contact-link' href="mailto:contact@ukgermanpharmaceuticals.com" >contact@ukgermanpharmaceuticals.com</a></p>
            <p>Phone: <a className='text-dark textDecorNone contact-link' href="tel:+911234567890">+91 123 456 7890</a></p>
          </address>
        </section>
      </div>


      <Footer />
    </div>
  )
}

export default Terms
