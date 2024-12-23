import * as yup from 'yup';

export const schemaPersonalInformation = yup.object().shape({
  name: yup.string().required("Username is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"), 
  address: yup.string().required("Location is required"),
}).required();

export const schemaSecurityInformation = yup.object().shape({
  currentPassword: yup.string().required("Password is a required"),
  newPassword: yup.string().required("Password is a required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref('newPassword')], "Passwords must match"),
}).required();
