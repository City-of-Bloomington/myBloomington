# myBloomington

> Nuxtjs (Vue) application for displaying city related resources and information about a given address.

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Deployment
### Dependencies
To build a deployment you must have these dependencies installed locally:

* make
* docker

### Configure docker repo
You must provide your choice of Docker repository via a variable declared in a make.conf file.
```bash
DOCKER_REPO=https://docker.example.org/somewhere
```
You must also be logged into the Docker repository you declare.
```bash
docker login https://docker.example.org
```
### Build Docker image
This will build a tagged docker image, using the built WAR file, and push it to the docker repo.  You must already be logged into the DOCKER_REPO for this to work.

```bash
make docker
```
## Deploying with Helm
Deploys the Docker image into Kubernetes.

```
helm install mybloomington . -n dev -f /path/to/values.yml --set image.tag=X.x.x-abcdef00
```
