import { FC } from "react";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { Select } from "../../components/App/Select/Select";
import { FaChevronDown } from "react-icons/fa";
import { debounce } from "../../services/util/utilService";
import { Workout } from "../../../../shared/types/workout";
import "./WorkoutEditMainInputs.scss";

type WorkoutEditMainInputsProps = {
  workout: Workout;
  handleTypeSelectChange: (type: string) => void;
  handleDurationInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSplitSelectChange: (split: string) => void;
};

export const WorkoutEditMainInputs: FC<WorkoutEditMainInputsProps> = ({
  workout,
  handleTypeSelectChange,
  handleDurationInputChange,
  handleDescInputChange,
  handleSplitSelectChange,
}) => {
  const isAnaerobic = workout && workout?.type === "anaerobic";

  return (
    <>
      <div className="workout-edit__form__input-container name-input">
        <label>description:</label>
        <input
          type="text"
          defaultValue={workout.description}
          onChange={debounce(handleDescInputChange, 500).debouncedFunc}
        />
      </div>
      {handleDurationInputChange && (
        <div className="workout-edit__form__input-container name-input">
          <label>duration:</label>
          <input
            type="number"
            defaultValue={workout.durationInMin}
            onChange={debounce(handleDurationInputChange, 500).debouncedFunc}
          />
        </div>
      )}
      <div className="workout-edit__form__input-container">
        <label>workout type:</label>
        <Select onChange={handleTypeSelectChange} listHeight={250}>
          <Select.SelectTrigger>
            <div>
              <span>{workout.type}</span>
              <FaChevronDown />
            </div>
          </Select.SelectTrigger>
          <Select.SelectList>
            <Select.SelectItem value="anaerobic">anaerobic</Select.SelectItem>
            <Select.SelectItem value="aerobic">aerobic</Select.SelectItem>
          </Select.SelectList>
        </Select>
      </div>

      {isAnaerobic && (
        <div className="workout-edit__form__input-container">
          <label>split:</label>

          <Select onChange={handleSplitSelectChange} listHeight={250}>
            <Select.SelectTrigger>
              <div>
                <span>{workout.split}</span>
                <FaChevronDown />
              </div>
            </Select.SelectTrigger>
            <Select.SelectList>
              {workoutUtilService.SPLIT_TYPES.map(type => (
                <Select.SelectItem value={type} key={type}>
                  {type}
                </Select.SelectItem>
              ))}
            </Select.SelectList>
          </Select>
        </div>
      )}
    </>
  );
};
