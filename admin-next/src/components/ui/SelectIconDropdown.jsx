import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as SiIcons from 'react-icons/si';

function SelectIconDropdown({ initialSelectedIcon = '', onIconChange, onXClick }) {
	const [enabled, setEnabled] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedIcon, setSelectedIcon] = useState(initialSelectedIcon);
	const dropdownRef = useRef(null);

	// Sync selected icon when initialSelectedIcon changes
	useEffect(() => {
		setSelectedIcon(initialSelectedIcon);
	}, [initialSelectedIcon]);

	// Combine icons from fa, fa6, si
	const iconEntries = [
		...Object.entries(FaIcons),
		...Object.entries(Fa6Icons),
		...Object.entries(SiIcons),
	];

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setEnabled(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Handle icon selection
	const handleSelect = (iconName) => {
		setSelectedIcon(iconName);
		onIconChange && onIconChange(iconName);
		setEnabled(false);
	};

	// Handle removing icon
	const handleRemoveIcon = (e) => {
		e.stopPropagation(); // Prevent accidental dropdown toggle
		if (onXClick) {
			onXClick();
		}
		setSelectedIcon('');
	};

	// Filter icons based on search term
	const filteredIcons = iconEntries.filter(([name]) =>
		name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div
			ref={dropdownRef}
			className='md:relative flex flex-col'>
			{/* Clickable field */}
			<div className='font-dm  border-l-4 border-red bg-tp clickable px-2 py-1 h-[64px] w-[100px] flex items-center'>
				{selectedIcon ? (
					<div
						onClick={() => setEnabled(!enabled)}
						className='flex flex-col w-full items-center justify-center space-y-1'>
						{FaIcons[selectedIcon] && React.createElement(FaIcons[selectedIcon], { size: 36 })}
						{SiIcons[selectedIcon] && React.createElement(SiIcons[selectedIcon], { size: 36 })}
					</div>
				) : (
					<p
						onClick={() => setEnabled(!enabled)}
						className='text-black/50 text-xs text-center'>
						Select an icon...
					</p>
				)}
				{/* Clear (X) button */}
				{/* {selectedIcon && ( */}
				<FaTimes
					size={16}
					onClick={handleRemoveIcon}
					className='absolute right-2 hover:scale-105 top-2 text-black/50 clickable'
				/>
				{/* )} */}
			</div>

			{/* Dropdown list */}
			{enabled && (
				<div className='absolute w-fit max-h-[300px] left-1/2 -translate-x-1/2  translate-y-[32px] z-30 overflow-y-auto flex flex-col space-y-2 bg-white border-l-4 border-red pb-2 px-4 shadow-md'>
					<div className='flex flex-col md:flex-row md:space-x-4 items-center py-2'>
						<span className='font-dm text-black whitespace-nowrap'>Search Icons</span>
						<div className='flex space-x-2 items-center'>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='font-dm border-l-4 text-black/50 border-red px-2 outline-none bg-transparent'
								placeholder='Search...'
							/>
							<FaSearch
								size={14}
								className='text-black/50'
							/>
						</div>
					</div>

					{/* Display Icons */}
					<div className='grid grid-cols-4 gap-1 p-2'>
						{filteredIcons.length > 0 ? (
							filteredIcons.slice(0, 100).map(([name, IconComponent]) => (
								<div
									key={name}
									onClick={() => handleSelect(name)}
									className='p-2 clickable hover:bg-gray-200 rounded flex flex-col items-center text-center'>
									<IconComponent
										size={24}
										className='text-black'
									/>
								</div>
							))
						) : (
							<div className='p-2 text-center text-black/50 font-dm col-span-4'>No icons found</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default SelectIconDropdown;
