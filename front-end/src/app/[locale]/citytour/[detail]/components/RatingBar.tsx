import React from 'react'
import CommonStyles from '@/components/common'
type Props = {
    title: string;
    rating: number;
}
const RatingBar = (props: Props) => {
    const {title, rating} = props
    return (
        <CommonStyles.Box className='tw-flex tw-w-full tw-items-center tw-justify-between'>
            <CommonStyles.Typography className='tw-text-accent_gray_800' type='size14Weight700'>{title}</CommonStyles.Typography>
            <CommonStyles.Box className='tw-flex tw-w-2/3 tw-items-center tw-gap-3'>
                <CommonStyles.RatingBar className='tw-w-full' value={rating} />
                <CommonStyles.Typography type='size14Weight700' className='tw-w-6 tw-text-end tw-text-accent_gray_500'>{rating}</CommonStyles.Typography>
            </CommonStyles.Box>
        </CommonStyles.Box>
    )
}

export default RatingBar