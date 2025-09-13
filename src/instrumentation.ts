import { registerOTel } from "@vercel/otel";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (process.env.NEXT_MANUAL_SIG_HANDLE) {
      const delay = 10 * 1000;
      process.on("SIGTERM", async () => {
        console.log(
          `received signal SIGTERM, commencing shutdown timer ${delay}ms`,
        );
        await new Promise((r) => setTimeout(r, delay));
        console.log("shutdown complete");
        process.exit(0);
      });
    }
  }

  registerOTel({
    serviceName: "my-frontend-app",
  });
}
