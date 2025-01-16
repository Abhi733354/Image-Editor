import React, { useState } from 'react';
import { createApi } from 'unsplash-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const unsplash = createApi({
    accessKey: '4Fg1OFuydjWUVM8iuEoTr6YNLRVWBwEyoxhtgwCWkEI',
});

const ImageSearch = ({ onSelectImage }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            alert('Please enter a valid search term');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await unsplash.search.getPhotos({
                query,
                perPage: 20,
            });

            if (response.response && response.response.results) {
                setResults(response.response.results);
            } else {
                setError('No images found.');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            setError('Failed to fetch images. Please check your API key or network connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 border p-4 rounded">
            <div className='d-flex align-items-center gap-3'>
                <h4>Name :</h4>
                <h5>Abhinay Sharma</h5>
            </div>
            <div className='d-flex align-items-center gap-3'>
                <h4>Email :</h4>
                <h5>abhinaysharma127@gmail.com</h5>
            </div>
            <div className="d-flex justify-content-center mb-3 pt-5">
                <div className="input-group search-style">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for images"
                        className="form-control"
                    />
                    <button onClick={handleSearch} className="btn btn-primary">Search</button>
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="image-results">
                {results.length > 0 && !loading ? (
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 2000, disableOnInteraction: false }}
                        spaceBetween={10}
                        slidesPerView={4}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            600: { slidesPerView: 2 },
                            1000: { slidesPerView: 4 },
                        }}
                    >
                        {results.map((image) => (
                            <SwiperSlide key={image.id}>
                                <img
                                    src={image.urls.small}
                                    alt={image.alt_description || "Image"}
                                    className="d-block w-100"
                                    style={{ height: '300px', objectFit: 'cover' }}
                                />
                                <div className="text-center mt-2">
                                    <button
                                        onClick={() => onSelectImage(image.urls.full)}
                                        className="btn btn-primary col-7"
                                    >
                                        Add Captions
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    !loading && (
                        <p className="d-flex justify-content-center py-3">No images found. Try a different search query.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ImageSearch;
