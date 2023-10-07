import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/App/Button/Button";
import nutritionApiService from "../../../services/nutritionApi/nutritionApiService";

type NutritionQueryIFormInput = {
  chatGPTQuery: string;
  ninjaAPIQuery: string;
  USDAAPIQuery: string;
};

type QueryResponse = {
  chatGPTResponse?: string;
  ninjaAPIResponse?: string;
  USDAAPIResponse?: string;
};

export const NutritionQuery: FC = () => {
  const [result, setResult] = useState<QueryResponse>({
    chatGPTResponse: "",
    ninjaAPIResponse: "",
    USDAAPIResponse: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { control, handleSubmit, setValue } = useForm<NutritionQueryIFormInput>({
    defaultValues: {
      chatGPTQuery: "",
      ninjaAPIQuery: "",
      USDAAPIQuery: "",
    },
  });

  async function onSubmit(data: NutritionQueryIFormInput) {
    if (data.chatGPTQuery) {
      const chatGPTResponse = await nutritionApiService.queryChatGPT(data.chatGPTQuery);
      setResult({ chatGPTResponse });
    }

    if (data.ninjaAPIQuery) {
      const ninjaAPIResponse = await nutritionApiService.queryNinja(data.ninjaAPIQuery);
      setResult({ ninjaAPIResponse });
    }

    if (data.USDAAPIQuery) {
      const USDAAPIResponse = await nutritionApiService.queryUSDA(data.USDAAPIQuery);
      setResult({ USDAAPIResponse });
    }
  }

  return (
    <section className="nutrition-query" data-testid="nutrition-query">
      <form className="nutrition-query__form" autoComplete="off">
        <Controller
          name="chatGPTQuery"
          control={control}
          render={({ field }) => <textarea {...field} />}
        />

        <Controller
          name="ninjaAPIQuery"
          control={control}
          render={({ field }) => <input {...field} />}
        />

        <Controller
          name="USDAAPIQuery"
          control={control}
          render={({ field }) => <input {...field} />}
        />

        <Button onClickFn={handleSubmit(onSubmit)}>Submit</Button>
      </form>

      <div className="nutrition-query__result">
        <h1>ChatGPT Response:</h1>
        <span>{result.chatGPTResponse}</span>

        <h1>Ninja API Response:</h1>
        <pre>{JSON.stringify(result.ninjaAPIResponse)}</pre>

        <h1>USDA API Response:</h1>
        <pre>{JSON.stringify(result.USDAAPIResponse)}</pre>
      </div>
    </section>
  );
};
