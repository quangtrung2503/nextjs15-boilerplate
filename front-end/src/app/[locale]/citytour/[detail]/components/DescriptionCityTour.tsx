import React from 'react'
import CommonStyle from '@/components/common'
type Props = {
    title: string,
    content: string
}
const DescriptionCityTour = (props: Props) => {
    const { title, content } = props
    return (
        <div className="">
            <div className='tw-flex tw-flex-col tw-gap-y-3 tw-py-5'>
                <CommonStyle.Typography type='size23Weight600'>{title}</CommonStyle.Typography>
                <CommonStyle.Box>
                    <CommonStyle.HtmlContent
                        htmlString={content}
                    />
                </CommonStyle.Box>
            </div>
            <CommonStyle.Divider />
        </div>
    )
}

export default DescriptionCityTour