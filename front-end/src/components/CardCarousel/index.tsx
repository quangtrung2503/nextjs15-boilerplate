import React, { useRef, useState, useEffect } from "react";
import { Container } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import CardGridItem, { CardGridItemProps } from "@/components/Card/CardGirdItem";
import { twMerge } from "tailwind-merge";
type Props = {
  data: CardGridItemProps[];
  title?: React.ReactNode;
  classNameContainerHeading?: string;
};
const CardCarousel: React.FC<Props> = ({
  title,
  data,
  classNameContainerHeading,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };
  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(Math.abs(scrollLeft + clientWidth - scrollWidth) <= 1);
    }
  };
  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
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
        debouncedCheckScrollPosition,
      );
    };
  }, []);

  // Check if there are more than 4 slides
  const showArrows = data.length > 3;

  return (
    <CommonStyles.Box className="tw-flex tw-flex-col tw-w-full">
      <Container
        className={twMerge(
          "tw-flex tw-items-center tw-justify-between",
          classNameContainerHeading,
        )}
      >
        <CommonStyles.Box>{title}</CommonStyles.Box>
        {showArrows && ( // Only show arrows if there are more than 4 slides
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-5">
            <CommonStyles.Box
              className={`tw-rounded-full tw-w-[50px] tw-aspect-square tw-flex tw-items-center tw-justify-center ${isAtStart
                ? "tw-border-secondary tw-shadow-direction_carousel tw-cursor-not-allowed tw-border-[1px] tw-border-solid"
                : "tw-cursor-pointer tw-shadow-direction_carousel tw-bg-secondary"
                }`}
              onClick={!isAtStart ? handleScrollLeft : undefined}
            >
              <CommonIcons.LeftDirection />
            </CommonStyles.Box>
            <CommonStyles.Box
              className={`tw-rounded-full tw-w-[50px] tw-aspect-square tw-flex tw-items-center tw-justify-center ${isAtEnd
                ? "tw-border-secondary tw-shadow-direction_carousel tw-cursor-not-allowed tw-border-[1px] tw-border-solid"
                : "tw-cursor-pointer tw-shadow-direction_carousel tw-bg-secondary"
                }`}
              onClick={!isAtEnd ? handleScrollRight : undefined}
            >
              <CommonIcons.RightDirection />
            </CommonStyles.Box>
          </CommonStyles.Box>
        )}
      </Container>
      <CommonStyles.Box
        className="tw-overflow-auto scrollbar-hide tw-w-full "
        ref={scrollContainerRef}
      >
        <CommonStyles.Box className="tw-flex tw-gap-5 tw-w-fit tw-py-5">
          {data.map((item, index) => (
            <CommonStyles.Box key={index} className="tw-w-[270px]">
              <CardGridItem
                link={item.link}
                src={item.src}
                title={item.title}
                duration={2}
                transport={item.transport}
                plan={item.plan}
                price={item.price}
                feedback_quantity={item.feedback_quantity}
                feedback_average={item.feedback_average}
              />
            </CommonStyles.Box>
          ))}
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};
export default CardCarousel;