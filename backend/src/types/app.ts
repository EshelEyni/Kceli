export type alStoreType = Record<string, string>;

export interface ParsedReqQuery {
  [key: string]: string | undefined;
}

export type NinjaAPIResDataItem = {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
};

export type NinjaAPIResData = NinjaAPIResDataItem[];

export type USDAFoodNutrient = {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  derivationCode: string;
  derivationDescription: string;
  derivationId: number;
  value: number | string;
  foodNutrientSourceId: number;
  foodNutrientSourceCode: string;
  foodNutrientSourceDescription: string;
  rank: number;
  indentLevel: number;
  foodNutrientId: number;
  percentDailyValue?: number;
};

export type USDAFoodObject = {
  fdcId: number;
  description: string;
  dataType: string;
  gtinUpc: string;
  publishedDate: string;
  brandOwner: string;
  ingredients: string;
  marketCountry: string;
  foodCategory: string;
  modifiedDate: string;
  dataSource: string;
  servingSizeUnit: string;
  servingSize: number;
  householdServingFullText?: string;
  tradeChannels: string[];
  allHighlightFields: string;
  score: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  microbes: any[]; // Not sure what type this should be, as it's empty in the example.
  foodNutrients: USDAFoodNutrient[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finalFoodInputFoods: any[]; // Not sure what type this should be, as it's empty in the example.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  foodMeasures: any[]; // Not sure what type this should be, as it's empty in the example.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  foodAttributes: any[]; // Not sure what type this should be, as it's empty in the example.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  foodAttributeTypes: any[]; // Not sure what type this should be, as it's empty in the example.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  foodVersionIds: any[]; // Not sure what type this should be, as it's empty in the example.
};
