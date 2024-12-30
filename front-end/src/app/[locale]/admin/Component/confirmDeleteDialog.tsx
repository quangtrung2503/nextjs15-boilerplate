import CommonStyles from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";

const ConfirmDeleteDialog: React.FC<{ handleConfirmDelete: ()=>void,toggle: ()=>void,title?: string }> = ({ handleConfirmDelete,toggle,title }) => {
  const t = useTranslations();
  return (
        <CommonStyles.Box className="tw-p-2 tw-flex tw-flex-col tw-items-center tw-relative tw-rounded-md">
          <CommonStyles.Box className="tw-flex tw-justify-center tw-mb-2">
            <CommonStyles.Typography type="size20Weight600">
              {title || "Delete confirm"}
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Typography
            type="size18Weight500"
            className="tw-text-md tw-mb-5 tw-font-thin tw-text-accent_gray_500"
          >
            {t("confirmDelete")}
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-gap-4">
            <CommonStyles.CommonButton
              sx={{
                "&.MuiButtonBase-root": {
                  height: 30,
                  fontSize: 13,
                  paddingRight: 4,
                  paddingLeft: 4,
                },
              }}
              variant="outlined"
              className="tw-cursor-pointer tw-border-red-500 tw-text-red-500 tw-border-[1px]"
              onClick={toggle}
            >
              {t("cancel")}
            </CommonStyles.CommonButton>
            <CommonStyles.CommonButton
              variant="outlined"
              sx={{
                "&.MuiButtonBase-root": {
                  height: 30,
                  fontSize: 13,
                  paddingRight: 4,
                  paddingLeft: 4,
                },
              }}
              type="submit"
              className="active tw-cursor-pointer tw-border-[1px] tw-bg-red-100 tw-text-red-500 tw-border-none"
              onClick={handleConfirmDelete}
            >
              {t("delete")}
            </CommonStyles.CommonButton>
            <CommonStyles.Box
              className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer"
              onClick={toggle}
            >
              <CommonIcons.Close />
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      )
};
export default ConfirmDeleteDialog;
