import React, { useRef, useState, useEffect } from "react";
import { Container } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import CardGridItem from "@/components/Card/CardGirdItem";
import Heading from "@/app/[locale]/home/components/Heading";
import { title } from "process";
type Props = {
  data?: [];
  title?: React.ReactNode;
};
const CardCarousel= (props: Props) => {
  const {title, data} = props
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Scroll handler functions
  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -300, // Adjust scroll amount
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: 300, // Adjust scroll amount
      behavior: "smooth",
    });
  };

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // Update button states based on scroll position
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(Math.abs(scrollLeft + clientWidth - scrollWidth) <= 1);
    }
  };

  // Debounce implementation with type safety
  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const debouncedCheckScrollPosition = debounce(checkScrollPosition, 50);

    scrollContainer?.addEventListener("scroll", debouncedCheckScrollPosition);

    checkScrollPosition();

    return () => {
      scrollContainer?.removeEventListener(
        "scroll",
        debouncedCheckScrollPosition
      );
    };
  }, []);

  return (
    <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-5">
      <Container className="tw-flex tw-items-center tw-justify-between">
        <CommonStyles.Box>{title}</CommonStyles.Box>
        <CommonStyles.Box className="tw-flex tw-items-center tw-gap-5">
          <CommonStyles.Box
            className={`tw-rounded-full tw-w-[50px] tw-aspect-square tw-flex tw-items-center tw-justify-center ${
              isAtStart
                ? "tw-border-secondary tw-shadow-direction_carousel tw-cursor-not-allowed tw-border-[1px] tw-border-solid"
                : "tw-cursor-pointer tw-shadow-direction_carousel tw-bg-secondary"
            }`}
            onClick={!isAtStart ? handleScrollLeft : undefined}
          >
            <CommonIcons.LeftDirection />
          </CommonStyles.Box>
          <CommonStyles.Box
            className={`tw-rounded-full tw-w-[50px] tw-aspect-square tw-flex tw-items-center tw-justify-center ${
              isAtEnd
                ? "tw-border-secondary tw-shadow-direction_carousel tw-cursor-not-allowed tw-border-[1px] tw-border-solid"
                : "tw-cursor-pointer tw-shadow-direction_carousel tw-bg-secondary"
            }`}
            onClick={!isAtEnd ? handleScrollRight : undefined}
          >
            <CommonIcons.RightDirection />
          </CommonStyles.Box>
        </CommonStyles.Box>
      </Container>
      <div
        className="tw-overflow-auto scrollbar-hide tw-w-full"
        ref={scrollContainerRef}
      >
        <CommonStyles.Box className="tw-flex tw-gap-3 tw-w-fit tw-px-5">
          {Array(15)
            .fill(null)
            .map((_, index) => (
              <CommonStyles.Box key={index} className="tw-w-[270px]">
                <CardGridItem
                  src="https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg"
                  title="Alaska: Westminster to Greenwich River Thames"
                  duration={2}
                  transport="Transport Facility"
                  plan="Family Plan"
                  price={35}
                  feedback_quantity={500}
                />
              </CommonStyles.Box>
            ))}
        </CommonStyles.Box>
      </div>
    </CommonStyles.Box>
  );
};

export default CardCarousel;
