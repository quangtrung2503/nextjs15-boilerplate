import * as yup from 'yup';

export const createSchemaPersonalInformation = (t: any) =>
  yup
    .object({
      name: yup.string().required(t('validation.usernameRequired')),
      dateOfBirth: yup.string().required(t('validation.dateOfBirthRequired')),
      phone: yup
        .string()
        .matches(/^[0-9]{10}$/, t('validation.phoneInvalid'))
        .required(t('validation.phoneRequired')),
      address: yup.string().required(t('validation.locationRequired')),
    })
    .required();

export const createSchemaSecurityInformation = (t: any) =>
  yup
    .object({
      currentPassword: yup.string().required(t('validation.currentPasswordRequired')),
      newPassword: yup.string().required(t('validation.newPasswordRequired')),
      confirmPassword: yup
        .string()
        .required(t('validation.confirmPasswordRequired'))
        .oneOf([yup.ref('newPassword')], t('validation.passwordsMustMatch')),
    })
    .required();
