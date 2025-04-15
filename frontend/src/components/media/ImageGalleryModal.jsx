import React, { useEffect, useRef, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaArrowRight, FaArrowLeft, FaXmark } from 'react-icons/fa6';

const ImageGalleryModal = ({ images, currentIndex, onClose, setCurrentIndex }) => {
	const modalRef = useRef(null);
	const [, setIndexTick] = useState(0); // triggers re-renders
	const currentIndexRef = useRef(currentIndex);

	const [imageErrors, setImageErrors] = useState(Array(images.length).fill(false));
	const [emblaRef, embla] = useEmblaCarousel({
		loop: true,
		startIndex: currentIndex,
		dragFree: false,
		containScroll: 'trimSnaps',
		speed: 2.5,
	});

	// Store the latest index in ref without triggering re-renders
	useEffect(() => {
		if (!embla) return;

		const updateIndex = () => {
			currentIndexRef.current = embla.selectedScrollSnap();
			setIndexTick((tick) => tick + 1); // trigger re-render
		};

		embla.on('select', updateIndex);
		embla.on('reInit', updateIndex);

		// Initial sync
		updateIndex();

		return () => {
			embla.off('select', updateIndex);
			embla.off('reInit', updateIndex);
		};
	}, [embla]);

	// Navigation
	const goPrev = () => embla?.scrollPrev();
	const goNext = () => embla?.scrollNext();

	const handleClickOutside = (e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			handleClose();
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Escape') handleClose();
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

	// Close handler that updates React state once
	const handleClose = () => {
		setCurrentIndex(currentIndexRef.current);
		onClose();
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
				className='relative flex items-center justify-center bg-bkg-tp border-4 border-bkg-tp w-[90vw] h-[80vh] md:w-[70vw] md:h-[80vh] overflow-hidden'>
				{/* Embla Carousel */}
				<div
					className='w-full h-full overflow-hidden'
					ref={emblaRef}>
					<div className='flex h-full'>
						{images.map((img, i) => {
							const src = '/api/media/images/' + img.url.split('/').pop();
							return (
								<div
									key={i}
									className='flex-[0_0_100%] h-full flex items-center justify-center px-4'>
									{imageErrors[i] ? (
										<div className='text-bkg text-lg'>Image failed to load</div>
									) : (
										<img
											src={src}
											alt='Preview'
											className='max-h-full max-w-full object-contain'
											onError={() => handleImageError(i)}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Navigation Controls */}
				<button
					className='absolute top-4 right-4 text-darkred z-50 clickable'
					onClick={handleClose}>
					<FaXmark size={32} />
				</button>
				{images.length > 1 && (
					<>
						<button
							className='absolute left-4 top-1/2 -translate-y-1/2 text-darkred z-50 clickable'
							onClick={goPrev}>
							<FaArrowLeft size={40} />
						</button>
						<button
							className='absolute right-4 top-1/2 -translate-y-1/2 text-darkred z-50 clickable'
							onClick={goNext}>
							<FaArrowRight size={40} />
						</button>
					</>
				)}

				{/* Index Display */}
				<div className='absolute top-4 left-4 text-bkg text-sm font-medium z-50 bg-darkred px-2'>
					<div className={``}>
						{currentIndexRef.current + 1} / {images.length}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageGalleryModal;
