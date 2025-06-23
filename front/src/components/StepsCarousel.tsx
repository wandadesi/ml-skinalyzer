import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const steps = [
  {
    title: 'Step 1: Upload Your Photo',
    description:
      'Upload a clear image of your face using your camera or gallery. Supported formats: JPG, JPEG, PNG.',
    image: '/step1.png',
  },
  {
    title: 'Step 2: AI Skin Analysis',
    description:
      'Our AI will scan your face and analyze your skin condition, identifying issues like acne, uneven tone, and pores.',
    image: '/step2.png',
  },
  {
    title: 'Step 3: View Analysis Results',
    description:
      'See which areas of your face have concerns with visual markers and easy-to-understand explanations.',
    image: '/step4.png',
  },
  {
    title: 'Step 4: Product Recommendations',
    description:
      'Get personalized skincare product suggestions tailored to your skin condition and needs.',
    image: '/step5.png',
  },
];

export default function StepsCarousel() {
  return (
    <div className="w-full px-6 mt-2">
      <h2 className="text-2xl text-center font-bold font-playfair text-transparent bg-gradient-to-r from-[#7a422c] to-[#b07252] tracking-wide bg-clip-text mb-8">
        HOW TO USE SKINALYZER
      </h2>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={30}
        className="rounded-xl !pb-14"
      >
        {steps.map((step, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="text-xl font-semibold text-[#7a422c]">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 font-montserrat">
                {step.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
