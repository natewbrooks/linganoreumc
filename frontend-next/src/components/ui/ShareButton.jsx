'use client';
import React, { useState } from 'react';
import { IoCheckmark, IoShareSocial } from 'react-icons/io5';

/** Share icon, with its label from md up. Native share sheet on phones, copies the link elsewhere */
export default function ShareButton({ title, label, className = '' }) {
	const [copied, setCopied] = useState(false);

	const share = async () => {
		const url = window.location.href;
		if (navigator.share) return navigator.share({ title, url }).catch(() => {});
		// Share and Clipboard APIs only exist on HTTPS. Older copy command covers plain HTTP
		if (navigator.clipboard) await navigator.clipboard.writeText(url).catch(() => {});
		else {
			const input = Object.assign(document.createElement('textarea'), { value: url });
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			input.remove();
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			onClick={share}
			aria-label={label}
			title={copied ? 'Link copied!' : label}
			className={`flex items-center gap-1.5 p-2 font-dm text-darkred cursor-pointer ${className}`}>
			{copied ? <IoCheckmark size={20} /> : <IoShareSocial size={20} />}
			{/* Label from md up. Both stacked so the width never shifts */}
			<span className='hidden md:grid'>
				<span className={`col-start-1 row-start-1 ${copied ? 'invisible' : ''}`}>{label}</span>
				<span className={`col-start-1 row-start-1 ${copied ? '' : 'invisible'}`}>Link Copied!</span>
			</span>
		</button>
	);
}
