import { useTranslations } from "next-intl";
import * as Yup from "yup";
const t = useTranslations("signUp");

export interface FormValues {
    name: string;
    phone?: string;
    email: string;
    password: string;
    confirmPassword: string;
};
export const validationSchema = (t:any)=> Yup.object().shape({
    name: Yup.string().required(t("validations.nameRequire")),
    phone: Yup.string()
        .matches(/^([0-9]{10})?$/, t("validations.phoneFormat")),
    email: Yup.string()
        .email(t("validations.emailFormat"))
        .required(t("validations.emailRequire")),
    password: Yup.string().required(t("validations.passwordRequire")),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("validations.passwordNotMatch"))
        .required(t("validations.passwordRequire")),
});
export const defaultValue = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "", // Phone is optional, should be undefined or empty string
}