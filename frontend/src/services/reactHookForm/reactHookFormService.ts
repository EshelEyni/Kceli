import { t } from "../../i18n";
type LengthValidation = {
  value: number;
  message: string;
};

const lettersAndNumberPattern = {
  value: /^[a-zA-Z0-9]+$/,
  get message() {
    return t("Must contain only letters and numbers");
  },
};

const lettersAndNumberPatternWithSpace = {
  value: /^[\p{L}\p{M}0-9 ]+$/u,
  get message() {
    return t("Must contain only letters, numbers and spaces");
  },
};

const emailPattern = {
  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  get message() {
    return t("Must be a valid email");
  },
};

function createRequiredValidationMsg(fieldName: string) {
  return t("Please enter {{field}}", { field: t(fieldName) });
}

function createMinLengthValidation(minLength: number): LengthValidation {
  return {
    value: minLength,
    message: t("Must be at least {{count}} characters", { count: minLength }),
  };
}

function createMaxLengthValidation(maxLength: number): LengthValidation {
  return {
    value: maxLength,
    message: t("Must be at most {{count}} characters", { count: maxLength }),
  };
}

export default {
  lettersAndNumberPattern,
  lettersAndNumberPatternWithSpace,
  emailPattern,
  createRequiredValidationMsg,
  createMinLengthValidation,
  createMaxLengthValidation,
};
