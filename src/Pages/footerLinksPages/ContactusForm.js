import Footer from '../../components/Footer/Footer'
import './linkDetail.css'
import Head from '../Head/Head'


const ContactusForm = () => {
    return (
        <div>
            <Head />
            <section className="heading_banner contactusBackground" >
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                            <h1 className="cat_title">Contact Us</h1>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="contact_page ">
                <div className="container">
                    <div className="contact_form_grid1">
                        <div className="row">
                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12 contact_details">
                                <h2 className="clrLogo font-bold">Contact Information</h2>
                                <p>Write to us or call us, get quick response powered by our advanced customer support team .</p>

                                <div className='mb-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"></path>
                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                                </svg> UK German Pharmaceuticals, Akal Academy Road, Opp. Malwa Gramin Bank, Cheema Mandi -148029, Distt. Sangrur (Punjab) India</div>
                                <div className="d-flex">
                                    <span className="contact-icon">📞</span>
                                    <a className="text-black textDecorNone" href="tel:+919115513759">+91-911-551-3759 </a>
                                </div>
                                <div className="d-flex">
                                    <span className="contact-icon">📞</span>
                                    <a className="text-black textDecorNone" href="tel:+919115915933">+91-911-591-5933 </a>
                                </div>

                                <h3 className="clrLogo mt-3">Get in Touch</h3>
                                <div>
                                    <div className="mt-4"> <div className="contact-item">
                                        <span className="contact-icon">✉️</span>
                                        <a className="text-black textDecorNone" href="mailto:ukgermanpharmaceutical@gmail.com">ukgermanpharmaceutical@gmail.com</a>
                                    </div>
                                    </div>
                                    <div className="social-icons">
                                        <a href="https://www.facebook.com/people/Dr-BSKs/61576600531948/" target='blank' aria-label="Facebook">
                                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111392.png" alt="Facebook" />
                                        </a>
                                        <a href="https://www.instagram.com/drbsk_humanhealth?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target='blank' aria-label="Instagram">
                                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
                                        </a>
                                        <a href="https://www.youtube.com/@Dr.BSKsURUMEED-w4o" target='blank' aria-label="YouTube">
                                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
                                        </a>

                                        <a href="https://www.linkedin.com/company/dr-bsk-s/" target='blank' aria-label="LinkedIn">
                                            <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12 mt-5 mt-md-0">
                                <h3 className="title_h2_2">We want to hear from you!</h3>
                                <form name="contact-form" method="post" id="contact_form" novalidate="novalidate">
                                    <div id="pop_up"></div>

                                    <div className="row">
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="form-group">
                                                <input className="form-control" type="text" name="name" placeholder="Full Name*" onkeyup="allowOnlyAlphabets(this)" value="" pattern="[a-zA-Z\s]+" required="" />
                                            </div>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="form-group">
                                                <input className="form-control" type="email" name="email" placeholder="Email ID*" required="" />
                                            </div>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="form-group">
                                                <input type="hidden" name="countryName" className="countryName" value="" />
                                                <input type="hidden" name="code" className="code" value="" />
                                                <input className="form-control" type="tel" value="" name="mobile" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" minlength="10" maxlength="10" placeholder="Phone No*" required="" />
                                            </div>
                                        </div>
                                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="form-group">
                                                <input className="form-control" type="text" name="location" placeholder="Location*" required="" />
                                            </div>
                                        </div>
                                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div className="form-group">
                                                <textarea className="form-control" rows="5" placeholder="Comments Here*" required="" name="message"></textarea>
                                            </div>
                                        </div>
                                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div className="form-group"
                                            // style="margin-bottom: 0;"
                                            >
                                                <div className="g-recaptcha" data-sitekey="6LfwTrIlAAAAAEmUGCNcpBf0Ob7huhJ8XwU217VG"><div
                                                // style="width: 304px; height: 78px;"
                                                ><div><iframe title="reCAPTCHA" width="304" height="78" role="presentation" name="a-l8q4ngk5olhz" frameborder="0" scrolling="no" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox allow-storage-access-by-user-activation" src="https://www.google.com/recaptcha/api2/anchor?ar=1&amp;k=6LfwTrIlAAAAAEmUGCNcpBf0Ob7huhJ8XwU217VG&amp;co=aHR0cHM6Ly93d3cudWtnZXJtYW5waGFybWFjZXV0aWNhbHMuY29tOjQ0Mw..&amp;hl=en&amp;v=GUGrl5YkSwpBsxsF3eY665Ye&amp;size=normal&amp;cb=ob8y1t4m9hss"></iframe></div>
                                                    {/* <textarea id="g-recaptcha-response" name="g-recaptcha-response" className="g-recaptcha-response"
                                                 style="width: 250px; height: 40px; border: 1px solid rgb(193, 193, 193); margin: 10px 25px; padding: 0px; resize: none; display: none;"
                                                 ></textarea> */}
                                                </div></div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="form-group">
                                                <button type="submit" className="read_more01" name="submit_contact">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default ContactusForm
