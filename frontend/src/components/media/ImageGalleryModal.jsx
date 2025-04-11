import React, { useEffect, useRef, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaArrowRight, FaArrowLeft, FaXmark } from 'react-icons/fa6';

const ImageGalleryModal = ({ images, currentIndex, onClose, setCurrentIndex }) => {
	const modalRef = useRef(null);
	const [imageErrors, setImageErrors] = useState(Array(images.length).fill(false));

	const [emblaRef, embla] = useEmblaCarousel({
		loop: true,
		startIndex: currentIndex,
	});

	// Update index on scroll
	const onSelect = useCallback(() => {
		if (!embla) return;
		setCurrentIndex(embla.selectedScrollSnap());
	}, [embla]);

	useEffect(() => {
		if (embla) embla.on('select', onSelect);
	}, [embla, onSelect]);

	const goPrev = () => {
		if (embla) embla.scrollPrev();
	};

	const goNext = () => {
		if (embla) embla.scrollNext();
	};

	const handleClickOutside = (e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			onClose();
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowLeft') goPrev();
		if (e.key === 'ArrowRight') goNext();
	};

	const handleImageError = (index) => {
		setImageErrors((prev) => {
			const updated = [...prev];
			updated[index] = true;
			return updated;
		});
	};

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 w-screen h-screen'>
			<div
				ref={modalRef}
				className='relative flex flex-col items-center justify-center w-full max-w-[90vw] max-h-[90vh]'>
				{/* Embla viewport */}
				<div
					className='overflow-hidden w-full h-full'
					ref={emblaRef}>
					<div className='flex touch-pan-y'>
						{images.map((img, i) => {
							const src = '/api/media/images/' + img.url.split('/').pop();
							return (
								<div
									key={i}
									className='min-w-full flex items-center justify-center px-4'>
									{imageErrors[i] ? (
										<div className={`relative max-h-[70vh] max-w-[70vw] rounded-xl bg-darkred`}>
											<div className='w-[70vw] h-[70vh]  text-bkg flex items-center justify-center text-lg '>
												Image failed to load
											</div>

											{/* Index */}
											<div className='absolute top-4 left-4 text-bkg text-sm font-medium'>
												{currentIndex + 1} / {images.length}
											</div>

											{/* Close */}
											<button
												className='absolute top-4 right-4 text-bkg hover:text-gray-300'
												onClick={onClose}>
												<FaXmark size={32} />
											</button>

											{/* Arrows */}
											<button
												className='absolute left-4 top-1/2 text-bkg hover:text-gray-300'
												onClick={goPrev}>
												<FaArrowLeft size={40} />
											</button>
											<button
												className='absolute right-4 top-1/2 text-bkg hover:text-gray-300'
												onClick={goNext}>
												<FaArrowRight size={40} />
											</button>
										</div>
									) : (
										<div
											className={`relative max-h-[70vh] max-w-[70vw] bg-darkred rounded-xl shadow-lg `}>
											<img
												src={src}
												alt='Preview'
												className='w-full h-full object-contain'
												onError={() => handleImageError(i)}
											/>

											{/* Index */}
											<div className='absolute top-4 left-4 text-bkg text-sm font-medium'>
												{currentIndex + 1} / {images.length}
											</div>

											{/* Close */}
											<button
												className='absolute top-4 right-4 text-bkg hover:text-gray-300'
												onClick={onClose}>
												<FaXmark size={32} />
											</button>

											{/* Arrows */}
											<button
												className='absolute left-4 top-1/2 text-bkg hover:text-gray-300'
												onClick={goPrev}>
												<FaArrowLeft size={40} />
											</button>
											<button
												className='absolute right-4 top-1/2 text-bkg hover:text-gray-300'
												onClick={goNext}>
												<FaArrowRight size={40} />
											</button>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageGalleryModal;
