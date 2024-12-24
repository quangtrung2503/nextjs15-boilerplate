import * as Yup from "yup";

export interface FormValues {
    email: string;
    password: string;
};
export const validateSchema = (t:any)=> Yup.object().shape({
    email: Yup.string()
        .email(t("validations.emailFormat"))
        .required(t("validations.emailRequire")),
    password: Yup.string().required(t("validations.passwordRequire")),
})
export const defaultValue = { email: "", password: "" }