# include make.conf
# Variables from make.conf:
#
DOCKER_REPO=docker-repo.bloomington.in.gov/cob
IMAGE_NAME = mybloomington
REQS := git jq docker
K := $(foreach r, ${REQS}, $(if $(shell command -v ${r} 2> /dev/null), '', $(error "${r} not installed")))
VERSION := $(shell jq -r '.version' package.json)
COMMIT := $(shell git rev-parse --short HEAD)

default: docker

docker:
	docker build . --platform=linux/amd64 -t ${DOCKER_REPO}/${IMAGE_NAME}:${VERSION}${COMMIT}-fix
	docker push ${DOCKER_REPO}/${IMAGE_NAME}:${VERSION}${COMMIT}-fix
