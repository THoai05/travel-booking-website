import Image from 'next/image'
import React from 'react'

const BackgroundSub = () => {
    return (
        <section className="relative w-full h-[300px] overflow-hidden">
            <Image
                src="/background-1-home.png"
                alt="Background"
                width={1200}
                height={1000}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 object-cover"
                priority
            />
        </section>
    )
}

export default BackgroundSub
