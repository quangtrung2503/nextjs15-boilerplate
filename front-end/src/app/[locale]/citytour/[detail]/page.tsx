"use client"
import React, { useState } from 'react'
import { default as CommonStyles } from '@/components/common'
import { Container } from '@mui/material'
import { detail1, detail2, detail3, detail4, detail5, detail6 } from '@/assets'
import CommonIcons from '@/components/CommonIcons'
import RHFField from '@/components/customReactFormField/ReactFormField'
import { CommonButton } from '@/components/common/Button'
import { useTranslations } from 'next-intl'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotifications } from '@/helpers/toast'
import { CommonDatePicker } from '@/components/common/DatePicker'
import SelectNoOfGuest from './components/SelectNoOfGuest'
import DescriptionCityTour from './components/DescriptionCityTour'
import CardCarousel from '@/components/CardCarousel'
import RatingBar from './components/RatingBar'
import SelectField from '@/components/customReactFormField/SelectField'
import InputField from '@/components/customReactFormField/InputField'
import FeedbackItem from './components/FeedbackItem'
import { SelectOption } from '@/interfaces/common'

export interface NoOfGuest {
  adultQuantity?: number | undefined;
  childQuantity?: number | undefined;
}
interface InfoBooking {
  startDate: Date;
  endDate: Date;
  noOfGuest: NoOfGuest;
}
const CityTourDetail = () => {
  const [indexActive, setIndexActive] = useState(0)
  const t = useTranslations("cityTourDetail");
  const imgs = [
    detail1,
    detail2,
    detail3,
    detail4,
    detail5,
    detail6,
  ]
  const services = [
    {
      title: "Free cancellation",
      description: "Cancel up to 24 hours in advance to receive a full refund",
      icon: <CommonIcons.Cancelation color='var(--primary)' />
    },
    {
      title: "Health precautions",
      description: "Special health and safety measures apply. Learn more",
      icon: <CommonIcons.Health color='var(--primary)' />
    },
    {
      title: "Mobile ticketing",
      description: "Use your phone or print your voucher",
      icon: <CommonIcons.CacbonMobile color='var(--primary)' />
    },
    {
      title: "Duration 3.5 hours",
      description: "Check availability to see starting times.",
      icon: <CommonIcons.Duration color='var(--primary)' />
    },
    {
      title: "Instant confirmation",
      description: "Don’t wait for the confirmation!",
      icon: <CommonIcons.FluenFlash color='var(--primary)' />
    },
    {
      title: "Live tour guide in English",
      description: "English",
      icon: <CommonIcons.LiveTour color='var(--primary)' />
    },
  ]
  const options: SelectOption[] = [
          {
            value: "value1",
            label: "label1",
          },
          {
            value: "value2",
            label: "label2",
          },
          {
            value: "value3",
            label: "label3",
          }
        ];
  const feedbackData = {
    avatar: "https://example.com/avatar.jpg",
    name: "Arlene McCoy",
    rating: 4.3,
    date: "2 October 2012",
    title: "Good tour, really well organised",
    content:
      "The tour was very well organised. One minus is that you get completely bombarded with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn't enjoy it.",
    isVerified: true,
    helpful: true,
  };
  const { showSuccess, showError } = useNotifications();
  const validateSchema = Yup.object().shape({
    startDate: Yup.date()
      .required(t("validations.startDateRequire"))
      .typeError(t("validations.startDateInvalid"))
      .min(new Date(), t("validations.startDateMin")),
    endDate: Yup.date()
      .required(t("validations.endDateRequire"))
      .typeError(t("validations.endDateInvalid"))
      .min(Yup.ref("startDate"), t("validations.endDateAfterStartDate")),
    noOfGuest: Yup.object().shape({
      adultQuantity: Yup.number(),
      childQuantity: Yup.number(),
    }),
  });
  const { handleSubmit, control, setValue } = useForm<InfoBooking>({
    defaultValues: {
      startDate: undefined, endDate: undefined, noOfGuest: {
        adultQuantity: undefined,
        childQuantity: undefined
      }
    },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(validateSchema)
  });

  const onSubmit: SubmitHandler<InfoBooking> = async (values: InfoBooking) => {
    const body = {
      startDate: values?.startDate,
      endDate: values?.endDate,
      noOfGuest: values?.noOfGuest,
    };
    try {
      // const requestPayload = LoginModel.parseBodyToRequest(body);
      // const res = await auth?.signIn(requestPayload);
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      showError(err);
    }
  };
  const handleSetValue = (value: NoOfGuest) => {
    setValue("noOfGuest", value);
  }
  return (
    <div className='tw-py-12'>
      <Container className='tw-flex tw-flex-col tw-gap-y-8'>
        <CommonStyles.Box className='tw-grid tw-grid-cols-12'>
          <CommonStyles.Box className='tw-col-span-8 tw-flex tw-flex-col tw-gap-4'>
            <CommonStyles.Typography type='size36Weight700' className='tw-text-accent_gray_dark tw-leading-tight'>Vintage Double Decker Bus Tour & Thames River Cruise</CommonStyles.Typography>
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3 tw-text-accent_gray_800">
              <CommonStyles.Typography className="tw-flex tw-items-center ">
                <CommonIcons.LocationOn className="tw-w-4" />
                Gothenburg
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-items-center">
                <CommonStyles.Rating
                  haveFeedback={false}
                  readOnly
                  valueTable={5}
                />
                <CommonStyles.Typography
                  className="tw-ml-[2px]"
                >
                  ({200} reviews)
                </CommonStyles.Typography>
              </CommonStyles.Box>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className='tw-grid tw-grid-cols-12 tw-gap-10'>
          <CommonStyles.Box className='tw-col-span-8 tw-flex tw-flex-col tw-gap-y-5'>
            {/* Slide city tour */}
            <CommonStyles.Box className='tw-w-full'>
              <img src={imgs[indexActive].src} alt="" className='tw-w-full tw-max-h-[460px]' />
              <CommonStyles.Box className='tw-overflow-x-auto tw-overflow-y-hidden scrollbar-hide tw-h-fit tw-mt-2'>
                <CommonStyles.Box className='tw-flex tw-gap-3 tw-w-fit tw-h-fit'>
                  {imgs.map((item, index) => {
                    return (<CommonStyles.Box key={index} onClick={() => { setIndexActive(index) }} className={`tw-w-[120px] tw-h-[100px] tw-box-border tw-select-none ${indexActive === index ? "tw-border-[4px] tw-border-solid tw-border-primary" : ""}`}>
                      <img src={item.src} alt="" className='tw-size-full' />
                    </CommonStyles.Box>)
                  })}
                  {imgs.map((item, index) => {
                    return (<CommonStyles.Box key={index} onClick={() => { setIndexActive(index) }} className={`tw-w-[120px] tw-h-[100px] tw-box-border ${indexActive === index ? "tw-border-[4px] tw-border-solid tw-border-primary" : ""}`}>
                      <img src={item.src} alt="" className='tw-size-full' />
                    </CommonStyles.Box>)
                  })}
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>
            {/* Services */}
            <CommonStyles.Box className='tw-grid tw-grid-cols-12 tw-gap-10 tw-bg-[#16527D14] tw-p-5 tw-rounded-sm'>
              {services.map((item, index) => {
                return (
                  <CommonStyles.Box key={index} className='tw-flex tw-items-start tw-gap-2 tw-col-span-6'>
                    <CommonStyles.Box className='tw-text-primary tw-mt-[2px]'>
                      {item.icon}
                    </CommonStyles.Box>
                    <CommonStyles.Box>
                      <CommonStyles.Typography type='size15Weight600' className='tw-text-accent_gray_dark'>{item.title}</CommonStyles.Typography>
                      <CommonStyles.Typography type='size14Weight400' className='tw-text-accent_gray_800'>{item.description}</CommonStyles.Typography>
                    </CommonStyles.Box>
                  </CommonStyles.Box>
                )
              })}
            </CommonStyles.Box>
            {/* Description */}
            <CommonStyles.Box>
              <DescriptionCityTour
                title='Description'
                content='See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus.'
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title='Activity'
                content='See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus.'
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title='What is included / not  included'
                content='See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus.'
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title='Safety'
                content='See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus.'
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title='Details'
                content='See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus.'
              />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className='tw-col-span-4 tw-flex tw-justify-center tw-h-fit'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className=" tw-bg-white tw-rounded-md tw-shadow-dropdown tw-w-full tw-p-5"
            >
              <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center tw-gap-5 tw-mx-auto">
                <CommonStyles.Box className="tw-w-full tw-flex tw-flex-col tw-gap-5">
                  <RHFField
                    name="startDate"
                    control={control}
                    component={CommonDatePicker}
                    label={"From"}
                  />
                  <RHFField
                    name="endDate"
                    control={control}
                    component={CommonDatePicker}
                    label={"To"}
                  />
                  <RHFField
                    name="noOfGuest"
                    control={control}
                    handelSetValue={handleSetValue}
                    component={SelectNoOfGuest}
                  />
                </CommonStyles.Box>
                <CommonStyles.Box className='tw-flex tw-flex-col tw-items-center'>
                  <CommonStyles.Typography type='size14Weight600' className='tw-text-accent_gray_500'>Subtotal</CommonStyles.Typography>
                  <CommonStyles.Typography className='tw-text-primary' type='size36Weight900'>$78.90</CommonStyles.Typography>
                </CommonStyles.Box>
                <CommonButton
                  className="tw-w-full tw-bg-primary tw-text-accent_gray_800"
                  type="submit"
                >
                  <CommonStyles.Typography type='size15Weight600' className='tw-text-white'>{"Confirm booking"}</CommonStyles.Typography>
                </CommonButton>
                <CommonButton
                  variant='outlined'
                  startIcon={<CommonIcons.FavoriteBorderOutlined />}
                  className="tw-w-full tw-text-accent_gray_500 tw-border-accent_gray_500"
                  type="button"
                >
                  {"Save To Wishlist"}
                </CommonButton>
                <CommonButton
                  variant='outlined'
                  startIcon={<CommonIcons.Share />}
                  className="tw-w-full tw-text-accent_gray_500 tw-border-accent_gray_500"
                  type="button"
                >
                  {"Share The Activity"}
                </CommonButton>
              </CommonStyles.Box>
            </form>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className='tw-flex tw-flex-col tw-gap-5'>
          <CommonStyles.Box>
            <CardCarousel
              classNameContainerHeading='tw-px-0'
              title={<CommonStyles.Typography type='size22Weight700'>Related tours in Today</CommonStyles.Typography>}
            />
            <CommonStyles.Divider />
          </CommonStyles.Box>
          <CommonStyles.Box>
            <CardCarousel
              classNameContainerHeading='tw-px-0'
              title={<CommonStyles.Typography type='size22Weight700'>Related tours in London</CommonStyles.Typography>}
            />
            <CommonStyles.Divider />
          </CommonStyles.Box>
          {/* Feedback */}
          <CommonStyles.Box>
            {/* Heading Review */}
            <CommonStyles.Typography type='size22Weight700'>Customer Review</CommonStyles.Typography>
            <CommonStyles.Box className='tw-flex tw-flex-col tw-gap-5'>
              {/* Rating */}
              <CommonStyles.Box className='tw-flex tw-justify-between'>
                <CommonStyles.Box className='tw-flex tw-flex-col tw-gap-2'>
                  <CommonStyles.Box className='tw-flex tw-items-end tw-gap-3'>
                    <CommonStyles.Typography type='size48Weight900' className='tw-leading-tight tw-text-accent_gray_dark'>4,30</CommonStyles.Typography>
                    <CommonStyles.Typography type='size23Weight300' className='tw-text-accent_gray_500'>854 reviews</CommonStyles.Typography>
                  </CommonStyles.Box>
                  <CommonStyles.Rating
                    readOnly
                    classNameIcon='tw-text-[50px]'
                    valueTable={4.3}
                  />
                </CommonStyles.Box>
                <CommonStyles.Box className='tw-w-[380px] tw-flex tw-flex-col tw-gap-2'>
                  <RatingBar title='Guide' rating={4.8} />
                  <RatingBar title='Transportation' rating={3} />
                  <RatingBar title='Value for money' rating={4.5} />
                  <RatingBar title='Safety' rating={4} />
                </CommonStyles.Box>
              </CommonStyles.Box>
              {/* Feedback Filter */}
              <CommonStyles.Box className='tw-flex tw-gap-5 tw-items-center tw-bg-[#16527D14] tw-border-solid border-[1px] tw-border-[#16527D14] tw-px-10 tw-py-5 tw-rounded-sm'>
                <CommonStyles.Typography type='size15Weight600' className='tw-flex tw-items-center tw-gap-2'>
                  <CommonIcons.FilterMui color='var(--accent-gray-dark)' />
                  Filter:
                </CommonStyles.Typography>
                <CommonStyles.Box className='tw-flex tw-gap-4 tw-flex-1'>
                  <SelectField options={options} classNameContainer='tw-bg-white tw-rounded-sm tw-shadow-select' sx={{
                    fieldSet: {
                      border: 'none',
                    }
                  }} />
                  <SelectField options={options} classNameContainer='tw-bg-white tw-rounded-sm tw-shadow-select' sx={{
                    fieldSet: {
                      border: 'none',
                    }
                  }} />
                  <SelectField options={options} classNameContainer='tw-bg-white tw-rounded-sm tw-shadow-select' sx={{
                    fieldSet: {
                      border: 'none',
                    }
                  }} />
                  {/* <InputField/> */}
                </CommonStyles.Box>
              </CommonStyles.Box>
              {/* Feedback */}
              <CommonStyles.Box>
                <FeedbackItem feedback={feedbackData} />
              </CommonStyles.Box>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </Container>
    </div>
  )
}

export default CityTourDetail