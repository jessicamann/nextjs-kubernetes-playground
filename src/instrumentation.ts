import { registerOTel } from '@vercel/otel'
 
export function register() {
  registerOTel({ serviceName: 'my-frontend-app' })
}