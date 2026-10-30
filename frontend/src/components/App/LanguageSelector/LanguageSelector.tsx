import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import userApiService from "../../../services/user/userApiService";
import { setLoggedInUser } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";

export function LanguageSelector() {
  const { t } = useTranslation();
  const { loggedInUser } = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: userApiService.updateLanguage,
    onSuccess: user => {
      dispatch(setLoggedInUser(user));
      queryClient.setQueryData([`user/${user.id}`], user);
      queryClient.invalidateQueries([`user/${user.username}`]);
    },
    onError: () => toast.error(t("Couldn't save your changes. Please try again.")),
  });
  if (!loggedInUser) return null;
  return (
    <select
      className="ui-language-selector"
      id="profile-language"
      aria-label={t("Interface language")}
      aria-busy={isLoading}
      disabled={isLoading}
      value={loggedInUser.language || "en"}
      onChange={event => mutate(event.target.value as "en" | "he")}
    >
      <option value="en" lang="en">
        English
      </option>
      <option value="he" lang="he">
        עברית
      </option>
    </select>
  );
}
