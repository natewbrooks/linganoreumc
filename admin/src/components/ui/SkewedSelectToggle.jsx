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
			className={`relative select-none top-1 -left-4 clickable-l-skew border-2 -skew-x-[30deg] px-0.5 h-fit
				${isSelected ? 'bg-red border-red text-bkg' : 'bg-darkred text-darkred border-darkred'}
				transition-all`}>
			<div className='skew-r text-xs'>
				<div className={`${isSelected ? 'visible' : 'invisible'}`}>
					<FaCheck size={12} />
				</div>
			</div>
		</div>
	);
}

export default SkewedSelectToggle;
