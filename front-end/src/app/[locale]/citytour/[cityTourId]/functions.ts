import { CardGridItemProps } from "@/components/Card/CardGirdItem";
import apiUrls from "@/constants/apiUrls";
import { Tour } from "@/services/modules/tour/interfaces/tour";
import { useTranslations } from "next-intl";
import { title } from "process";

const mapTours = (tours: Tour[] | undefined, t: any): CardGridItemProps[] =>
  Array.isArray(tours)
    ? tours.map((item) => ({
        link: `/citytour/${item.slug}`,
        src: `${apiUrls.IMG_URL}/${item.City?.image || ""}`,
        title: item.City?.name || t('unknowCity'),
        duration: item.numberOfHours || 0,
        transport: item.transport || t('unknownTransport'),
        plan: item.package || t('unknownPlan'),
        price: item.price || 0,
        feedback_quantity: item.totalReviews || 0,
        feedback_average: item.averageRating || 0,
      }))
    : [];
//Xử lí hiểu thị UI ở trang Detail Tour - Dấu chấm
const generateHtmlContent = (title: string, content: string): string => {
  return `<p><strong>${title}</strong></p>\n<ul>\n<li>${content}</li></ul>`;
};

export { mapTours, generateHtmlContent };