import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Card } from "@heroui/react";

/**
 * 🏗️ STATE MACHINE PATTERN
 * Defining the mutually exclusive modes the component can be in.
 */
type ViewState = "idle" | "error";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  status: ViewState;
  error: Error | null;
}

const ERROR_UI_CONFIG = {
  title: "Oops! Something went wrong",
  message: "The application encountered an unexpected error. Don't worry, your data is safe.",
  buttonText: "Try Again",
  icon: "⚠️",
};

/**
 * 🛡️ React Senior Implementation: ErrorBoundary
 * Encapsulating lifecycle-based error catching with modern UI patterns.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    status: "idle",
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { status: "error", error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ status: "idle", error: null });
  };

  public render() {
    if (this.state.status === "error") {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="max-w-md shadow-lg border-danger/10 bg-danger/5">
            <Card.Header className="flex gap-3 pt-6 px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-xl overflow-hidden">
                {ERROR_UI_CONFIG.icon}
              </div>
              <div className="flex flex-col">
                <Card.Title className="text-md font-bold text-danger leading-tight">
                  {ERROR_UI_CONFIG.title}
                </Card.Title>
                <Card.Description className="text-xs text-default-500 uppercase tracking-wider font-semibold">
                  System Exception
                </Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="px-6 py-4">
              <p className="text-default-600 leading-relaxed font-sans text-sm">
                {ERROR_UI_CONFIG.message}
              </p>
              {this.state.error && (
                <div className="mt-4 rounded-md bg-default-100 p-3 text-xs font-mono text-default-500 overflow-auto max-h-32 shadow-inner border border-default-200">
                  {this.state.error.toString()}
                </div>
              )}
              <Card.Footer className="mt-6 flex justify-end p-0 pb-6 pr-0">
                <Button 
                  variant="danger" 
                  onPress={this.handleReset}
                  className="font-bold px-8"
                >
                  {ERROR_UI_CONFIG.buttonText}
                </Button>
              </Card.Footer>
            </Card.Content>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
