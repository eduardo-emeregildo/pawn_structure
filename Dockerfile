
#NEW DOCKERFILE

# SCID in debian-based docker container.
#
# Using the SCID chess DB implementation here:
# http://scidvspc.sourceforge.net/
#

#install scidvspc
FROM debian:buster-slim
ENV SCID_VERSION=4.19
WORKDIR /home/scid
ADD https://downloads.sourceforge.net/project/scidvspc/source/scid_vs_pc-${SCID_VERSION}.tgz /home/scid


RUN if [ ! -d scid_vs_pc-${SCID_VERSION} ]; then tar xvzf scid_vs_pc-${SCID_VERSION}.tgz; fi \
  && cd scid_vs_pc-${SCID_VERSION} \
  && BUILD_PKGS="make g++ tk-dev tcl-dev" && RUNTIME_PKGS="tk tcl tcl-snack" \
  && MISC_PKGS="inetutils-ping nodejs npm ssh" \
  && apt-get update \
  && apt-get -y install ${RUNTIME_PKGS} ${MISC_PKGS} ${BUILD_PKGS} \
  && ./configure && make install \
  && cp -r sounds /usr/local/share/scid/ \
  && apt-get remove --purge -y $BUILD_PKGS \
  && cd .. \
  && rm -rf /var/lib/apt/lists/* scid_vs_pc-${SCID_VERSION}*

 # Get my project set up
WORKDIR /usr/local/src
COPY . .
RUN npm install
ENV PORT=3000
EXPOSE 3000
CMD ["npm","run","start"]
