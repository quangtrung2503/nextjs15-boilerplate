type Props = {
    htmlString: string
}
const HtmlContent = (props: Props) => {
    const { htmlString } = props
    return (
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    );
};

export default HtmlContent