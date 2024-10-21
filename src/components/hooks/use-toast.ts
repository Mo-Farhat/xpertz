import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      sonnerToast[variant === "destructive" ? "error" : "success"](title, {
        description,
      });
    },
  };
};