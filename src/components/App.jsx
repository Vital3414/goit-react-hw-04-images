import { useState, useEffect } from 'react';
import Serchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import css from './styles.module.css';
import Modal from 'components/Modal/Modal';
import { Oval } from 'react-loader-spinner';
import LoadMore from 'components/Button/Button';
import { getImages } from './APIService/APIService';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPages, setShowPages] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const fetchImages = async () => {
      setIsLoading(true);

      try {
        const data = await getImages({ searchQuery, currentPage });

        if (!data.hits) {
          throw new Error('No matches found');
        }

        if (data.hits.length > 0) {
          setImages(prevImages => [...prevImages, ...data.hits]);
          setShowPages(currentPage < Math.ceil(data.totalHits / 12));
        } else {
          setIsLoading(false);
          setError('No images found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery, currentPage]);

  const handleImageClick = image => {
    setShowModal(true);
    setSelectedImage(image.largeImageURL);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  const handelOnSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setCurrentPage(1);
    setError(null);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };

  return (
    <>
      <Serchbar onSubmit={handelOnSubmit} />
      <div>
        <ImageGallery>
          <ImageGalleryItem images={images} hendleModal={handleImageClick} />
        </ImageGallery>
      </div>
      {isLoading && (
        <div className={css.LoaderContainer}>
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      )}
      {error && <div className={css.ErrorContainer}>{error}</div>}
      {showPages && !isLoading && !error && images && (
        <LoadMore onClick={handleLoadMore} />
      )}
      {showModal && <Modal image={selectedImage} onClose={handleCloseModal} />}
    </>
  );
}