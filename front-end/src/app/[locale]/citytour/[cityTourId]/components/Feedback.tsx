import React from "react";
import { default as CommonStyles } from "@/components/common";
import RatingBar from "./RatingBar";
import CommonIcons from "@/components/CommonIcons";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { SubmitHandler, useForm } from "react-hook-form";
import FeedbackItem from "./FeedbackItem";
import { SelectOption } from "@/interfaces/common";
import SelectField from "@/components/customReactFormField/SelectField";
import InputField from "@/components/customReactFormField/InputField";
import { useTranslations } from "next-intl";

interface FeedbackFilter {
  recommend: string;
  travelType: string;
  rating: number | string;
  textSearch: string;
}
const Feedback = () => {
  const t = useTranslations("feedback")
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
            <CommonIcons.FilterMui color="var(--accent-gray-dark)" />
            {t("filter")}:
          </CommonStyles.Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="tw-flex tw-gap-4 tw-flex-1"
          >
            <RHFField
              name="recommend"
              control={control}
              sx={{
                fieldSet: {
                  border: "none",
                },
              }}
              options={[]}
              placeholder={t("recommendPlaceholder")}
              className="tw-bg-white tw-rounded-sm tw-shadow-select"
              component={SelectField}
            />
            <RHFField
              name="travelType"
              control={control}
              sx={{
                fieldSet: {
                  border: "none",
                },
              }}
              options={[]}
              placeholder={t("travelerTypePlaceholder")}
              className="tw-bg-white tw-rounded-sm tw-shadow-select"
              component={SelectField}
            />
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
            <RHFField
              name="textSearch"
              placeholder={t("searchPlaceholder")}
              control={control}
              sx={{
                fieldSet: {
                  border: "none",
                },
              }}
              className="tw-bg-white tw-rounded-sm tw-shadow-select"
              component={InputField}
            />
            {/* <InputField/> */}
          </form>
        </CommonStyles.Box>
        {/* Feedback */}
        <CommonStyles.Box>
          <FeedbackItem
            avatar={"https://example.com/avatar.jpg"}
            name={"Arlene McCoy"}
            rating={4.3}
            date={"2 October 2012"}
            title={"Good tour, really well organised"}
            content={
              "The tour was very well organised. One minus is that you get completely bombarded with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn't enjoy it."
            }
            isVerified={true}
            helpful={true}
          />
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Feedback;
