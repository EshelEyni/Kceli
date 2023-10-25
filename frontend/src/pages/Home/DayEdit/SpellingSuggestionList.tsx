import { FC } from "react";
import { Button } from "../../../components/App/Button/Button";
import { useIntakeItemEdit } from "./IntakeItemEditContext";
import { SpellingSuggestion } from "../../../types/app";

export const SpellingSuggestionList: FC = () => {
  const { suggestions, handleSuggestionClick, handleIgnoreSuggestionClick } = useIntakeItemEdit();

  return (
    <ul className="spelling-suggestion-list" data-testid="spelling-suggestion-list">
      {suggestions.map((s: SpellingSuggestion, i: number) => (
        <li className="spelling-suggestion-list__item" key={i}>
          {s.suggestions.map(suggestion => (
            <Button
              className="intake-item-edit__btn spelling-suggestion-list__btn"
              onClickFn={() => handleSuggestionClick(s.original, suggestion)}
              dataTestId="spelling-suggestion-list-btn"
              key={suggestion}
            >
              <span>{suggestion}</span>
            </Button>
          ))}
          <Button
            className="intake-item-edit__btn spelling-suggestion-list__btn"
            dataTestId="ignore-suggestion-btn"
            onClickFn={() => handleIgnoreSuggestionClick(s.original)}
          >
            <span>ignore</span>
          </Button>
        </li>
      ))}
    </ul>
  );
};
