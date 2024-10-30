import { toast } from "sonner";

type ToastProps = {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export const useToast = () => {
  return {
    toast: ({ title, description, variant, action }: ToastProps) => {
      toast[variant === "destructive" ? "error" : "success"](title, {
        description,
        action,
      });
    },
  };
};

// Re-export toast for direct usage
export { toast };

export type Toast = ToastProps;

export default useToast;