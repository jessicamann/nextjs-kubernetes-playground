// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("custom-tracer");

type Data = {
  name: string;
};

const anotherSlightlyLessExpensiveFunction = (): Promise<any> => {
  const span = tracer.startSpan("/hello.anotherSlightlyLessExpensiveFunction");
  const delayMs = 2 * 1000;
  span.setAttributes({
    delay: delayMs,
  });

  return new Promise((resolve) => setTimeout(resolve, delayMs)).finally(() =>
    span.end(),
  );
};

const someExpensiveFunction = (): Promise<any> => {
  const delayMs = 10 * 1000;
  console.log(`running expensive function, with delay ${delayMs}`);

  const span = tracer.startSpan("/hello.someExpensiveFunction");
  span.setAttributes({
    delay: delayMs,
  });

  return new Promise((resolve) => setTimeout(resolve, delayMs)).finally(() =>
    span.end(),
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await someExpensiveFunction();
  await anotherSlightlyLessExpensiveFunction();

  res.status(200).json({ name: "John Doe" });
}
