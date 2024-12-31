import React from "react";
import Common, { default as CommonStyles } from "@/components/common";
import RatingBar from "./RatingBar";
import CommonIcons from "@/components/CommonIcons";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { SubmitHandler, useForm } from "react-hook-form";
import FeedbackItem from "./FeedbackItem";
import { SelectOption } from "@/interfaces/common";
import SelectField from "@/components/customReactFormField/SelectField";
import { useTranslations } from "next-intl";
import Divider from "@/components/common/Divider";

interface FeedbackFilter {
  recommend: string;
  travelType: string;
  rating: number | string;
  textSearch: string;
}
const Feedback = () => {
  const t = useTranslations("feedback");
  const { handleSubmit, control } = useForm<FeedbackFilter>({
    defaultValues: {
      recommend: "",
      travelType: "",
      rating: "",
      textSearch: "",
    },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });
  const onSubmit: SubmitHandler<FeedbackFilter> = async (
    values: FeedbackFilter,
  ) => {
    try {
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
    }
  };
  const onClickLoadMore = () => {};

  const feedbacks = [
    {
      avatar: "https://example.com/avatar.jpg",
      name: "Arlene McCoy",
      rating: 4.3,
      date: "2 October 2012",
      title: "Good tour, really well organised",
      content:
        "The tour was very well organised. One minus is that you get completely bombarded with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn't enjoy it.",
      isVerified: true,
      helpful: true,
    },
    {
      avatar: "https://example.com/avatar.jpg",
      name: "Arlene McCoy",
      rating: 4.3,
      date: "2 October 2012",
      title: "Good tour, really well organised",
      content:
        "The tour was very well organised. One minus is that you get completely bombarded with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn't enjoy it.",
      isVerified: true,
      helpful: true,
    },
    {
      avatar: "https://example.com/avatar.jpg",
      name: "Arlene McCoy",
      rating: 4.3,
      date: "2 October 2012",
      title: "Good tour, really well organised",
      content:
        "The tour was very well organised. One minus is that you get completely bombarded with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn't enjoy it.",
      isVerified: true,
      helpful: true,
    },
  ];

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
                4,30
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size23Weight300"
                className="tw-text-accent_gray_500"
              >
                {`${34} ${t("reviews")}`}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Rating
              readOnly
              classNameIcon="tw-text-[50px]"
              valueTable={4.3}
            />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-w-[380px] tw-flex tw-flex-col tw-gap-2">
            <RatingBar title="Guide" rating={4.8} />
            <RatingBar title="Transportation" rating={3} />
            <RatingBar title="Value for money" rating={4.5} />
            <RatingBar title="Safety" rating={4} />
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
            onSubmit={handleSubmit(onSubmit)}
            className="tw-flex tw-gap-4 tw-flex-1"
          >
            <RHFField
              name="rating"
              control={control}
              sx={{
                fieldSet: {
                  border: "none",
                },
              }}
              options={[]}
              placeholder={t("ratingPlaceholder")}
              className="tw-bg-white tw-rounded-sm tw-shadow-select"
              component={SelectField}
            />
            {/* <InputField/> */}
          </form>
        </CommonStyles.Box>
        {/* Feedback */}
        {feedbacks.map((feedback, index) => (
          <CommonStyles.Box key={index}>
            <FeedbackItem {...feedback} />
            <Divider />
          </CommonStyles.Box>
        ))}
        <Common.CommonButton
          label={t("viewMoreComment")}
          colorBtn="outlined"
          className="tw-pt-5 tw-pb-3 tw-text-center tw-text-primary tw-font-bold tw-underline tw-border-transparent active:tw-bg-transparent hover:tw-bg-red focus:tw-bg-transparent"
          variant="outlined"
          onClick={() => onClickLoadMore()}
        />
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Feedback;