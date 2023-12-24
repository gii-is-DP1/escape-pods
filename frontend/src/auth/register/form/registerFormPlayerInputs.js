import { formValidators } from "../../../validators/formValidators";

export const registerFormPlayerInputs = [
  {
    tag: "Username",
    name: "username",
    type: "text",
    defaultValue: "",
    isRequired: true,
    validators: [formValidators.notEmptyValidator],
  },
  {
    tag: "Password",
    name: "password",
    type: "password",
    defaultValue: "",
    isRequired: true,
    validators: [formValidators.notEmptyValidator],
  },
  {
    tag: "Profile Description",
    name: "profileDescription",
    type: "text",
    defaultValue: "",
    isRequired: true,
    validators: [formValidators.descriptionValidator],
  },
  {
    tag: "Profile Picture",
    name: "profilePicture",
    type: "files",
    isRequired: true,
    validators: [formValidators.pictureValidator],
  },
];
