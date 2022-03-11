include make.conf
# Variables from make.conf:
#
# DOCKER_REPO=https://docker.example.org/somewhere
IMAGE_NAME = mybloomington
REQS := git jq docker
K := $(foreach r, ${REQS}, $(if $(shell command -v ${r} 2> /dev/null), '', $(error "${r} not installed")))
VERSION := $(shell jq -r '.version' package.json)
COMMIT := $(shell git rev-parse --short HEAD)

default: docker

docker:
	docker build . -t ${DOCKER_REPO}/${IMAGE_NAME}:${VERSION}-${COMMIT} --build-arg VERSION=${COMMIT}
	docker push ${DOCKER_REPO}/${IMAGE_NAME}:${VERSION}-${COMMIT}
