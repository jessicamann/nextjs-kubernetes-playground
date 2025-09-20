## Load loading with k6

How many concurrent request can a nextjs server _really_ handle before it just can't anymore?


### Setup kubernetes-like deploy environment

start minikube:
```
minikube start && minikube addons enable metrics-server && minikube dashboard
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

### Run the load test

Enter the exposed url in the [test file](./load_tests/spike_test.js), which is setup to have a spike in traffic that comes down after a very brief period.

Then run the test.

```
K6_WEB_DASHBOARD=true k6 run load_tests/spike_test.js
```

### Cleanup

```
minikube stop
minikube delete --all
```