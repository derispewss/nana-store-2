import * as React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

const Alert = React.forwardRef(({ children, variant = "default", className = "", ...props }, ref) => {
    const getVariantStyles = () => {
        switch (variant) {
        case "destructive":
            return "bg-red-50 border-red-500 text-red-600";
        case "success":
            return "bg-green-50 border-green-500 text-green-600";
        case "warning":
            return "bg-yellow-50 border-yellow-500 text-yellow-600";
        case "info":
            return "bg-blue-50 border-blue-500 text-blue-600";
        default:
            return "bg-gray-50 border-gray-300 text-gray-600";
        }
    };
    const getIcon = () => {
        switch (variant) {
        case "destructive":
            return <AlertCircle className="h-5 w-5" />;
        case "success":
            return <CheckCircle2 className="h-5 w-5" />;
        case "warning":
            return <AlertTriangle className="h-5 w-5" />;
        case "info":
            return <Info className="h-5 w-5" />;
        default:
            return <Info className="h-5 w-5" />;
        }
    };
    return (
        <div
            ref={ref}
            role="alert"
            className={`relative flex items-start gap-3 rounded-lg border p-4 ${getVariantStyles()} ${className}`}
            {...props}>
            {getIcon()}
            <div className="flex-1">{children}</div>
        </div>
    );
    });
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
    <div
        ref={ref}
        className={`text-sm leading-relaxed ${className}`}
        {...props}
    />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };