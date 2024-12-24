import { useTranslations } from "next-intl";
import * as Yup from "yup";
const t = useTranslations("signIn");

export interface FormValues {
    email: string;
    password: string;
};
export const validateSchema = Yup.object().shape({
    email: Yup.string()
        .email(t("validations.emailFormat"))
        .required(t("validations.emailRequire")),
    password: Yup.string().required(t("validations.passwordRequire")),
})
export const defaultValue = { email: "", password: "" }