import React from 'react'
import styles from '../css/Blog.module.css'

const Hero = () => {
  return (
    <section className={`${styles.bg_blog} w-full h-[921px] flex items-center justify-center`}>
      <div
        className="flex items-center gap-3 px-6 py-4 rounded-full shadow-lg 
               bg-white/5 backdrop-blur-md border border-white/20 
               hover:bg-white/20 transition-all duration-300"
      >
        {/* Icon search */}
        <div className="w-9 h-9 flex items-center justify-center bg-sky-500 text-white rounded-full 
                    hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>

        {/* Text input */}
        <input
          type="text"
          placeholder="Search city here..."
          className="outline-none text-white placeholder:text-gray-200 
          bg-transparent w-[750px]"
        />
      </div>
    </section>


  )
}

export default Hero