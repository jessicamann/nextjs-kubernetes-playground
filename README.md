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

## Graceful shutdown (sorta)

The sample repo has these following:
- an endpoint `/api/hello` which takes at least 10s to complete
- kubernetes deployment manifest with rolling deploy (sort of)

The deploy manifest is setup to ensure there's only 1 pod in a replicaset, and that during a deploy event, it can begin to terminate the existing pod immediately while spinning up a while pod simulateously.

This is just so that we can reliably test dropped request behavior without similating realistic traffic across many pods.

### Setup kubernetes-like deploy environment

start minikube:
```
minikube start && minikube dashboard
```

build & load image:
```
docker build -t my-app:v1 . && minikube image load my-app:v1
```

Deploy the service:

```
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

Minikube assigns a random port from host to expose the service, to get the url, run the following:

_(if you're on mac, do this in a separate window, as it'll need to stay open)_

```
minikube service my-app-service --url
```

You can now access the service using the outputed url: 

```
curl <url>/api/hello
```

### Default behavior: instance stops and midflight requests are dropped

1. Increment the `app.kubernetes.io/version`, but don't apply yet
2. Send a request to `/api/hello` [__A__]
3. Deploy with the new version
4. Send another request to `/api/hello` [__B__]

Give it a few seconds, and you should see that [__A__] fails with an empty response from server, while [__B__] succeeds. 

This is because:
- [__A__] was served by the terminating pod, which is killed before request completes.
- [__B__] was served by the new pod, as kubernetes mark "terminating" pods as dead pods and doesn't direct traffic there

### Naive graceful shutdown: just wait for your longest operation

1. Increase `terminationGracePeriodSeconds` to `15` in [deployment.yaml](./kubernetes/deployment.yaml), and apply the deployment
2. Increment the `app.kubernetes.io/version`, but don't apply yet
3. Send a request to `/api/hello` [__A__]
4. Deploy with the new version

Give it a few seconds, and you'll see [__A__] succeeds, despite the deployment happening.

This is because:
- `terminationGracePeriodSeconds` ensures that kubernetes wait for `15s` before sending the pod `SIGTERM` signal.
- Since we've set the grace period to be a least as long as the longest operation, [__A__] finishes successfully.

### Cleanup

```
minikube stop
minikube delete --all
```