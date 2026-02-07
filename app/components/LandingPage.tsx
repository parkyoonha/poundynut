import React, { useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

// Recipe data for popup
const recipeData = [
  {
    id: 1,
    title: '플레이버 버터',
    cooktime: '5min',
    ingredients: '과일잼(망고 추천)\n버터\n\n가루류 1t(커피/녹차/얼그레이 추천)\n메이플시럽 1T\n버터 100g',
    steps: '1. 과일잼을 준비해주세요\n(가루류는 메이플시럽과 섞어줘요)\n2. 해동된 버터를 유산지에 싸서 용기에 넣고\n전자렌지에 15초 내외로 데워주세요\n3. 잼/시럽에 녹인 가루를 버터와 섞어주세요\n4. 완성된 플레이버버터를 기호에 맞게 빵에 스프레드',
  },
  {
    id: 2,
    title: '사과 샌드위치',
    cooktime: '5min',
    ingredients: '사과 1/2개\n꿀 1T\n바질페스토 1T\n크림치즈 1T',
    steps: '1. 얇게 썬 사과를 빵 위에 올려주세요\n2. 꿀을 뿌려주세요\n3. 크림치즈와 바질페스토를 얹어주세요',
  },
  {
    id: 3,
    title: '크림치즈바질토마토',
    cooktime: '5min',
    ingredients: '방울토마토 3-4개/꿀 1T\n크림치즈 1T\n바질페스토 1t',
    steps: '1. 바질페스토를 빵에 스프레드\n2. 그 위에 크림치즈 스프레드\n3. 꿀에 버무린 잘게 썬 방울토마토를 얹어주세요.',
  },
  {
    id: 4,
    title: '잠봉뵈르',
    cooktime: '5min',
    ingredients: '잠봉햄\n버터 1T\n시럽 1T/마요네즈 1T\n얇게 썬 양파 1/3',
    steps: '1. 버터를 빵에 스프레드해주세요.\n2. 마요네즈,시럽,양파를 섞어 버터 위에 얹어주세요\n3. 잠봉햄을 얹어주세요',
  },
  {
    id: 5,
    title: '버섯 샌드위치',
    cooktime: '5min',
    ingredients: '버섯/소금 한꼬집\n버터 1T\n시럽 1T/마요네즈 1T\n얇게 썬 양파 1/3',
    steps: '1. 버섯을 썰어서 소금간을 해 볶아주세요\n2. 마요네즈와 시럽을 섞고 얇게 썬 양파와 섞어주세요\n3. 빵에 버터를 바르고 양파-버섯 순으로 얹어주세요',
  },
];

// Images from Unsplash (unused but kept for reference)
// const IMG_MEAL = "https://images.unsplash.com/photo-1684248182045-e34f0ad5559d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// Local Video Paths
const VID_SLIDE_1 = "/KakaoTalk_20260203_173820482.mp4";
const VID_SLIDE_2 = "/KakaoTalk_20250822_154744133.mp4";
const VID_SLIDE_3 = "/20250822_1526_Almond Mixture Creation_simple_compose_01k387a8xkfqpt7f8tbx7f2nhv.mp4";

// Fallback/Sample Videos (Mixkit) - Uncomment these to see video in the preview if you don't have local files yet
// const VID_SLIDE_1 = "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-bread-in-the-oven-4293-large.mp4";
// const VID_SLIDE_2 = "https://assets.mixkit.co/videos/preview/mixkit-baker-slicing-whole-grain-bread-4290-large.mp4";
// const VID_SLIDE_3 = "https://assets.mixkit.co/videos/preview/mixkit-fresh-bread-loaves-on-a-bakery-shelf-4288-large.mp4";

const LandingPage: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, duration: 20, axis: 'y', watchDrag: false });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const section7WrapperRef = useRef<HTMLDivElement>(null);
  const section5WrapperRef = useRef<HTMLDivElement>(null);
  const section6WrapperRef = useRef<HTMLDivElement>(null);
  const [section6ScrollIndex, setSection6ScrollIndex] = React.useState(0);
  const [section5TextOffset, setSection5TextOffset] = React.useState(235);
  const [section6BarProgress, setSection6BarProgress] = React.useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipeData[0] | null>(null);
  const [centeredVideoIndex, setCenteredVideoIndex] = useState(0);
  const videoScrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Handle scroll-based Section 7 carousel navigation (sticky scroll)
  React.useEffect(() => {
    const wrapper = section7WrapperRef.current;
    if (!wrapper || !emblaApi) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = wrapperHeight - viewportHeight;

      // Calculate how far we've scrolled into the wrapper
      const scrollProgress = -rect.top / scrollableDistance;

      // Map scroll progress to slide index (0, 1, 2 for 3 slides)
      const totalSlides = emblaApi.scrollSnapList().length;
      const newIndex = Math.min(totalSlides - 1, Math.max(0, Math.floor(scrollProgress * totalSlides)));

      if (newIndex !== selectedIndex) {
        emblaApi.scrollTo(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [emblaApi, selectedIndex]);

  // Handle scroll-based Section 5 text animation (sticky scroll)
  React.useEffect(() => {
    const wrapper = section5WrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = wrapperHeight - viewportHeight;

      // Calculate how far we've scrolled into the wrapper
      const scrollProgress = -rect.top / scrollableDistance;

      // Map scroll progress to index (0-3), giving last item more time
      // 0-20%: index 0, 20-40%: index 1, 40-60%: index 2, 60-100%: index 3
      let newIndex = 0;
      if (scrollProgress >= 0.6) newIndex = 3;
      else if (scrollProgress >= 0.4) newIndex = 2;
      else if (scrollProgress >= 0.2) newIndex = 1;

      setSection6ScrollIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle responsive text offset for Section 5
  React.useEffect(() => {
    const updateOffset = () => {
      const isMobile = window.innerWidth < 900;
      setSection5TextOffset(isMobile ? 180 : 235);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);

    return () => {
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  // Handle scroll-based Section 6 bar animation (sticky scroll)
  React.useEffect(() => {
    const wrapper = section6WrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = wrapperHeight - viewportHeight;

      // Calculate scroll progress (0 to 1)
      const scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));

      setSection6BarProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle video scroll snap and play/pause
  React.useEffect(() => {
    const container = videoScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      videoRefs.current.forEach((video, index) => {
        if (video) {
          const rect = video.getBoundingClientRect();
          const videoCenter = rect.left + rect.width / 2;
          const distance = Math.abs(containerCenter - videoCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setCenteredVideoIndex(closestIndex);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Play/pause videos based on centered index (mobile) or play all (desktop)
  React.useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (isDesktop) {
          // Desktop: play all videos
          video.play().catch(() => {});
        } else {
          // Mobile: only play centered video
          if (index === centeredVideoIndex) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      }
    });
  }, [centeredVideoIndex]);

  // Desktop: ensure all videos play on mount and resize
  React.useEffect(() => {
    const playAllOnDesktop = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      if (isDesktop) {
        videoRefs.current.forEach((video) => {
          if (video) {
            video.play().catch(() => {});
          }
        });
      }
    };

    // Initial play after a short delay to ensure videos are loaded
    const timer = setTimeout(playAllOnDesktop, 500);

    // Listen for resize
    window.addEventListener('resize', playAllOnDesktop);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', playAllOnDesktop);
    };
  }, []);

  const slides = [
    {
      img: "/KakaoTalk_20251025_114940779.webp",
      video: VID_SLIDE_1,
      text: "day1",
      review: "almondbread<br/>tomato<br/>greekyogurt<br/>eggs",

    },
    {
      img: "/KakaoTalk_20251025_114940779_01.webp",
      video: VID_SLIDE_2,
      text: "day2",
      review: "almondbread<br/>friedegg<br/>lettuce<br/>tomato",

    },
    {
      img: "/review2.webp",
      video: VID_SLIDE_3,
      text: "day3",
      review: "almondbread<br/>penutbutter<br/>celery",

    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#333333] font-sans font-normal selection:bg-gray-300 scroll-smooth overflow-x-clip">
      <div className="w-full max-w-[1920px] mx-auto bg-white overflow-visible">
        
        {/* Section 1 - h1, h2, Image */}
        <section className="relative h-dvh border-b-0 bg-white flex flex-col overflow-visible pb-[1cm]">
          <div className="flex flex-col px-4 md:pl-[1cm] md:pr-0 pt-4 md:pt-[0cm] overflow-visible">
            <div className="flex flex-col md:flex-row items-start overflow-visible">
              {/* h1 */}
              <div className="w-full md:w-1/2 order-1 md:order-1">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2.2 }}
                  className="text-[30px] md:text-[38px] lg:text-[50px] xl:text-[55px] font-semibold lowercase text-gray-900 tracking-tight font-geist-gothic leading-none mt-0.5 md:mt-[0.5cm] mb-10 md:mb-0"
                >
                  poundynut
                </motion.h1>
              </div>

            

              {/* 모바일용 h2 - 이미지 상단 */}
              <div className="w-full order-2 md:hidden mt-0 px-0">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full text-[20px] font-medium text-gray-900 leading-6 font-geist-gothic text-right mt-0"
                >
                  whole almond baked for <br/>better dietary habits.
                </motion.h2>
              </div>
              {/* Image - absolute positioned to overflow into Section 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0 }}
                className="w-[calc(100%+2rem)] -mx-4 md:mx-0 md:absolute md:right-0 md:top-0 md:w-[55%] h-[80vh] md:h-[110vh] mt-4 md:mt-0 order-3 md:order-2 z-20"
              >
                <div className="w-full h-full overflow-hidden">
                  <ImageWithFallback
                    src="/ww.webp"
                    alt="Almond bread"
                    className="w-full h-full object-cover scale-160 md:scale-150 -translate-y-10 md:-translate-y-25 translate-x-20 md:translate-x-35"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* h2 - 섹션 하단 배치 (데스크톱) */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8}}
            className="hidden md:block absolute bottom-[1cm] left-[1cm] w-[35%] text-[34px] lg:text-[42px] xl:text-[35px] font-medium text-gray-900 leading-[1.2] font-geist-gothic z-30"
          >
            whole almond baked for <br/>better dietary habits.
          </motion.h2>
        </section>

        {/* Section 2 - p, Videos */}
        <section className="relative h-auto border-b-0 bg-transparent flex flex-col py-12 pt-[12vw] md:pt-[35vh] pb-[15vw] md:pb-50">
          {/* p text */}
          <div className="px-4 md:px-[0vw]">
            <div className="md:max-w-[1038px] md:mx-auto flex justify-between items-start">
              <motion.a
                href="https://smartstore.naver.com/poundynut"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="group flex items-center gap-1 text-[9px] md:text-[12px] font-geist-gothic text-gray-600 hover:text-black transition-colors"
              >
                Naver Smartstore
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-[9px] md:text-[11px] text-gray-900 leading-normal font-semibold"
                style={{ fontFamily: "'Gothic A1', sans-serif" }}
              >
               
operation : 9:00-17:00
              </motion.p>
            </div>
          </div>

          {/* Videos */}
          <div
            ref={videoScrollRef}
            className="overflow-x-auto scrollbar-hide mt-[20vw] md:mt-30 snap-x snap-mandatory md:snap-none md:overflow-visible"
          >
            <div className="flex flex-row gap-6 md:gap-6 items-center md:justify-center px-[20vw] md:px-[7.81vw] w-max md:w-full">
              {[VID_SLIDE_1, VID_SLIDE_2, VID_SLIDE_3].map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-[60vw] flex-shrink-0 md:flex-shrink md:w-[335px] snap-center"
                >
                  <div className="w-full aspect-square overflow-hidden relative bg-gray-100">
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: index === 0 ? 'saturate(1.18) contrast(1.0) brightness(1.0)' : index === 2 ? 'saturate(1.0) contrast(1.0) brightness(1.0)' : 'saturate(1.0) contrast(1.15) brightness(1.1)' }}
                      src={video}
                      muted
                      loop
                      playsInline
                      onTimeUpdate={index === 2 ? (e) => {
                        const video = e.currentTarget;
                        if (video.currentTime >= 3) {
                          video.currentTime = 0;
                        }
                      } : undefined}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 - Image Gallery */}
        <section className="relative h-auto border-b-0 bg-white">
          <div className="px-4 md:px-[4vw] pt-12 pb-40 md:py-24">
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-[1.5rem] md:text-[2.6rem] font-geist-gothic font-medium text-gray-900 mb-8 md:mb-12 leading-tight"
            >
              Try these recieps<br/>
            </motion.h2>

            {/* Desktop Row 1 */}
            <div className="hidden md:flex flex-row gap-[3.13vw] mb-[2.92vw] h-[34vw]">
              {/* Left: 3:2 horizontal rectangle */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex-[2.12] h-full bg-gray-200 overflow-hidden relative group cursor-pointer"
              >
                
                <img src="/gg2.webp" alt="Gallery image 1" className="w-full h-full object-cover" />
                <span className="absolute bottom-4 right-4 z-10 text-sm text-black font-semibold group-hover:opacity-0 transition-opacity duration-300">flavor butter spread</span>
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-row items-start justify-start gap-27 px-[1.5cm] py-[2cm] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col space-y-5">
                    <span className="text-black text-[1.6rem] group-hover:text-[1.75rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>플레이버 버터</span>
                    <span className="text-black text-[0.875rem] group-hover:text-[1.1rem] font-medium leading-tight !-mt-3 transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>cooktime<br/>
5min</span>
                  </div>
                  <div className="flex flex-col space-y-5 text-left">
                    <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>과일잼(망고 추천)<br/>
버터<br/><br/>
가루류 1t(커피/녹차/얼그레이 추천)<br/>
메이플시럽 1T<br/>
버터 100g</span>
                    <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>1. 과일잼을 준비해주세요<br/>
(가루류는 메이플시럽과 섞어줘요)<br/>
2. 해동된 버터를 유산지에 싸서 용기에 넣고 <br/>
전자렌지에 15초 내외로 데워주세요<br/>
3.잼/시럽에 녹인 가루를 버터와 섞어주세요<br/>
3.완성된 플레이버버터를 기호에 맞게 빵에 스프레드</span>
                  </div>
                </div>
              </motion.div>
              {/* Right: vertical rectangle */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex-1 h-full bg-gray-200 overflow-hidden relative group cursor-pointer"
              >
                <img src="/ds.webp" alt="Gallery image 5" className="w-full h-full object-cover scale-130 translate-y-0 translate-x-10" />
                <span className="absolute bottom-4 right-4 z-10 text-sm text-black font-semibold group-hover:opacity-0 transition-opacity duration-300">mushroom sandwich</span>
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-start justify-start px-[1.5cm] py-[2cm] space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-black text-[1.6rem] group-hover:text-[1.75rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>버섯 샌드위치</span>
                  <span className="text-black text-[0.875rem] group-hover:text-[1.1rem] font-medium leading-tight !-mt-3 transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>cooktime<br/>
5min</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>버섯/소금 한꼬집<br/>
버터 1T<br/>
시럽 1T/마요네즈 1T<br/>
얇게 썬 양파1/3<br/>
</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>1.버섯을 썰어서 소금간을 해 볶아주세요<br/>
2. 마요네즈와 시럽을 섞고 얇게 썬 양파와
섞어주세요<br/>
3.빵에 버터를 바르고 양파-버섯 순으로<br/>
얹어주세요</span>
                
                </div>
              </motion.div>
            </div>

            {/* Desktop Row 2 */}
            <div className="hidden md:flex flex-row gap-[3.13vw] mb-[2.92vw] h-[34vw]">
              {/* Image 3 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex-1 h-full bg-gray-200 overflow-hidden relative group cursor-pointer"
              >
                <img src="/uu.webp" alt="Gallery image 4" className="w-full h-full object-cover scale-160 -translate-y-10 translate-x-10" />
                <span className="absolute bottom-4 right-4 z-10 text-sm text-black font-semibold group-hover:opacity-0 transition-opacity duration-300">Jambon-Beurre</span>
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-start justify-start px-[1.5cm] py-[2cm] space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-black text-[1.6rem] group-hover:text-[1.75rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>잠봉뵈르</span>
                  <span className="text-black text-[0.875rem] group-hover:text-[1.1rem] font-medium leading-tight !-mt-3 transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>cooktime<br/>
5min</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>잠봉햄<br/>
버터 1T<br/>
시럽 1T/마요네즈 1T<br/>
얇게 썬 양파1/3</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>1. 버터를 빵에 스프레드해주세요.<br/>
2.마요네즈,시럽,양파를 섞어 버터 위에 얹어주세요<br/>
3.잠봉햄을 얹어주세요</span>
                
                </div>
              </motion.div>
              {/* Image 4 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex-1 h-full bg-gray-200 overflow-hidden relative group cursor-pointer"
              >
                <img src="/gs.webp" alt="Gallery image 3" className="w-full h-full object-cover scale-105 translate-x-2 translate-y-3" />
                
                <span className="absolute bottom-4 right-4 z-10 text-sm text-white font-semibold group-hover:opacity-0 transition-opacity duration-300">creamcheese basil tomato</span>
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-start justify-start px-[1.5cm] py-[2cm] space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-black text-[1.6rem] group-hover:text-[1.75rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>크림치즈바질토마토</span>
                  <span className="text-black text-[0.875rem] group-hover:text-[1.1rem] font-medium leading-tight !-mt-3 transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>cooktime<br/>
5min</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>방울토마토 3-4개/꿀 1T<br/>
크림치즈 1T<br/>
바질페스토 1t</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>1. 바질페스토를 빵에 스프레드<br/>
2. 그 위에 크림치즈 스프레드<br/>
3.꿀에 버무린 잘게 썬 방울토마토를 얹어주세요.</span>
                </div>
              </motion.div>
              {/* Image 5 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex-1 h-full bg-gray-200 overflow-hidden relative group cursor-pointer"
              >
               <img src="/tt.webp" alt="Gallery image 2" className="w-full h-full object-cover scale-120 -translate-x-10" />
               <span className="absolute bottom-4 right-4 z-10 text-sm text-white font-semibold group-hover:opacity-0 transition-opacity duration-300">apple sandwich</span>
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-start justify-start px-[1.5cm] py-[2cm] space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-black text-[1.6rem] group-hover:text-[1.75rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>사과 샌드위치</span>
                  <span className="text-black text-[0.875rem] group-hover:text-[1.1rem] font-medium leading-tight !-mt-3 transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>cooktime<br/>
5min</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>사과 1/2개<br/>
꿀 1T<br/>
바질페스토 1T<br/>
크림치즈 1T</span>
                  <span className="text-black text-[0.8rem] group-hover:text-[0.875rem] font-medium transition-all duration-300" style={{ fontFamily: "'Gothic A1', sans-serif" }}>1. 얇게 썬 사과를 빵 위에 올려주세요<br/>
2. 꿀을 뿌려주세요<br/>
3.크림치즈와 바질페스토를 얹어주세요</span>
                </div>
              </motion.div>
            </div>

            {/* Mobile Row 1 - Image 1 alone */}
            <div className="flex md:hidden mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-[400px] bg-gray-200 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedRecipe(recipeData[0])}
              >
                <img src="/gg.webp" alt="Gallery image 1" className="w-full h-full object-cover scale-150 translate-x-10 -translate-y-10" />
                <span className="absolute bottom-2 right-4 z-10 text-sm text-black font-semibold flex items-center gap-1">flavor butter spread <ArrowRight className="w-4 h-4" /></span>
              </motion.div>
            </div>

            {/* Mobile Row 2 - Image 2 */}
            <div className="flex md:hidden mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-[400px] bg-gray-200 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedRecipe(recipeData[4])}
              >
                <img src="/ds.webp" alt="Gallery image 5" className="w-full h-full object-cover scale-130 translate-y-0 translate-x-10" />
                <span className="absolute bottom-2 right-4 z-10 text-sm text-black font-semibold flex items-center gap-1">mushroom sandwich<ArrowRight className="w-4 h-4" /></span>
              </motion.div>
            </div>

            {/* Mobile Row 3 - Image 3 */}
            <div className="flex md:hidden mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-[400px] bg-gray-200 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedRecipe(recipeData[3])}
              >
                <img src="/uu.webp" alt="Gallery image 4" className="w-full h-full object-cover scale-160 -translate-y-6 translate-x-10" />
                <span className="absolute bottom-2 right-4 z-10 text-sm text-black font-semibold flex items-center gap-1">Jambon-Beurre <ArrowRight className="w-4 h-4" /></span>
              </motion.div>
            </div>

            {/* Mobile Row 4 - Image 4 */}
            <div className="flex md:hidden mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-[400px] bg-gray-200 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedRecipe(recipeData[2])}
              >
                <img src="/gs.webp" alt="Gallery image 3" className="w-full h-full object-cover scale-100 translate-x-0 translate-y-0" />
                <span className="absolute bottom-2 right-4 z-10 text-sm text-white font-semibold flex items-center gap-1">creamcheese basil tomato <ArrowRight className="w-4 h-4" /></span>
              </motion.div>
            </div>

            {/* Mobile Row 5 - Image 5 */}
            <div className="flex md:hidden mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-[400px] bg-gray-200 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedRecipe(recipeData[1])}
              >
                <img src="/tt.webp" alt="Gallery image 2" className="w-full h-full object-cover scale-120 -translate-x-10" />
                
                <span className="absolute bottom-2 right-4 z-10 text-sm text-white font-semibold flex items-center gap-1"> apple sandwich <ArrowRight className="w-4 h-4" /></span>
              </motion.div>
            </div>
          </div>

        </section>



     

        {/* Section 4 - Story */}
        <section className="h-auto border-b-0 items-center bg-[#ffffff]">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full px-4 md:px-[7.81vw] py-12 md:py-24 items-start">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-[34px] md:text-[4rem] font-geist-gothic font-medium leading-[1.1] md:leading-[1.0] word-keep-all text-gray-900 py-0 md:py-0">
                I want to <br/>share my diet<br/>experience.
              </h2>
            </motion.div>

            {/* Supporting Text */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full md:w-1/2 pt-13 md:pt-0"
            >
              <div className="text-[12px] md:text-xl text-black space-y-3 md:space-y-4 leading-normal md:leading-relaxed text-justify" style={{ fontFamily: "'Gothic A1', sans-serif", fontWeight: 500 }}>
                <p>
                  한때 우리는 밀가루를 너무도 자연스럽게 먹고 있었습니다.<br/>아침의 토스트, 바쁜 날의 간편한 한 끼,<br/>일상 곳곳에 빵은 늘 함께 있었죠.<br/>익숙하고 맛있었기에,<br/>그 선택을 의심해본 적은 거의 없었습니다.
                </p>
                <p>
                  하지만 어느 순간부터<br/>몸이 보내는 작은 신호들이 느껴지기 시작했습니다.<br/>크게 드러나지는 않지만 분명히 존재하는 불편함,<br/>가볍게 넘기기엔 자꾸 반복되던 감각들.<br/>그 신호들은 “조금 다른 선택이 필요하다”는<br/>조용한 메시지처럼 다가왔습니다.
                </p>
                <p className="font-medium">
                  그렇다고 빵을 포기하고 싶지는 않았습니다.<br/>우리는 ‘참아야 하는 식단’보다<br/>‘오래 지속할 수 있는 방식’을 원했기 때문입니다.
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="space-y-3 md:space-y-4 pt-10 md:pt-20"
                >
                  <p>
                    그래서 질문은 이렇게 바뀌었습니다.<br/>빵을 좋아하는 삶을 유지하면서도,<br/>몸에는 더 편안한 선택은 없을까?<br/>그 질문에서 이 브랜드는 시작되었습니다.
                  </p>
                  <p>
                    여러 고민과 시도 끝에 주목한 재료가 바로 아몬드였습니다.<br/>밀가루를 대체하는 선택이면서도,<br/>맛과 식사의 즐거움을 포기하지 않을 수 있는 가능성.<br/>그 가능성을 바탕으로<br/>우리는 아몬드로 만든 식빵을 만들기 시작했습니다.
                  </p>
                  <p>
                    이 빵은 극단적인 대안이 아닙니다.<br/>모든 사람에게 완벽한 해답이 되겠다고 말하지도 않습니다.<br/>다만 밀가루가 잘 맞지 않거나,<br/>섭취를 조금 줄여보고 싶다고 느끼는 순간이 있는 분들에게<br/>부담 없이 다가갈 수 있는 선택지가 되기를 바랐습니다.
                  </p>
                </motion.div>
                
              </div>
            </motion.div>
          </div>
        </section>
        
 

 {/* Section 5 - Ingredients & Chart (Sticky Scroll) */}
        <div ref={section6WrapperRef} className="h-[200vh]">
          <section className="sticky top-0 relative h-screen px-0 pt-[0.5cm] md:pt-[2cm] pb-0 border-b-0 flex items-end">
            {/* Text Layer - Above Almond Bar */}
            <div className="absolute left-[17%] md:left-[13%] -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-3xl md:text-6xl space-y-1 md:space-y-2 text-gray-800 font-geist font-semibold leading-tight absolute bottom-full left-[50px] -translate-x-1/4 mb-30 md:mb-20 whitespace-nowrap"
              >
                <p>more than 80%</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-[16px] md:text-4xl space-y-1 md:space-y-2 text-gray-800 font-gothic font-medium leading-tight"
              >
                <p>단백질 9g,<br/> 식이섬유 4g,<br/>당류 1g</p>
              </motion.div>
            </div>

            {/* Chart Layer - Full Width */}
            <div className="w-[100%] h-full mx-auto">
              <div className="flex flex-row gap-0 w-full h-full items-end">
                <div className="flex-[1.5] md:flex-1 h-full flex flex-col items-center">
                  <div className="w-full flex-1 relative flex items-end">
                    <div
                      className="w-full bg-[#b8bcc4] transition-all duration-300"
                      style={{ height: `${60 + section6BarProgress * 15}%` }}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 z-20">
                      <span className="text-[13px] md:text-[calc(16px+(1920px-100vw)*0.01)] font-bold text-gray-800 font-gothic">아몬드</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col items-center">
                  <div className="w-full flex-1 relative flex items-end">
                    <div
                      className="w-full bg-gray-100 transition-all duration-300"
                      style={{ height: `${1 + section6BarProgress * 1.5}%` }}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 z-20">
                      <span className="text-[12px] md:text-[calc(16px+(1920px-100vw)*0.01)] font-bold text-gray-800 font-gothic">천일염</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col items-center">
                  <div className="w-full flex-1 relative flex items-end">
                    <div
                      className="w-full bg-gray-200 transition-all duration-300"
                      style={{ height: `${10 + section6BarProgress * 10}%` }}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 z-20">
                      <span className="text-[12px] md:text-[calc(16px+(1920px-100vw)*0.01)] font-bold text-gray-800 font-gothic">아마씨</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col items-center">
                  <div className="w-full flex-1 relative flex items-end">
                    <div
                      className="w-full bg-gray-300 transition-all duration-300"
                      style={{ height: `${20 + section6BarProgress * 12}%` }}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 z-20">
                      <span className="text-[12px] md:text-[calc(16px+(1920px-100vw)*0.01)] font-bold text-gray-800 font-gothic">계란</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

{/* Section 7 - Image Carousel (Sticky Scroll) */}
        <div ref={section7WrapperRef} className="h-[200vh]">
          <section
            className="sticky top-0 flex h-screen border-b-0 items-start min-[800px]:items-center px-4 min-[800px]:px-[7.81vw] pt-[5vh] min-[800px]:pt-0"
          >
          <div className="flex flex-col min-[800px]:flex-row min-[800px]:items-start w-full h-full min-[800px]:h-auto gap-0 min-[800px]:gap-16">
            {/* Left: Title + Supporting Text */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-1/4 min-[800px]:h-auto min-[800px]:w-[45%] flex flex-col items-end min-[800px]:items-start justify-center min-[800px]:justify-start min-[800px]:pt-[5vh] text-right min-[800px]:text-left"
            >
              <h2 className="text-[12px] min-[800px]:text-[14px] font-geist-gothic font-medium text-gray-900 leading-tight">
                NO 4 INGREDIENTS
              </h2>
              <p
                className="text-[12px] min-[800px]:text-[14px] text-gray-600 leading-relaxed mt-4 min-[800px]:mt-6"
                style={{ fontFamily: "'Gothic A1', sans-serif", fontWeight: 500 }}
              >
               NO 버터<br/>NO 설탕<br/>NO 밀가루<br/>NO 대체당
              </p>
            </motion.div>

            {/* Right: Carousel Group */}
            <div className="w-full h-3/4 min-[800px]:h-auto min-[800px]:w-[80%] min-[800px]:self-center flex flex-col items-start gap-4 min-[800px]:gap-6 pt-25 min-[800px]:pt-0">
              {/* Day Title */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-2xl min-[800px]:text-[clamp(1.5rem,2vw,2.2rem)] font-geist-gothic font-regular text-gray-900">{slides[selectedIndex]?.text}</h3>
                </motion.div>
              </AnimatePresence>

              {/* Image + Review Row */}
              <div className="relative min-[800px]:flex min-[800px]:flex-row min-[800px]:gap-8 min-[800px]:items-start w-full">
                {/* Image Carousel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-[clamp(45%,900px-100vw,75%)] min-[800px]:w-[clamp(55%,calc(120%_-_4vw),90%)]"
                >
                  <div className="w-full aspect-square overflow-hidden" ref={emblaRef}>
                    <div className="flex flex-col h-full gap-4">
                      {slides.map((slide, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                          <div className="h-full overflow-hidden w-full relative bg-gray-100">
                            <img
                              src={slide.img}
                              alt="Almond bread"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Review Text - absolute positioned to top-right of image */}
                <div className="absolute left-0 top-[calc(100%_+_1rem)] w-[40%] min-[800px]:relative min-[800px]:left-auto min-[800px]:top-auto min-[800px]:w-[45%] min-[800px]:pt-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p
                        className="text-xl min-[800px]:text-[clamp(1.5rem,2.1vw,2.3rem)] font-geist-gothic font-regular text-gray-900 leading-[22px] min-[800px]:leading-[clamp(24px,2.5vw,35px)]"
                        dangerouslySetInnerHTML={{ __html: slides[selectedIndex]?.review || '' }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

       {/* Section 8 - Horizontal Scroll Gallery */}
        <section className="h-auto md:h-[1240px] py-12 md:py-30 border-b-0 pt-30 md:pt-30">
          {/* Title */}
          <motion.a
            href="https://smartstore.naver.com/poundynut"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-3xl md:text-[calc(48px+(1920px-100vw)*0.02)] font-geist-gothic font-semibold text-gray-900 mb-10 md:mb-20 px-4 md:px-[150px] flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity"
          >
            store
            <motion.img
              src="/Group 19.svg"
              alt="arrow"
              className="h-6 md:h-8 "
              initial={{ x: 0 }}
              whileInView={{ x: [0, 10, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0 }}
              whileHover={{ x: 10 }}
            />
          </motion.a>

          {/* Horizontal Scroll Container */}
          <div
            className="overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide pl-4 md:pl-[150px] pb-20"
            onMouseDown={(e) => {
              const el = e.currentTarget;
              el.dataset.isDown = 'true';
              el.dataset.startX = String(e.pageX - el.offsetLeft);
              el.dataset.scrollLeft = String(el.scrollLeft);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.dataset.isDown = 'false';
            }}
            onMouseUp={(e) => {
              e.currentTarget.dataset.isDown = 'false';
            }}
            onMouseMove={(e) => {
              const el = e.currentTarget;
              if (el.dataset.isDown !== 'true') return;
              e.preventDefault();
              const x = e.pageX - el.offsetLeft;
              const walk = (x - Number(el.dataset.startX)) * 2;
              el.scrollLeft = Number(el.dataset.scrollLeft) - walk;
            }}
          >
            <div className="flex gap-6 md:gap-[7.29vw] pr-4 md:pr-12" style={{ width: 'max-content' }}>
              {[
                  { src: '/11.webp', label: 'original 오리지널' },
                  { src: '/22.webp', label: 'vegan 비건' },
                  { src: '/33.webp', label: 'nuts 견과류' },
                  { src: '/44.webp', label: 'konjak 곤약' }
                ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="flex flex-col items-start"
                >
                  <span className="text-gray-900 text-xs md:text-[calc(14px+(1920px-100vw)*0.01)] font-semibold font-gothic mb-4 md:mb-6">{item.label}</span>
                  <div className="relative group cursor-pointer overflow-hidden w-[240px] h-[320px] md:w-[410px] md:h-[510px]">
                    {item.src ? (
                      <img src={item.src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">Image {idx + 1}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        

       
          {/* Footer */}
          <div className="mt-12 md:mt-30 px-4 md:px-[150px] pb-8 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
            <div className="flex flex-col gap-2">
              <span className="text-base md:text-[calc(18px+(1920px-100vw)*0.01)] font-semibold font-gothic">poundynut</span>
              <span className="text-[11px] md:text-[calc(13px+(1920px-100vw)*0.008)] text-gray-500 font-gothic leading-5 md:leading-6">대표 | 정유경<br/>contact | yoonha9772@gmail.com<br/>사업자등록번호 | 878-40-00506<br/>주소 | 강원특별자치도 강릉시 남산길 17번길 8</span>
            </div>
            <motion.a
              href="https://smartstore.naver.com/poundynut"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="group flex items-center gap-2 text-sm md:text-[calc(14px+(1920px-100vw)*0.01)] font-geist-gothic text-gray-600 hover:text-black transition-colors"
            >
              Naver Smartstore
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </div>
          <div className="text-[11px] md:text-[calc(13px+(1920px-100vw)*0.008)] mt-8 md:mt-30 px-4 md:px-[150px] pb-8 flex justify-between items-start">© 2025 Poundynut. All rights reserved.</div>
        </section>

      </div>

      {/* Recipe Popup */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold" style={{ fontFamily: "'Gothic A1', sans-serif" }}>
                  {selectedRecipe.title}
                </h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: "'Gothic A1', sans-serif" }}>
                  cooktime: {selectedRecipe.cooktime}
                </p>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Gothic A1', sans-serif" }}>재료</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line" style={{ fontFamily: "'Gothic A1', sans-serif" }}>
                    {selectedRecipe.ingredients}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Gothic A1', sans-serif" }}>만드는 법</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line" style={{ fontFamily: "'Gothic A1', sans-serif" }}>
                    {selectedRecipe.steps}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;