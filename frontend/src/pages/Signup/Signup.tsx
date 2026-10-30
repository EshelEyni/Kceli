import i18n, { t } from "../../i18n";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../store/slices/authSlice";
import "./Signup.scss";
import { AppDispatch } from "../../types/app";
import { SubmitHandler, useForm } from "react-hook-form";
import reactHookFormService from "../../services/reactHookForm/reactHookFormService";
import { Gender } from "../../../../shared/types/system";
import { Button } from "../../components/App/Button/Button";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
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
    formState: { errors, isSubmitting },
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
      defaultValue: "",
    },
    {
      id: "fullname",
      type: "text",
      validation: {
        required: createRequiredValidationMsg("fullname"),
        minLength: createMinLengthValidation(3),
        pattern: lettersAndNumberPatternWithSpace,
      },
      defaultValue: "",
    },
    {
      id: "email",
      type: "email",
      validation: {
        required: createRequiredValidationMsg("email"),
        pattern: emailPattern,
      },
      defaultValue: "",
    },
    {
      id: "password",
      type: "password",
      validation: {
        required: createRequiredValidationMsg("password"),
        minLength: createMinLengthValidation(8),
        maxLength: createMaxLengthValidation(20),
        pattern: lettersAndNumberPattern,
      },
      defaultValue: "",
    },
    {
      id: "passwordConfirm",
      type: "password",
      validation: {
        required: createRequiredValidationMsg("passwordConfirm"),
        minLength: createMinLengthValidation(8),
        maxLength: createMaxLengthValidation(20),
        pattern: lettersAndNumberPattern,
      },
      defaultValue: "",
    },
    {
      id: "weight",
      type: "number",
      validation: {
        required: createRequiredValidationMsg("weight"),
      },
      defaultValue: "",
    },
    {
      id: "height",
      type: "number",
      validation: {
        required: createRequiredValidationMsg("height"),
      },
      defaultValue: "",
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
      defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
        .toISOString()
        .split("T")[0],
    },
  ];

  const onSignup: SubmitHandler<IFormInput> = async data => {
    try {
      if (data.password !== data.passwordConfirm) {
        setError("passwordConfirm", {
          type: "manual",
          message: t("Passwords do not match"),
        });
        return;
      }

      await dispatch(signup({ ...data, language: i18n.resolvedLanguage === "he" ? "he" : "en" }));
      navigate("/home");
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message)
        toast.error(err.response.data.message);
      else toast.error(t("An unknown error occurred"));
    }
  };

  const labels: Record<string, string> = { username: "Username", fullname: "Full name", email: "Email address", password: "Password", passwordConfirm: "Confirm password", weight: "Weight", height: "Height", gender: "Gender", birthdate: "Date of birth" };
  const autocomplete: Record<string, string> = { username: "username", fullname: "name", email: "email", password: "new-password", passwordConfirm: "new-password", birthdate: "bday" };
  const renderField = (input: IInputField) => (
    <div key={input.id} className={"signup-field signup-field--" + input.id}>
      {input.type === "radio" ? (
        <fieldset className="signup-gender">
          <legend>{t(labels[input.id])}</legend>
          <div className="signup-gender__options">{input.options?.map(option => (
            <label key={option}><input {...register(input.id, input.validation)} type="radio" value={option} defaultChecked={input.defaultValue === option} /><span>{t(option)}</span></label>
          ))}</div>
        </fieldset>
      ) : (
        <>
          <label htmlFor={input.id}>{t(labels[input.id])}{input.id === "weight" ? " (kg)" : input.id === "height" ? " (cm)" : ""}</label>
          <input id={input.id} {...register(input.id, input.validation)} type={input.type}
            autoComplete={autocomplete[input.id] || "off"} defaultValue={input.defaultValue}
            onBlur={() => validateField(input.id)} aria-invalid={!!errors[input.id]}
            aria-describedby={errors[input.id] ? input.id + "-error" : undefined}
            step={input.type === "number" ? "any" : undefined} min={input.type === "number" ? "0.1" : undefined} />
        </>
      )}
      {errors[input.id] && <p id={input.id + "-error"} className="signup-error" role="alert">{errors[input.id]?.message}</p>}
    </div>
  );
  return (
    <section className="page signup-page" aria-labelledby="signup-title">
      <div className="signup-card">
        <header className="signup-header">
          <span className="signup-eyebrow">{t("A little better, every day")}</span>
          <h1 id="signup-title">{t("Create your account")}</h1>
          <p>{t("Build healthy habits. Make room for progress.")}</p>
        </header>
        <form onSubmit={handleSubmit(onSignup)}>
          <fieldset className="signup-section">
            <legend>{t("Account details")}</legend>
            <div className="signup-grid">{inputFields.slice(0, 5).map(renderField)}</div>
            <p className="signup-hint">{t("Username: 3–20 English letters or numbers. Password: 8–20 English letters or numbers.")}</p>
          </fieldset>
          <fieldset className="signup-section">
            <legend>{t("A little about you")}</legend>
            <p className="signup-description">{t("Your details help personalize your daily goals.")}</p>
            <div className="signup-grid">{inputFields.slice(5).map(renderField)}</div>
          </fieldset>
          <Button className="signup-submit" type="submit" isDisabled={isSubmitting}>{t(isSubmitting ? "Creating your account…" : "Create account")}</Button>
          <p className="signup-login">{t("Already have an account?")} <Link to="/login">{t("Log in")}</Link></p>
        </form>
      </div>
    </section>
  );
};
export default SignupPage;
