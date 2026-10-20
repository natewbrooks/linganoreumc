import React, { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaArrowRight, FaArrowLeft, FaXmark } from 'react-icons/fa6';

const ImageGalleryModal = ({ images, currentIndex, onClose, setCurrentIndex }) => {
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

	// Any click that isn't on the image or a control closes
	const handleClickOutside = (e) => {
		if (!e.target.closest('img, button')) handleClose();
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

	// Rebinds once the carousel exists so arrow keys don't call a stale `embla`
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [embla]);

	return (
		// Full screen: controls pinned to the screen corners and edges
		<div className='fixed inset-0 z-50 bg-black/90'>
			{/* Embla Carousel */}
			<div
				className='w-full h-full overflow-hidden'
				ref={emblaRef}>
				<div className='flex h-full'>
					{images.map((img, i) => {
						const src =
							`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/` + img.url.split('/').pop();
						return (
							<div
								key={i}
								className='flex-[0_0_100%] h-full flex items-center justify-center px-4 py-20 md:px-24'>
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

			{/* Index */}
			{images.length > 1 && (
				<div className='absolute top-4 left-4 bg-black text-bkg font-dm text-sm px-3 py-1.5 rounded-full'>
					{currentIndexRef.current + 1} / {images.length}
				</div>
			)}

			{/* Navigation Controls */}
			<button
				aria-label='Close'
				className='absolute top-4 right-4 p-3 rounded-full bg-black text-bkg clickable'
				onClick={handleClose}>
				<FaXmark size={22} />
			</button>
			{images.length > 1 && (
				<>
					<button
						aria-label='Previous image'
						className='absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black text-bkg clickable'
						onClick={goPrev}>
						<FaArrowLeft size={22} />
					</button>
					<button
						aria-label='Next image'
						className='absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black text-bkg clickable'
						onClick={goNext}>
						<FaArrowRight size={22} />
					</button>
				</>
			)}
		</div>
	);
};

export default ImageGalleryModal;
