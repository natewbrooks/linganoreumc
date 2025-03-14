import React from 'react';
import linganoreBrightPic from './assets/linganore-bright-pic.png';
import logoNoBkg from './assets/logo-no-bkg.svg';
import { Link } from 'react-router-dom';

function Motto() {
	return (
		<div className={`w-full flex flex-col items-center text-center font-dm mt-10`}>
			<span className={`text-3xl `}>OFFERING OURSELVES TO BE CHRIST-LIKE IN OUR COMMUNITY</span>
			<span className={`text-xl w-[800px]`}>
				One of the oldest congregation in the Baltimore-Washington Conference of the United
				Methodist Church with a tradition going back to the 1790s.
			</span>
		</div>
	);
}

export default Motto;
