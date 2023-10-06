import { FC } from "react";
import { SpellingSuggestion } from "../../../types/app";
import { Button } from "../../../components/App/Button/Button";

type SpellingSuggestionListProps = {
  suggestions: SpellingSuggestion[];
  handleSuggestionClick: (original: string, suggestion: string) => void;
  handleIgnoreSuggestionClick: (original: string) => void;
};

export const SpellingSuggestionList: FC<SpellingSuggestionListProps> = ({
  suggestions,
  handleSuggestionClick,
  handleIgnoreSuggestionClick,
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
          <Button
            className="intake-item-edit__btn spelling-suggestion-list__btn"
            onClickFn={() => handleIgnoreSuggestionClick(s.original)}
          >
            <span>ignore</span>
          </Button>
        </li>
      ))}
    </ul>
  );
};
