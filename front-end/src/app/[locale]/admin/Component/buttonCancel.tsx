import { useTranslations } from "next-intl"
import { CommonButtonAdmin } from "./customField/commonButton";

const CancelButton: React.FC<{handleClose: ()=>void}> = ({handleClose}) => {
  const t = useTranslations();
  return (
    <CommonButtonAdmin
      variant="outlined"
      className="tw-cursor-pointer tw-text-primary tw-border-[1px] tw-min-w-28"
      onClick={handleClose}
    >
      {t("cancel")}
    </CommonButtonAdmin>
  )
}
export default CancelButton
