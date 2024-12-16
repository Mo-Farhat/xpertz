import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-center justify-center rounded-lg bg-muted p-2 gap-2", // Added gap and adjusted padding for a cleaner look
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] hover:bg-gray-900 active:translate-y-[1px] active:shadow-sm",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md hover:translate-y-[-1px] active:translate-y-[1px]",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md hover:translate-y-[-1px] active:translate-y-[1px]",
        ghost: "hover:bg-gray-100 hover:text-gray-900 hover:translate-y-[-1px] active:translate-y-[1px]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90",
      },
      size: {
        default: "h-10 px-5 text-base", // Increased padding and font size for a balanced look
        sm: "h-8 px-4 text-sm",
        lg: "h-12 px-6 text-lg", // Larger size for emphasis
        icon: "h-10 w-10", // For icon-only triggers
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size, className }))}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 p-4 rounded-md bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };