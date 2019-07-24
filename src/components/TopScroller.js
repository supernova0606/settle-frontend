import React, { useState } from 'react';


function scrollUp(event) {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}


function TopScroller(props) {
    let [scrollY, setScrollY] = useState(0);
    let setY = () => {
        setScrollY(window.scrollY)
    }
    window.onScrollActions.updateY = setY;

    return (
        scrollY > 800 ?
            <div class="scroll-up click-effect d-lg-none">
                <img src="icons/up-arrow.svg" onClick={scrollUp} width="25" height="25" alt="" />
            </div> :
            null
    );
}

export {TopScroller}