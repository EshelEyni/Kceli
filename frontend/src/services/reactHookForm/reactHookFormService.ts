type LengthValidation = {
  value: number;
  message: string;
};

const lettersAndNumberPattern = {
  value: /^[a-zA-Z0-9]+$/,
  message: "Must contain only letters and numbers",
};

const lettersAndNumberPatternWithSpace = {
  value: /^[a-zA-Z0-9 ]+$/,
  message: "Must contain only letters, numbers and spaces",
};

const emailPattern = {
  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  message: "Must be a valid email",
};

function createRequiredValidationMsg(fieldName: string) {
  return `Please enter ${fieldName}`;
}

function createMinLengthValidation(minLength: number): LengthValidation {
  return { value: minLength, message: `Must be at least ${minLength} characters` };
}

function createMaxLengthValidation(maxLength: number): LengthValidation {
  return { value: maxLength, message: `Must be at most ${maxLength} characters` };
}

export default {
  lettersAndNumberPattern,
  lettersAndNumberPatternWithSpace,
  emailPattern,
  createRequiredValidationMsg,
  createMinLengthValidation,
  createMaxLengthValidation,
};
