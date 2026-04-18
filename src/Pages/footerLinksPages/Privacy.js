import Footer from '../../components/Footer/Footer'
import './linkDetail.css'
import Head from '../Head/Head'

const Privacy = () => {
  return (
    <div>
      <Head />
      <div className="container">

        <section className="privacy-section my-5">
          <h1 className="section-title">Privacy Policy</h1>

          <div className="effective-date">
            <p>
              Effective Date: July 3, 2025<br />
              Last Updated: July 3, 2025
            </p>
          </div>

          <p className="intro-text">
            At Dr. BSK's UK German Pharmaceuticals, we value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines the types of information we collect, how we use and protect it, and your rights regarding that information.
          </p>

          <div className="privacy-content">
            <article className="privacy-item">
              <h2 className="privacy-title">1. Information We Collect</h2>
              <p className="privacy-text">We collect both personal and non-personal information to improve our services and fulfill orders. The types of information we may collect include:</p>
              <ul className="privacy-list">
                <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, and payment details when you place an order or contact us.</li>
                <li><strong>Non-Personal Information:</strong> IP address, browser type, device information, and browsing behavior through cookies and other tracking technologies.</li>
              </ul>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">2. How We Use Your Information</h2>
              <p className="privacy-text">We use your information to:</p>
              <ul className="privacy-list">
                <li>Process your orders and provide customer support.</li>
                <li>Improve our website and user experience.</li>
                <li>Send updates, promotional offers, and other communications with your consent.</li>
                <li>Comply with legal obligations and protect our rights.</li>
              </ul>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">3. Sharing Your Information</h2>
              <p className="privacy-text">We do not sell, rent, or share your personal information except in the following cases:</p>
              <ul className="privacy-list">
                <li>With your explicit consent.</li>
                <li>With service providers who assist in processing payments or shipping your orders.</li>
                <li>When required by law or legal processes, or to protect our rights or safety.</li>
              </ul>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">4. Cookies</h2>
              <p className="privacy-text">We use cookies to personalize your experience and track website usage for analytics purposes. You can modify your browser settings to disable cookies, but doing so may impact your experience on our site.</p>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">5. Data Security</h2>
              <p className="privacy-text">We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or disclosure. However, no method of data transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">6. Your Rights</h2>
              <p className="privacy-text">You have the right to access, correct, or delete your personal information. You can also object to the processing of your data or withdraw consent where applicable. To exercise any of these rights, please contact us at [your email].</p>
            </article>

            <article className="privacy-item">
              <h2 className="privacy-title">7. Changes to Privacy Policy</h2>
              <p className="privacy-text">We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated effective date will be clearly displayed. Your continued use of the Website constitutes acceptance of the updated policy.</p>
            </article>
          </div>
        </section>

        <section className="contact-section">
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-text">If you have any questions or concerns about our Privacy Policy, please contact us:</p>

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

export default Privacy
