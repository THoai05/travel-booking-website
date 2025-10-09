import React from 'react'

const ThreeDotsIndicator = () => {
    return (
        <div className="three-line flex pl-16 space-x-1">
            <div className="w-2 h-2 bg-black rounded-full shadow-md"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
        </div>
    )
}

export default ThreeDotsIndicator