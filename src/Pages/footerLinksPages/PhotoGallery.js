import React, { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Testimonial from './component/Testimonial';
import Head from '../Head/Head';

const PhotoGallery = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [modalTitle, setModalTitle] = useState('');

    const photoArr = [
        {
            fullimg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/Atal-Achievement-Award-2023-6-thumbs-800X600.jpg',
            cardSmlImg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/Atal-Achievement-Award-2023-6-thumbs-600X400.jpg',
            title: 'Atal Achievement Award 2023 ',
        },
        {
            fullimg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/International-Healthcare-Pride-Award-20235-thumbs-800X600.jpg',
            cardSmlImg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/International-Healthcare-Pride-Award-20235-thumbs-600X400.jpg',
            title: 'International Healthcare Pride Award ',
        },
        {
            fullimg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/APJ-Abdul-Kalam-Inspiration-Award-20244-thumbs-800X600.jpg',
            cardSmlImg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/APJ-Abdul-Kalam-Inspiration-Award-20244-thumbs-600X400.jpg',
            title: 'APJ Abdul Kalam Inspiration Award ',
        },
        {
            fullimg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/Healthcare-Achievers-Award-20232-thumbs-800X600.jpg',
            cardSmlImg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/Healthcare-Achievers-Award-20232-thumbs-600X400.jpg',
            title: 'Healthcare Achievers Award 2023 ',
        },
        {
            fullimg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/International-Excellence-Award-20241-thumbs-800X600.jpg',
            cardSmlImg: 'https://www.ukgermanpharmaceuticals.com/uploaded-files/gallery/photos/thumbs/International-Excellence-Award-20241-thumbs-600X400.jpg',
            title: 'International Excellence Award 2024',
        },

    ];

    const openModal = (img, title) => {
        setModalImage(img);
        setModalTitle(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
        setModalTitle('');
    };

    return (
        <div>
            <Head />

            <section className="heading_banner PhotoUkBackground" >
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                            <h1 className="cat_title">Photo Gallery</h1>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gallery_page">
                <div className="container">
                    <h2 className="clrLogo aboutTitle">Photo Gallery</h2>
                    <p className="text-center w-75 mx-auto mb-4">
                        Explore our diverse Photo Gallery showcasing cutting-edge pharmaceutical solutions, innovative research, and our commitment to advancing healthcare excellence.
                    </p>
                    <div className="clearfix"></div>
                    <div className="row g-3 row-cols-1 row-cols-md-2 row-cols-lg-3">
                        {photoArr.map((photo, index) => (
                            <div className="col" key={index}>
                                <div className="gallery-bx">
                                    <div className="item">
                                        <div
                                            className="img-bx"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => openModal(photo.fullimg, photo.title)}
                                        >
                                            <img src={photo.cardSmlImg} alt={photo.title} title={photo.title} />
                                        </div>
                                    </div>
                                    <div className="tt">{photo.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay1" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="modal-close" onClick={closeModal}>&times;</span>
                        <img src={modalImage} alt={modalTitle} />
                        <div className="modal-caption">{modalTitle}</div>
                    </div>
                </div>
            )}

            <Testimonial />

            <div className="footer-wrapper">
                <Footer />
            </div>

        </div>
    );
};

export default PhotoGallery;
