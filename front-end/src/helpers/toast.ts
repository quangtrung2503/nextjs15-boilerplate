// utils/notifications.ts
import { upperFirst } from "lodash";
import { useSnackbar } from "../providers/ToastifyProvider";

// Define the structure of an error response (if available)
interface ErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, unknown>;
      title?: string;
      messages?: string[] | string;
    };
  };
}

export const useNotifications = () => {
  const { showSnackbar } = useSnackbar();

  const showSuccess = (msg?: string) => {
    if (typeof msg === "string") {
      showSnackbar(msg, "success");
    } else {
      showSnackbar("Operation successful", "success");
    }
  };

  const showError = (error: ErrorResponse | string | unknown) => {
    if (typeof error === "object" && error !== null && 'response' in error) {
      const { response } = error as ErrorResponse;
      const data = response?.data;

      if (data) {
        if (data.errors) {
          showSnackbar(JSON.stringify(data.errors), "error");
          return;
        }
        if (data.title) {
          showSnackbar(JSON.stringify(data.title), "error");
          return;
        }
        if (Array.isArray(data.messages) && data.messages[0]) {
          showSnackbar(data.messages[0], "error");
          return;
        }
        if (data.messages) {
          showSnackbar(upperFirst(data.messages.toString()), "error");
          return;
        }
      }
    }

    if (typeof error === "string" || (error && error.toString)) {
      showSnackbar(error.toString(), "error");
    } else {
      showSnackbar("An error occurred", "error");
    }
  };

  const showInfo = (msg: string) => {
    showSnackbar(msg, "info");
  };

  const showWarning = (msg: string) => {
    showSnackbar(msg, "warning");
  };

  return { showSuccess, showError, showInfo, showWarning };
};
