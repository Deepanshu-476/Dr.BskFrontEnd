import React from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Head from '../Head/Head'

const VideoGallery = () => {

    const videoArr = [
        {
            videoLink: 'https://www.youtube.com/watch?v=pcp7x-7f7Io',
            backgroundImg: 'https://img.youtube.com/vi/pcp7x-7f7Io/hqdefault.jpg',
            title: 'U K German Pharmaceuticals Featured on Zee Business as winner of National Quality Awards 2024',
        },
        {
            videoLink: 'https://www.youtube.com/watch?v=82eVz9h2dHA',
            backgroundImg: 'https://www.ukgermanpharmaceuticals.com/designer/images/82eVz9h2dHA-SD.jpg',
            title: 'Global Excellence Awards 2023 Winner',
        },
        {
            videoLink: 'https://www.youtube.com/watch?v=rUipTA1I7pc',
            backgroundImg: 'https://www.ukgermanpharmaceuticals.com/designer/images/rUipTA1I7pc-SD.jpg',
            title: 'UK German Pharmaceuticals won Industry Leaders Awards 2023',
        },
        {
            videoLink: 'https://www.youtube.com/watch?v=9j96F-gsebQ',
            backgroundImg: 'https://www.ukgermanpharmaceuticals.com/designer/images/9j96F-gsebQ-SD.jpg',
            title: "Dr. Upkar Kansal Received Industry Leaders Awards 2022 ",
        },
        {
            videoLink: 'https://www.youtube.com/watch?v=nnPlC8JT6Lg',
            backgroundImg: 'https://www.ukgermanpharmaceuticals.com/designer/images/nnPlC8JT6Lg-SD.jpg',
            title: 'UK German Pharmaceuticals won Industry Leaders Awards 2023',
        },
        {
            videoLink: 'https://www.youtube.com/watch?v=BE6jLoxGpvg',
            backgroundImg: 'https://www.ukgermanpharmaceuticals.com/designer/images/BE6jLoxGpvg.jpg',
            title: "Veterinary Medicine Manufacturers",
        },

        {
            videoLink: 'https://www.youtube.com/watch?v=PV8vZdgZ3HQ',
            backgroundImg: 'https://www.ukgermanpharmaceuticals.com/designer/images/PV8vZdgZ3HQ-SD.jpg',
            title: "UK German Pharmaceuticals Received Brand Empower's Global Excellence Award 2023",
        },
    ]

    return (
        <div>
            <div>
                <Head />
            </div>
            <section className="heading_banner PhotoUkBackground" >
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                            <h1 className="cat_title">Video Gallery</h1>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="gallery_page">
                <div className="container">
                    <h2 className="clrLogo aboutTitle">Video Gallery</h2>
                    <p className="text-center w-75 mx-auto"> Explore our diverse video gallery showcasing cutting-edge pharmaceutical solutions, innovative research, and our commitment to advancing healthcare excellence. </p>
                    <div className="clearfix"></div>
                    <div className="row">
                        {videoArr.map((item, i) => {
                            return (
                                <div key={i} className='col-12 col-md-4 col-lg-4'>
                                    <div className="video-section">
                                        <div className="video-inner">
                                            <div
                                                className="video-content"
                                                style={{
                                                    backgroundImage: `url(${item.backgroundImg})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    height: "250px",
                                                    width: "100%"
                                                }}
                                            >
                                                <a
                                                    data-fancybox=""
                                                    target="_blank"
                                                    href={item.videoLink}
                                                    title="UK German Pharmaceuticals Received Industry Leaders Awards 2023"
                                                    className="pulse-button"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="25"
                                                        height="25"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="gallery_item_info">
                                            <div className="featureTitle">
                                                {item.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <div className="footer-wrapper">
                <Footer />
            </div>
        </div>
    )
}

export default VideoGallery
