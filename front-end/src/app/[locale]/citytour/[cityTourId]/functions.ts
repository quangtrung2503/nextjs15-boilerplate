import { CardGridItemProps } from "@/components/Card/CardGirdItem";
import apiUrls from "@/constants/apiUrls";
import { Tour } from "@/services/modules/tour/interfaces/tour";
import { title } from "process";

const mapTours = (tours: Tour[] | undefined): CardGridItemProps[] =>
  Array.isArray(tours)
    ? tours.map((item) => ({
        link: `/citytour/${item.slug}`,
        src: `${apiUrls.IMG_URL}/${item.City?.image || ""}`,
        title: item.City?.name || "Unknown City",
        duration: item.numberOfHours || 0,
        transport: item.transport || "Unknown Transport",
        plan: item.package || "Unknown Plan",
        price: item.price || 0,
        feedback_quantity: item.totalReviews || 0,
        feedback_average: item.averageRating || 0,
      }))
    : [];

const generateHtmlContent = (title: string, content: string): string => {
  return `<p><strong>${title}</strong></p>\n<ul>\n<li>${content}</li></ul>`;
};

export { mapTours, generateHtmlContent };