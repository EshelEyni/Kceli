import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/App/Button/Button";
import nutritionApiService from "../../../services/nutrition/nutritionApiService";
import { RiGovernmentFill, RiOpenaiFill } from "react-icons/ri";
import { GiNinjaHead } from "react-icons/gi";
import { useDayEdit } from "./DayEditContext";
import { NutritionQueryResponseHandler } from "./NutritionQueryResponseHandler";
import "./NutritionQuery.scss";

type NutritionQueryIFormInput = {
  chatGPTQuery: string;
  ninjaAPIQuery: string;
  USDAAPIQuery: string;
};

export const NutritionQuery: FC = () => {
  const {
    chatGPTQuery,
    setChatGPTQuery,
    ninjaAPIQuery,
    setNinjaAPIQuery,
    USDAAPIQuery,
    setUSDAAPIQuery,
  } = useDayEdit();

  const { control, handleSubmit } = useForm<NutritionQueryIFormInput>({
    defaultValues: {
      chatGPTQuery: "",
      ninjaAPIQuery: "",
      USDAAPIQuery: "",
    },
  });

  async function onSubmit(data: NutritionQueryIFormInput) {
    if (data.chatGPTQuery) {
      try {
        setChatGPTQuery({ ...chatGPTQuery, status: "loading" });
        const response = await nutritionApiService.queryChatGPT(data.chatGPTQuery);
        setChatGPTQuery({ ...chatGPTQuery, status: "success", response });
      } catch (e) {
        setChatGPTQuery({
          ...chatGPTQuery,
          status: "error",
          error: e instanceof Error ? e.message : "An unknown error occurred.",
        });
      }
    }

    if (data.ninjaAPIQuery) {
      try {
        setNinjaAPIQuery({ ...ninjaAPIQuery, status: "loading" });
        const ninjaAPIResponse = await nutritionApiService.queryNinja(data.ninjaAPIQuery);
        setNinjaAPIQuery({ ...ninjaAPIQuery, status: "success", response: ninjaAPIResponse });
      } catch (e) {
        setNinjaAPIQuery({
          ...ninjaAPIQuery,
          status: "error",
          error: e instanceof Error ? e.message : "An unknown error occurred.",
        });
      }
    }

    if (data.USDAAPIQuery) {
      try {
        setUSDAAPIQuery({ ...USDAAPIQuery, status: "loading" });
        const USDAAPIResponse = await nutritionApiService.queryUSDA(data.USDAAPIQuery);
        setUSDAAPIQuery({ ...USDAAPIQuery, status: "success", response: USDAAPIResponse });
      } catch (e) {
        setUSDAAPIQuery({
          ...USDAAPIQuery,
          status: "error",
          error: e instanceof Error ? e.message : "An unknown error occurred.",
        });
      }
    }
  }

  return (
    <section className="nutrition-query" data-testid="nutrition-query">
      <section className="nutrition-query__desc">
        <p>{"This tab let's you query the APIs used by the app."}</p>
        <ul>
          <li>The first one is a chatbot that generates a response based on the input</li>
          <li>The second one is a food database.</li>
          <li>The third one is a nutrition database.</li>
        </ul>
      </section>

      <form className="nutrition-query__form" autoComplete="off" data-testid="nutrition-query-form">
        <label htmlFor="chatGPTQuery">
          <span>Chat GPT</span>
          <RiOpenaiFill />
        </label>
        <Controller
          name="chatGPTQuery"
          control={control}
          render={({ field }) => <textarea id="chatGPTQuery" {...field} />}
        />

        <label htmlFor="ninjaAPIQuery">
          <span>Ninja API</span>
          <GiNinjaHead />
        </label>
        <Controller
          name="ninjaAPIQuery"
          control={control}
          render={({ field }) => <input id="ninjaAPIQuery" {...field} />}
        />

        <label htmlFor="USDAAPIQuery">
          <span>USDA API</span>
          <RiGovernmentFill />
        </label>
        <Controller
          name="USDAAPIQuery"
          control={control}
          render={({ field }) => <input id="USDAAPIQuery" {...field} />}
        />

        <Button onClickFn={handleSubmit(onSubmit)}>query</Button>
      </form>

      <div className="nutrition-query__results">
        {chatGPTQuery.status !== "idle" && (
          <div className="nutrition-query__results__item">
            <h1>Chat GPT Response:</h1>
            <NutritionQueryResponseHandler queryState={chatGPTQuery} />
          </div>
        )}

        {ninjaAPIQuery.status !== "idle" && (
          <div className="nutrition-query__results__item">
            <h1>Ninja API Response:</h1>
            <NutritionQueryResponseHandler queryState={ninjaAPIQuery} />
          </div>
        )}

        {USDAAPIQuery.status !== "idle" && (
          <div className="nutrition-query__results__item">
            <h1>USDA API Response:</h1>
            <NutritionQueryResponseHandler queryState={USDAAPIQuery} />
          </div>
        )}
      </div>
    </section>
  );
};
