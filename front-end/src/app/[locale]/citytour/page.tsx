"use client"
import React, { useEffect, useMemo } from 'react'
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
import { CardGridItemProps } from '@/components/Card/CardGirdItem'
import CardListItem from '@/components/Card/CardListItem'
import CardCarousel from '@/components/CardCarousel'
import Gallery from '../home/components/Gallery'
import LatestStories from '../home/components/LatestStories'
import { yupResolver } from '@hookform/resolvers/yup'
import useGetAllTourCustomer from '@/services/modules/tour/hooks/useGetAllTourCustomers'
import apiUrls from '@/constants/apiUrls'
import useGetAllThemeCustomer from '@/services/modules/theme/hook/useGetAllThemeCustomer'
import { Duration, getOptionEnum, TourSortField } from '@/helpers/common'
import useGetAllDestinationCustomer from '@/services/modules/destination/hook/useGetAllDestinationCustomer'
import useGetOutsideTourCustomer from '@/services/modules/tour/hooks/useGetOutsideTourCustomer'
import useFiltersHandler from '@/hooks/useFiltersHandler'
import { useSearchParams } from 'next/navigation'


interface Availability {
  startDate: Date,
  endDate: Date
}
interface Filter {
  filter: string,
}

const CityTourPage = () => {
  // Hook
  const t = useTranslations("cityTour");
  const { showSuccess, showError } = useNotifications();
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10,
  });
  const { data: dataTour } = useGetAllTourCustomer(filters, {
    isTrigger: true,
    refetchKey: "getAllTours",
  });

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const { data: dataTheme } = useGetAllThemeCustomer();
  const themeOptions = dataTheme?.items?.map(theme => ({
    label: theme.name,
    value: theme.id,
  })) || [];
  const durationOptions = getOptionEnum(Duration);
  const { data: dataDestination } = useGetAllDestinationCustomer();
  const destinationOptions = dataDestination?.items?.map(des => ({
    label: des.name,
    value: des.id,
  })) || [];

  const { data: dataOutside } = useGetOutsideTourCustomer();



  // Validate
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

  // Form hook
  const { control: ControlFilter, getValues } = useForm<Filter>({
    defaultValues: {
      filter: 'Popularity'
    },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });
  // Function
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

  const getActivityData = (
    activities: any[],
    name: string,
    apiUrls: { IMG_URL: string }
  ): {
    data?: CardGridItemProps[];
    title?: React.ReactNode;
    classNameContainerHeading?: string;
  } => {
    const filteredActivities = activities?.filter((item) => item?.name === name) || [];
    return {
      data: filteredActivities[0]?.Tour?.map((tour: any) => ({
        title: tour?.name,
        src: `${apiUrls.IMG_URL}/${tour?.TourImage?.[0]?.image}`,
        link: "",
        price: tour?.price,
        duration: tour?.numberOfHours,
        transport: tour?.transport,
        feedback_quantity: tour?.totalReviews,
        plan: tour?.package,
        feedback_average: tour?.averageRating
      })) || [],
      title: name,
      classNameContainerHeading: "tw-px-0",
    };
  };
  const waterData = useMemo(
    () => getActivityData(dataOutside || [], t("titleWaterActivities"), apiUrls),
    [dataOutside, apiUrls]
  );

  const goodForSocialData = useMemo(
    () => getActivityData(dataOutside || [], t("titleGoodForSocialDistancing"), apiUrls),
    [dataOutside, apiUrls]
  );

  const adrenalineData = useMemo(
    () => getActivityData(dataOutside || [], t("titleAdrenaline"), apiUrls),
    [dataOutside, apiUrls]
  );

  const sortbyOptions = getOptionEnum(TourSortField)

  useEffect(() => {
    if (searchQuery) {
      setFilters((prev) => {
        return {
          ...prev,
          textSearch: searchQuery,
        }
      })
    }
  }, [searchQuery]);

  const handleChangTheme = (selectedOptions: string[]) => {
    setFilters((prev) => {
      return {
        ...prev,
        themeIds: selectedOptions
      }
    })
  }
  const handleChangDestination = (selectedOptions: string[]) => {
    setFilters((prev) => {
      return {
        ...prev,
        destinationIds: selectedOptions
      }
    })
  }

  const handleChangDuration = (selectedOptions: string[]) => {
    setFilters((prev) => {
      return {
        ...prev,
        durations: selectedOptions
      }
    })
  }


  // Render
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
              <AccordionMUI title="Theme" options={themeOptions} onChange={handleChangTheme} />
            </CommonStyles.Box>

            {/*Duration Section */}
            <CommonStyles.Box>
              <AccordionMUI title="Duration" options={durationOptions} onChange={handleChangDuration} />
            </CommonStyles.Box>

            {/*Destination Section */}
            <CommonStyles.Box>
              <AccordionMUI title="Destination" options={destinationOptions} onChange={handleChangDestination} />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-col-span-9">
            <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-3 tw-w-full">
              {(dataTour?.items?.length || 0) > 0 ? (
                dataTour?.items?.map((item, index) => (
                  <CommonStyles.Box key={index}>
                    <CardListItem
                      name={item?.Theme?.name}
                      link={`/citytour/${item.slug}`}
                      src={`${apiUrls.IMG_URL}/${item?.TourImage?.[0]?.image}`}
                      title={item?.name}
                      duration={item?.numberOfHours}
                      transport={item?.transport}
                      plan={item?.package}
                      price={item?.price}
                      feedback_quantity={item?.totalReviews}
                      feedback_average={item?.averageRating}
                    />
                  </CommonStyles.Box>
                ))
              ) : (
                <CommonStyles.Typography
                  type="size16Weight700"
                  className="tw-text-center tw-text-gray-500"
                >
                  {t("searchNoResult")}
                </CommonStyles.Typography>
              )}
            </CommonStyles.Box>
            {(dataTour?.items?.length || 0) > 0 && (
              <CommonStyles.CommonButton
                className="tw-w-full tw-border-solid tw-rounded-full tw-mt-7 tw-mb-[80px]"
                variant="outlined"
              >
                <CommonStyles.Typography
                  type="size16Weight700"
                  className="tw-text-primary"
                >
                  {t("loadMoreBtn")}
                </CommonStyles.Typography>
              </CommonStyles.CommonButton>
            )}
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
              {...waterData}
              title={
                <CommonStyles.Typography type='size12Weight800' className="tw-text-center tw-px-6 tw-py-2 tw-rounded-full tw-bg-primary tw-text-white">
                  {waterData?.title}
                </CommonStyles.Typography>
              } />
          </CommonStyles.Box>
          <CommonStyles.Box>
            <CardCarousel
              classNameContainerHeading="tw-px-0"
              {...goodForSocialData}
              title={
                <CommonStyles.Typography type='size12Weight800' className="tw-text-center tw-px-6 tw-py-2 tw-rounded-full tw-bg-accent_blue tw-text-white">
                  {goodForSocialData.title}
                </CommonStyles.Typography>
              } />
          </CommonStyles.Box>
          <CommonStyles.Box >
            <CardCarousel
              classNameContainerHeading="tw-px-0"
              {...adrenalineData}
              title={
                <CommonStyles.Typography type='size12Weight800' className="tw-text-center tw-px-6 tw-py-2 tw-rounded-full tw-bg-accent_red tw-text-white">
                  {adrenalineData?.title}
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