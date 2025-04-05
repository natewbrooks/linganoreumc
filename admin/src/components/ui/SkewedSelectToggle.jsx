import React from 'react';
import { FaCheck } from 'react-icons/fa';

function SkewedSelectToggle({ id, selectedList, setSelectedList }) {
	const isSelected = selectedList.includes(id);

	const toggleSelected = () => {
		setSelectedList((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	return (
		<div
			onClick={toggleSelected}
			className={`relative select-none top-1 -left-4 cursor-pointer border-2 -skew-x-[30deg] px-0.5 h-fit
				${isSelected ? 'bg-red text-bkg-tp border-red' : 'bg-darkred text-darkred border-darkred'}
				hover:scale-[102%] active:scale-[100%] hover:opacity-50 transition-all`}>
			<div className='skew-x-[30deg] text-xs'>
				<div className={`${isSelected ? 'visible' : 'invisible'}`}>
					<FaCheck size={12} />
				</div>
			</div>
		</div>
	);
}

export default SkewedSelectToggle;
