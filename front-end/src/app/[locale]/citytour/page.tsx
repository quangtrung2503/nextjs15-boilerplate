"use client"
import React from 'react'
import { default as CommonStyles } from '@/components/common'
import { Checkbox, Container, FormControlLabel, FormGroup } from '@mui/material'
import RHFField from '@/components/customReactFormField/ReactFormField'
import SelectField from '@/components/customReactFormField/SelectField'
import { SelectOption } from '@/interfaces/common'
import * as Yup from 'yup'
import { useTranslations } from 'next-intl'
import { useNotifications } from '@/helpers/toast'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CommonDatePicker } from '@/components/common/DatePicker'
import { CommonButton } from '@/components/common/Button'
import AccordionMUI from '@/components/common/Accordion'
import CardGridItem from '@/components/Card/CardGirdItem'
import CardListItem from '@/components/Card/CardListItem'
import CardCarousel from '@/components/CardCarousel'
import Gallery from '../home/components/Gallery'
import LatestStories from '../home/components/LatestStories'
import { mocDataCard } from '../home/HomePage'
import { yupResolver } from '@hookform/resolvers/yup'


interface Availability {
  startDate: Date,
  endDate: Date
}
interface Filter {
  filter: string,
}
const CityTourPage = () => {
  const t = useTranslations("cityTour");
  const { showSuccess, showError } = useNotifications();
  const validateSchema = Yup.object().shape({
    startDate: Yup.date()
      .required(t("cityTourDetail.validations.startDateRequire"))
      .typeError(t("cityTourDetail.validations.startDateInvalid"))
      .min(new Date(), t("cityTourDetail.validations.startDateMin")),
    endDate: Yup.date()
      .required(t("cityTourDetail.validations.endDateRequire"))
      .typeError(t("cityTourDetail.validations.endDateInvalid"))
      .min(Yup.ref("startDate"), t("cityTourDetail.validations.endDateAfterStartDate")),
  });
  const { handleSubmit, control, setValue } = useForm<Availability>({
    defaultValues: {
      startDate: undefined, endDate: undefined
    },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(validateSchema),
  });

  const { control: ControlFilter, getValues } = useForm<Filter>({
    defaultValues: {
      filter: 'Popularity'
    },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });
  const onSubmit: SubmitHandler<Availability> = async (values: Availability) => {
    const body = {
      startDate: values?.startDate,
      endDate: values?.endDate,
    };
    try {
      // const requestPayload = LoginModel.parseBodyToRequest(body);
      // const res = await auth?.signIn(requestPayload);
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      showError(err);
    }
  };
  const sortbyOptions: SelectOption[] = [
    {
      value: 'Popularity',
      label: "Popularity"
    },
    {
      value: 'No',
      label: "No"
    },
  ]
  const themeOptions = [
    { label: "Water activities", value: "water_activities" },
    { label: "Good for social distancing", value: "good_for_social_distancing" },
    { label: "Adrenaline", value: "adrenaline" },
    { label: "Nature", value: "nature" },
    { label: "Hidden gems", value: "hidden_gems" },
    { label: "Street art & grafitti", value: "street_art_&_grafitti" },
    { label: "Food", value: "food" },
    { label: "Fod", value: "fod" },
  ];
  const durationOptions = [
    { label: "0-3 hours", value: "0-3 hours" },
    { label: "3-5 hours", value: "3-5 hours" },
    { label: "5-7 hours", value: "5-7 hours" },
    { label: "Full day (7+ hours)", value: "full_day_(7+ hours)" },
    { label: "Multi-day", value: "multi-day" },
  ];
  const destinationOptions = [
    { label: "Biscayne Bay", value: "biscayne_bay" },
    { label: "Downtown Miami", value: "downtown_miami" },
    { label: "Wynwood Arts District", value: "wynwood_arts_district" },
    { label: "Port of Miami", value: "port_of_miami" },
    { label: "Everglades National Park", value: "everglades_national_park" },
    { label: "Fisher Island", value: "fisher_island" },
    { label: "Coconut Grove", value: "food" },
    { label: "Fod", value: "fod" },
  ];

  return (
    <CommonStyles.Box className='tw-flex tw-flex-col tw-pt-6 tw-mb-20'>
      {/* <div className='tw-flex tw-flex-col tw-mb-12 tw-py-6'> */}
      <Container>
        <CommonStyles.Box className='tw-flex tw-justify-between tw-items-center'>
          <CommonStyles.Box>
            <CommonStyles.Typography type='size36Weight700' className='tw-text-accent_gray_dark'>
              {t("title")}
            </CommonStyles.Typography>
            <CommonStyles.Typography type='size15Weight600' className='tw-text-accent_gray_500'>
              {t("activitiesFound")}
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box className='tw-flex tw-gap-3'>
            <CommonStyles.Typography type='size15Weight700' className='tw-text-accent_gray_dark tw-text-nowrap tw-mt-2'>
              {t("sortBy")}
            </CommonStyles.Typography>

            <RHFField
              name="filter"
              defaultValue={"Popularity"}
              control={ControlFilter}
              onChange={(e) => {
                console.log(e.target.value);
              }}
              size='small'
              sx={{
                fieldSet: { border: 'none' }
              }}
              options={sortbyOptions}
              // className="tw-text-[#FFFFFF99] "
              classNameContainer='tw-w-[310px] tw-bg-accent_gray_200'
              component={SelectField}
            />
          </CommonStyles.Box>
        </CommonStyles.Box>
      </Container>

      <CommonStyles.Box className='tw-flex tw-mt-[17px] tw-bg-[#F9FAFD]'>
        <Container className='tw-grid tw-grid-cols-12 tw-pt-8 tw-gap-6'>
          <CommonStyles.Box className='tw-col-span-3 tw-flex tw-flex-col tw-gap-3'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className=" tw-bg-white tw-rounded-md tw-shadow-md tw-pt-4"
            >
              <CommonStyles.Box className="tw-flex tw-flex-col tw-items-start tw-gap-4 tw-mx-auto">
                <CommonStyles.Typography type='size18Weight700' className='tw-text-accent_gray_dark tw-px-7'>
                  {t("availability")}
                </CommonStyles.Typography>
                <CommonStyles.Divider orientation='horizontal' flexItem />
                <CommonStyles.Box className="tw-w-full tw-flex tw-flex-col tw-gap-5 tw-px-7 tw-box-border">
                  <RHFField
                    name="startDate"
                    control={control}
                    component={CommonDatePicker}
                    label={"From"}
                    className='tw-w-full'
                  />
                  <RHFField
                    name="endDate"
                    control={control}
                    component={CommonDatePicker}
                    label={"To"}
                  />
                </CommonStyles.Box>
                <CommonStyles.Box className='tw-px-7 tw-pb-7 tw-pt-4 tw-w-full tw-box-border'>
                  <CommonButton
                    className="tw-w-full tw-bg-primary tw-text-accent_gray_800"
                    type="submit"
                  >
                    <CommonStyles.Typography type='size15Weight600' className='tw-text-white'>{"Check availability"}</CommonStyles.Typography>
                  </CommonButton>
                </CommonStyles.Box>
              </CommonStyles.Box>
            </form>

            {/* Theme Section */}
            <CommonStyles.Box >
              <AccordionMUI title="Theme" options={themeOptions} />
            </CommonStyles.Box>

            {/*Duration Section */}
            <CommonStyles.Box>
              <AccordionMUI title="Duration" options={durationOptions} />
            </CommonStyles.Box>

            {/*Destination Section */}
            <CommonStyles.Box>
              <AccordionMUI title="Destination" options={destinationOptions} />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className='tw-col-span-9'>
            <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-3 tw-w-full">
              {Array(10)
                .fill(null)
                .map((_, index) => (
                  <CommonStyles.Box key={index}>
                    <CardListItem
                      link=''
                      src="https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg"
                      title="Alaska: Westminster to Greenwich River Thames"
                      duration={2}
                      transport="Transport Facility"
                      plan="Family Plan"
                      price={35}
                      feedback_quantity={500}
                      feedback_average={4}
                    />
                  </CommonStyles.Box>
                ))}
            </CommonStyles.Box>
            <CommonStyles.CommonButton className='tw-w-full tw-border-solid tw-rounded-full tw-mt-7 tw-mb-[80px]' variant='outlined'>
              <CommonStyles.Typography type='size16Weight700' className='tw-text-primary '>
                {t("loadMoreBtn")}
              </CommonStyles.Typography>
            </CommonStyles.CommonButton>
          </CommonStyles.Box>
        </Container>
      </CommonStyles.Box >

      <Container className='tw-flex tw-flex-col tw-gap-12'>
        <CommonStyles.Box className='tw-flex tw-flex-col tw-gap-4 tw-pt-14 '>
          <CommonStyles.Typography type='size22Weight700' className='tw-text-accent_gray_dark'>
            {t("titleOutSite")}
          </CommonStyles.Typography>
          <CommonStyles.Divider orientation='horizontal' flexItem />

          <CommonStyles.Box>
            <CardCarousel
              classNameContainerHeading="tw-px-0"
              data={mocDataCard}
              title={
                <CommonStyles.Typography type='size12Weight800' className="tw-text-center tw-px-6 tw-py-2 tw-rounded-full tw-bg-primary tw-text-white">
                  {t("titleWaterActivities")}
                </CommonStyles.Typography>
              } />
          </CommonStyles.Box>
          <CommonStyles.Box>
            <CardCarousel
              classNameContainerHeading="tw-px-0"
              data={mocDataCard}
              title={
                <CommonStyles.Typography type='size12Weight800' className="tw-text-center tw-px-6 tw-py-2 tw-rounded-full tw-bg-accent_blue tw-text-white">
                  {t("titleSpecialFoods")}
                </CommonStyles.Typography>
              } />
          </CommonStyles.Box>
          <CommonStyles.Box >
            <CardCarousel
              classNameContainerHeading="tw-px-0"
              data={mocDataCard}
              title={
                <CommonStyles.Typography type='size12Weight800' className="tw-text-center tw-px-6 tw-py-2 tw-rounded-full tw-bg-accent_red tw-text-white">
                  {t("titleRiverActivity")}
                </CommonStyles.Typography>
              } />
          </CommonStyles.Box>
        </CommonStyles.Box>
        {/* Gallery Section */}
        <CommonStyles.Box>
          <Gallery />
        </CommonStyles.Box>
        <CommonStyles.Box >
          <LatestStories />
        </CommonStyles.Box>
      </Container>
      {/* </div > */}
    </CommonStyles.Box>
  )
}

export default CityTourPage;