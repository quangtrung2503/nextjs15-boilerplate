import React from "react";
import Common, { default as CommonStyles } from "@/components/common";
import RatingBar from "./RatingBar";
import CommonIcons from "@/components/CommonIcons";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { SubmitHandler, useForm } from "react-hook-form";
import FeedbackItem from "./FeedbackItem";
import SelectField from "@/components/customReactFormField/SelectField";
import { useTranslations } from "next-intl";
import Divider from "@/components/common/Divider";
import { CustomerReview, Stats } from "@/services/modules/tour/interfaces/tour";
import { SelectChangeEvent } from "@mui/material";
import { rateData } from "../rateData";

type Props = {
  feedbacks?: CustomerReview[];
  stats?: Stats;
  onLoadMore: () => void;
  onChangeFilter: (value: FeedbackFilter) => void
  hasMore: boolean;
};

interface FeedbackFilter {
  recommend: string;
  travelType: string;
  rating: number;
  textSearch: string;
}
const Feedback: React.FC<Props> = (props: Props) => {
  //!Props 
  const { feedbacks, stats, onLoadMore, hasMore, onChangeFilter } = props ?? {};
  //!Hook
  const t = useTranslations("feedback");
  const { handleSubmit, control, watch } = useForm<FeedbackFilter>({
    defaultValues: {
      recommend: "",
      travelType: "",
      textSearch: "",
    },
  });

  //! Function
  const onSelectRatingValue = () => {
    const values = watch()
    onChangeFilter(values)
  }
  return (
    <CommonStyles.Box>
      {/* Heading Review */}
      <CommonStyles.Typography type="size22Weight700">
        {t("title")}
      </CommonStyles.Typography>
      <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-5">
        {/* Rating */}
        <CommonStyles.Box className="tw-flex tw-justify-between">
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-2">
            <CommonStyles.Box className="tw-flex tw-items-end tw-gap-3">
              <CommonStyles.Typography
                type="size48Weight900"
                className="tw-leading-tight tw-text-accent_gray_dark"
              >
                {stats?.avgRating}
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size23Weight300"
                className="tw-text-accent_gray_500"
              >
                {`${stats?.totalReviews} ${t("reviews")}`}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Rating
              readOnly
              classNameIcon="tw-text-[50px]"
              valueTable={stats?.avgRating}
            />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-w-[380px] tw-flex tw-flex-col tw-gap-2">
            <RatingBar title={t('guide')} rating={stats?.avgRatingGuide || 0} />
            <RatingBar
              title={t('transportation')}
              rating={stats?.avgRatingTransportation || 0}
            />
            <RatingBar
              title={t('valueForMoney')}
              rating={stats?.avgRatingValueOfMoney || 0}
            />
            <RatingBar title={t('safety')} rating={stats?.avgRatingSafety || 0} />
          </CommonStyles.Box>
        </CommonStyles.Box>
        {/* Feedback Filter */}
        <CommonStyles.Box className="tw-flex tw-gap-5 tw-items-center tw-bg-[#16527D14] tw-border-solid tw-border-2 tw-border-[#16527D14] tw-px-10 tw-py-5 tw-rounded-sm">
          <CommonStyles.Typography
            type="size15Weight600"
            className="tw-flex tw-items-center tw-gap-2"
          >
            <CommonIcons.FilterMui
              color="var(--accent-gray-dark)"
              className="tw-font-bold"
            />
            {t("filter")}:
          </CommonStyles.Typography>
          <form
            className="tw-flex tw-gap-4 tw-flex-1 tw-bg-background tw-rounded tw-shadow-md"
          >
            <RHFField
              name="rating"
              control={control}
              sx={{
                fieldSet: {
                  border: "none",
                },
              }}
              options={rateData(t)}
              placeholder={t("ratingPlaceholder")}
              component={SelectField}
              onChange={() => onSelectRatingValue()}
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-basis-1/2"
            />
            {/* <InputField/> */}
          </form>

        </CommonStyles.Box>
        {/* Feedback */}
        {feedbacks?.map((feedback, index) => (
          <CommonStyles.Box key={index}>
            <FeedbackItem items={feedback} />
            <Divider />
          </CommonStyles.Box>
        ))}
        {hasMore && (
          <Common.CommonButton
            label={t("viewMoreComment")}
            colorBtn="outlined"
            className="tw-pt-5 tw-pb-3 tw-text-center tw-text-primary tw-font-bold tw-underline tw-border-transparent active:tw-bg-transparent hover:tw-bg-red focus:tw-bg-transparent"
            variant="outlined"
            onClick={onLoadMore}
          />
        )}
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Feedback;