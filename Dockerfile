FROM node:15.1

# sort of a hack to make docker cache dependencies based on the state of
# package.json - will only run npm install again if package.json changes
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /home/node/mybloomington && cp -a /tmp/node_modules /home/node/mybloomington

# the .dockerignore file will exclude the node_modules folder from being
# copied from the local machine when we ADD below
WORKDIR /home/node/mybloomington
ADD . .

# set watcher limits so nodemon doesn't explode when in dev mode
# this also needs to be set on your nodes
RUN echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf


ENTRYPOINT [ "npm", "run-script", "build+start" ]