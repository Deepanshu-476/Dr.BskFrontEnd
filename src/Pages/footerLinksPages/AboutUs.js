import './linkDetail.css'
import Testimonial from './component/Testimonial';
import Head from '../Head/Head';
import Footer from '../../components/Footer/Footer';

const AboutUs = () => {
    const serviceCardArr = [
        {
            img: 'https://www.ukgermanpharmaceuticals.com/designer/images/icon/natureofbusiness.png',
            title: 'Nature of the Business',
            detail: 'Manufacturers, Suppliers'
        },
        {
            img: 'https://www.ukgermanpharmaceuticals.com/designer/images/icon/natureofbusiness.png',
            title: 'Nature of the Business',
            detail: 'Manufacturers, Suppliers'
        },
        {
            img: 'https://www.ukgermanpharmaceuticals.com/designer/images/icon/natureofbusiness.png',
            title: 'Nature of the Business',
            detail: 'Manufacturers, Suppliers'
        },
        {
            img: 'https://www.ukgermanpharmaceuticals.com/designer/images/icon/natureofbusiness.png',
            title: 'Nature of the Business',
            detail: 'Manufacturers, Suppliers'
        },
    ]

    return (
        <div>
            <Head />

            <section className='animalBackground heading_banner'>
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                            <h1 className="cat_title">About Us</h1>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className='about_page'>
                <div className='container'>
                    <h1 className='clrLogo aboutTitle'>Top Animal Pharmaceutical Company in India</h1>

                    <div >
                        <div className='product_right_image'>
                            <img className='animalImgWidth' src='https://www.ukgermanpharmaceuticals.com/uploaded-files/page-images/thumbs/About-us-thumbs-500X500.jpg' alt='animal image' />
                        </div>

                        <p > UK German Pharmaceuticals,  <strong>established in 1991</strong>, has been at the forefront of animal healthcare for over three decades. Under the leadership of <strong>Dr. Bhim Sain Kansal</strong>UK German Pharmaceuticals, , our company has grown to become one of the most trusted names in the animal pharmaceutical industry. We are committed to providing innovative and high-quality solutions for livestock and other animals, improving their health and productivity. Our expertise lies in the research, development, and manufacturing of a wide range of pharmaceutical products, including vaccines, antibiotics, and nutritional supplements. Recognized as a <strong>Top Animal Pharmaceutical Company in India</strong>, we have earned the trust and loyalty of veterinarians, farmers, and agricultural professionals across the country. Each of our products is carefully formulated using the latest scientific advancements to ensure maximum safety and effectiveness.</p>

                        <p >We understand the diverse needs of animal health, whether it’s for large-scale livestock management or specific health concerns. Our products are designed to meet the unique challenges faced by farmers and animal caregivers, ensuring healthier, more productive animals. We pride ourselves on our rigorous quality control measures, which ensure that every product we release into the market meets the highest standards of safety and reliability. Our focus on innovation and quality, combined with Dr. Bhim Sain Kansal's leadership, allows us to continue making significant contributions to the animal health industry. Our manufacturing facilities are equipped with state-of-the-art technology, allowing us to maintain the highest standards of quality throughout the production process. We remain dedicated to enhancing the well-being of animals and supporting the agricultural community, providing solutions that contribute to the sustainable growth of the industry.</p>
                        <h4 className='clrLogo'>Company Factsheet</h4>
                        <p >We are ranked among the most trusted organization offering an enormous range of veterinary drugs processed in compliance with industry norms.</p>
                    </div>

                    <div className='clearfix'></div>
                    <div className='row py-2'>
                        {serviceCardArr.map((item, i) => {
                            return (
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className='serv-card'>
                                        <div className="row g-0 align-items-center">
                                            <div className="col-2 col-lg-3">
                                                <div className="img-bx me-2">
                                                    <img className='animalImgWidth img-fluid' src={item.img} alt='img' />
                                                </div>
                                            </div>
                                            <div className="col-9 tx-bx">
                                                <p className="mb-1">{item.title}</p>
                                                <p className="mb-0 clr_ylw">{item.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* why choose us section */}
                    <div >
                        <h1 className='clrLogo aboutTitle'>Why choose us?</h1>
                        <div className='product_right_image doctorImgSize'>
                            <img className='animalImgWidth' src='https://www.ukgermanpharmaceuticals.com/designer/images/about/abt2.jpg' alt='animal image' />
                        </div>
                        <p>UK German Pharmaceuticals is a well-established and reliable pharmaceutical company that has been in the industry from 1991. Here are some reasons why you should choose us:</p>

                        <h4 className='clrLogo'>Infertility Treatment and Services</h4>
                        <ul>
                            <li>GMP Certified: We are a GMP (Good Manufacturing Practices) certified company, which means that we adhere to strict quality control measures and standards to ensure that our products meet the highest quality standards.</li>
                            <li>Wide Range of Products: We offer a wide range of products, including animal feed supplements, animal nutrition supplements, veterinary medicine and human medicine and supplements. </li>
                            <li>Strict Quality Control: We take the quality of our products very seriously, and each product must pass stringent quality control checks before it is offered for sale in the open market. </li>
                            <li>Professionalism: We value our customers and are committed to providing the highest level of professionalism in all our dealings. </li>
                            <li>Customer Satisfaction: At UK German Pharmaceuticals, customer satisfaction is our top priority. We believe that our success is directly linked to the success of our customers, and we are committed to providing products that meet their needs and exceed their expectations.</li>
                        </ul>
                        <p>If you are looking for a reliable and innovative pharmaceutical company that offers a wide range of high-quality products, We are the right choice for you. Contact us today to learn more about our products and services.</p>

                        <h4 className='clrLogo'>Our Management</h4>

                        <div className="right_image1">
                            <div className="left_centered">
                                <div className="image">
                                    <img className='animalImgWidth' src="https://www.ukgermanpharmaceuticals.com/designer/images/about/abt3.jpg" alt="Infertility Treatment and Services in India" title="Infertility Treatment and Services in India" />
                                </div>
                            </div>
                        </div>

                        <p>We pride ourselves on our strong and dedicated management team. Our leadership team has a wealth of experience in the pharmaceutical industry and is committed to providing the best healthcare solutions to our clients.</p>
                        <p>Dr. Bhim Sain Kansal, the founder of UK German Pharmaceuticals, is a respected name in the pharmaceutical industry. With his vision, expertise, and leadership, the company has become a leading provider of animal and human healthcare solutions.</p>
                        <p>Our management team is made up of professionals who bring diverse backgrounds and skill sets to the table. They are committed to the highest standards of excellence in all aspects of the business, including research and development, production, and distribution.</p>
                        <p>Our team is dedicated to meeting the evolving needs of our clients and continuously improving our product line to ensure that we provide the best solutions in animal and human healthcare. With their combined experience and expertise, our management team is well-equipped to lead UK German Pharmaceuticals into the future and achieve even greater success.</p>
                        <div className='clearfix'></div>

                    </div>

                </div>
            </div>

            {/* faq section */}
            <div className="faq_section">
                <div className="container">

                    <h1 className="clrLogo aboutTitle">FAQs</h1>

                    <div className="clearfix"></div>
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item wow fadeInLeft" data-wow-delay=".1s">
                                    <div className="accordion-header" id="heading_1">
                                        <span className="accordion-button " role="button" data-bs-toggle="collapse" data-bs-target="#faq_1" aria-expanded="true" aria-controls="heading_1">What is Electro Homeopathy, and how is it different from other medical systems?                                </span>
                                    </div>
                                    <div id="faq_1" className="accordion-collapse in collapse show" aria-labelledby="heading_1" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>Electro Homeopathy is a branch of homeopathy that uses plant extracts and minerals to prepare medicines. It differs from other medical systems by using higher potencies and focusing on the prevention of disease rather than just treating the symptoms.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item wow fadeInLeft" data-wow-delay=".2s">
                                    <div className="accordion-header" id="heading_2">
                                        <span className="accordion-button collapsed" role="button" data-bs-toggle="collapse" data-bs-target="#faq_2" aria-expanded="true" aria-controls="heading_2">Are your medicines safe for human and animal consumption?                                </span>
                                    </div>
                                    <div id="faq_2" className="accordion-collapse  collapse " aria-labelledby="heading_2" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>Yes, all our medicines are safe for human and animal consumption. We follow strict quality control measures and adhere to national and international standards to ensure the safety and efficacy of our products.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item wow fadeInLeft" data-wow-delay=".3s">
                                    <div className="accordion-header" id="heading_3">
                                        <span className="accordion-button collapsed" role="button" data-bs-toggle="collapse" data-bs-target="#faq_3" aria-expanded="true" aria-controls="heading_3">How can I purchase your products?                                </span>
                                    </div>
                                    <div id="faq_3" className="accordion-collapse  collapse " aria-labelledby="heading_3" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>You can purchase our products from our authorized dealers and distributors across India. You can also contact us directly through our website or customer care helpline to place an order.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item wow fadeInLeft" data-wow-delay=".4s">
                                    <div className="accordion-header" id="heading_4">
                                        <span className="accordion-button collapsed" role="button" data-bs-toggle="collapse" data-bs-target="#faq_4" aria-expanded="true" aria-controls="heading_4">Are there any hidden costs associated with your products?                                </span>
                                    </div>
                                    <div id="faq_4" className="accordion-collapse  collapse " aria-labelledby="heading_4" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>No, we do not have any hidden costs associated with our products. We believe in transparency and provide our customers with the best quality products at affordable prices. The prices listed on our website and other marketing materials are inclusive of all taxes and charges.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* testimonials */}
            <Testimonial />

            <div  className="footer-wrapper">
                <Footer />
            </div>

        </div >
    )
}

export default AboutUs


