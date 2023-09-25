import { FC } from "react";
import { SpellingSuggestion } from "../../../types/app";
import { Button } from "../../App/Button/Button";

type SpellingSuggestionListProps = {
  suggestions: SpellingSuggestion[];
  handleSuggestionClick: (original: string, suggestion: string) => void;
};

export const SpellingSuggestionList: FC<SpellingSuggestionListProps> = ({
  suggestions,
  handleSuggestionClick,
}) => {
  return (
    <ul className="spelling-suggestion-list">
      {suggestions.map(s => (
        <li className="spelling-suggestion-list__item" key={s.original}>
          {s.suggestions.map(suggestion => (
            <Button
              className="intake-item-edit__btn spelling-suggestion-list__btn"
              onClickFn={() => handleSuggestionClick(s.original, suggestion)}
              key={suggestion}
            >
              <span>{suggestion}</span>
            </Button>
          ))}
        </li>
      ))}
    </ul>
  );
};
