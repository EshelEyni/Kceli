import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../store/slices/authSlice";
import "./Signup.scss";
import { AppDispatch } from "../../types/app";
import { SubmitHandler, useForm } from "react-hook-form";
import reactHookFormService from "../../services/reactHookForm/reactHookFormService";
import { Gender } from "../../../../shared/types/system";
import { Button } from "../../components/App/Button/Button";
import { usePageLoaded } from "../../hooks/usePageLoaded";
const {
  lettersAndNumberPattern,
  lettersAndNumberPatternWithSpace,
  emailPattern,
  createRequiredValidationMsg,
  createMinLengthValidation,
  createMaxLengthValidation,
} = reactHookFormService;

interface IFormInput {
  username: string;
  fullname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  weight: number;
  height: number;
  gender: Gender;
  birthdate: Date;
}

interface IInputField {
  id: keyof IFormInput;
  type: string;
  validation: {
    required?: string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
  };
  defaultValue: string;
  options?: Gender[];
}

const SignupPage = () => {
  usePageLoaded({});

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isDirty, touchedFields },
  } = useForm<IFormInput>();

  const validateField = async (fieldName: keyof IFormInput) => {
    await trigger(fieldName);
  };

  const inputFields: IInputField[] = [
    {
      id: "username",
      type: "text",
      validation: {
        required: createRequiredValidationMsg("username"),
        minLength: createMinLengthValidation(3),
        maxLength: createMaxLengthValidation(20),
        pattern: lettersAndNumberPattern,
      },
      defaultValue: "eshel2",
    },
    {
      id: "fullname",
      type: "text",
      validation: {
        required: createRequiredValidationMsg("fullname"),
        minLength: createMinLengthValidation(3),
        pattern: lettersAndNumberPatternWithSpace,
      },
      defaultValue: "eshel eyni",
    },
    {
      id: "email",
      type: "text",
      validation: {
        required: createRequiredValidationMsg("email"),
        pattern: emailPattern,
      },
      defaultValue: "eshel2@email.com",
    },
    {
      id: "password",
      type: "password",
      validation: {
        required: createRequiredValidationMsg("password"),
        minLength: createMinLengthValidation(6),
        maxLength: createMaxLengthValidation(20),
        pattern: lettersAndNumberPattern,
      },
      defaultValue: "eshel123",
    },
    {
      id: "passwordConfirm",
      type: "password",
      validation: {
        required: createRequiredValidationMsg("passwordConfirm"),
        minLength: createMinLengthValidation(6),
        maxLength: createMaxLengthValidation(20),
        pattern: lettersAndNumberPattern,
      },
      defaultValue: "eshel123",
    },
    {
      id: "weight",
      type: "number",
      validation: {
        required: createRequiredValidationMsg("weight"),
      },
      defaultValue: "120",
    },
    {
      id: "height",
      type: "number",
      validation: {
        required: createRequiredValidationMsg("height"),
      },
      defaultValue: "182",
    },
    {
      id: "gender",
      type: "radio",
      validation: {
        required: createRequiredValidationMsg("gender"),
      },
      options: ["male", "female"],
      defaultValue: "male",
    },
    {
      id: "birthdate",
      type: "date",
      validation: {
        required: createRequiredValidationMsg("birthdate"),
      },
      defaultValue: "1992-01-09",
    },
  ];

  const onSignup: SubmitHandler<IFormInput> = async data => {
    if (data.password !== data.passwordConfirm) {
      setError("passwordConfirm", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    await dispatch(signup(data));
    navigate("/home");
  };

  return (
    <section className="page signup-page">
      <form onSubmit={handleSubmit(onSignup)}>
        <h1>Signup</h1>

        {inputFields.map(input => (
          <div key={input.id}>
            <label htmlFor={input.id}>
              <fieldset>
                <legend>{input.id}</legend>
                {input.type === "radio" ? (
                  input.options?.map(option => (
                    <label key={option}>
                      <input
                        {...register(input.id, input.validation)}
                        type={input.type}
                        value={option}
                        defaultChecked={input.defaultValue === option}
                        onBlur={() => validateField(input.id)}
                      />
                      {option}
                    </label>
                  ))
                ) : (
                  <input
                    id={input.id}
                    {...register(input.id, input.validation)}
                    type={input.type}
                    autoComplete="off"
                    defaultValue={input.defaultValue}
                    onBlur={() => validateField(input.id)}
                  />
                )}
              </fieldset>
            </label>
            {(isDirty || touchedFields[input.id]) && errors[input.id] && (
              <p>{errors[input.id]?.message}</p>
            )}
          </div>
        ))}

        <Button type="submit" isDisabled={isDirty && Object.keys(errors).length > 0}>
          Signup
        </Button>
        {/* <button type="submit">Signup</button> */}
      </form>
    </section>
  );
};

export default SignupPage;
