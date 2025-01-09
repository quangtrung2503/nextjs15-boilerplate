import React, { useRef, useState, useEffect } from "react";
import { Container } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import CardGridItem, { CardGridItemProps } from "@/components/Card/CardGirdItem";
import { twMerge } from "tailwind-merge";
import useGetTourDestinationCustomer from "@/services/modules/tour/hooks/useGetTourDestinationCustomer";
import apiUrls from "@/constants/apiUrls";
type Props = {
  data?: CardGridItemProps[];
  title?: React.ReactNode;
  classNameContainerHeading?: string;
  maxItems?: number
};
const CardCarousel: React.FC<Props> = ({
  title,
  // data,
  classNameContainerHeading,
}) => {
  // props + state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  // hook
  const { data: dataDestination } = useGetTourDestinationCustomer()
  // Function
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Kiểm tra vị trí cuộn
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
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

  // Effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      // Gọi checkScrollPosition khi component render
      checkScrollPosition();

      // Lắng nghe sự kiện scroll để kiểm tra vị trí
      scrollContainer.addEventListener("scroll", checkScrollPosition);
    }

    return () => {
      // Xóa lắng nghe khi unmount
      scrollContainer?.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  useEffect(() => {
    // Kiểm tra vị trí khi dataDestination thay đổi
    checkScrollPosition();
  }, [dataDestination]);


  // Render
  return (
    <CommonStyles.Box className="tw-flex tw-flex-col tw-w-full">
      <Container
        className={twMerge(
          "tw-flex tw-items-center tw-justify-between",
          classNameContainerHeading,
        )}
      >
        <CommonStyles.Box>{title}</CommonStyles.Box>
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
      </Container>
      <CommonStyles.Box
        className="tw-overflow-auto scrollbar-hide tw-w-full "
        ref={scrollContainerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '20px', // khoảng cách giữa các ảnh
        }}
      >
        <CommonStyles.Box className="tw-flex tw-gap-5 tw-py-5 tw-justify-center tw-items-center">
          {dataDestination?.items?.slice(0, dataDestination?.items?.length).map((item, index) => (
            <CommonStyles.Box key={index} className="tw-w-[270px]" style={{ scrollSnapAlign: 'start' }}>
              <CardGridItem
                link=""
                src={`${apiUrls.IMG_URL}/${item.City?.image}` || ""}
                title={item?.City?.description || ""}
                duration={item?.numberOfHours}
                transport={item.transport}
                plan={item.package}
                price={item.price}
                feedback_quantity={item.price}
                feedback_average={item.totalReviews}
              />
            </CommonStyles.Box>
          ))}
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default CardCarousel;