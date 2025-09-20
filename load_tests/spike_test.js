import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // Ramp up to 20 users over 1 minute
    { duration: '1m', target: 20 },   // sustained at 20 users for a minute
    { duration: '1m', target: 20*1000 },   // Ramp up to 1000% users over 1 minute
    { duration: '1m', target: 20 },    // Ramp down to 20 users over 1 minute
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<50'], // 95% of requests should be below 50ms
  },
};

export default function () {
  const res = http.get('http://127.0.0.1:51227');
  check(res, {
    'verify homepage text': (r) =>
      r.body.includes('Save and see your changes instantly'),
  });

  sleep(1);
}