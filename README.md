## Traces locally

Start [all-in-one jaegar setup](https://www.jaegertracing.io/docs/2.10/getting-started/) to have the collector and ingestor setup.

```bash
docker run --rm --name jaeger \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 5778:5778 \
  -p 9411:9411 \
  cr.jaegertracing.io/jaegertracing/jaeger:2.10.0
```

Go to `http://localhost:16686` to access jaegar UI.

Start the application locally

```bash
npm run dev
```

Go to `http://localhost:3000` and play around. Or hit your server apis, and you'll see traces.

## Graceful shutdown

Mimick Kubernetes termination signals to pods.

`kill -s SIGTERM <processid>`


todo: package app & run in minikube

`docker build -t my-app .`

`docker run -p 3000:3000 --rm my-app:latest`

