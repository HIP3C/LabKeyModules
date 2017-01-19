#!/bin/bash

# install the required libraries
apt-get -y install build-essential
apt-get -y install cfortran
apt-get -y install f2c
apt-get -y install fort77
apt-get -y install freeglut3-dev
apt-get -y install graphviz-dev
apt-get -y install g++
apt-get -y install libbz2-dev
apt-get -y install libcairo2-dev
# sudo apt-get install libssl1.0.0/trusty libssl-dev/trusty openssl/trusty
apt-get -y install libcurl4-openssl-dev
apt-get -y install libgsl0-dev
apt-get -y install libhdf5-serial-dev
apt-get -y install liblzma-dev
apt-get -y install libnetcdf-dev
apt-get -y install libprotobuf-dev
apt-get -y install libreadline-dev
apt-get -y install libxml2-dev
apt-get -y install openmpi-bin
apt-get -y install openmpi-common
apt-get -y install protobuf-compiler
apt-get -y install xorg-dev
apt-get -y install xvfb

apt-get -y autoremove


# install PCRE at least 8.32
add-apt-repository -y 'ppa:edd/misc'
apt-get update
apt-get install libpcre3-dev

# apt-get -y install pandoc
# apt-get -y install pandoc-citeproc

# use manual way below till
# pandoc version 1.12.3 or higher makes it
# must install R package 'rmarkdown' before hand as well
# PANDOC_VER='1.17.2'
# wget https://hackage.haskell.org/package/pandoc-${PANDOC_VER}/pandoc-${PANDOC_VER}.tar.gz
# tar xvzf pandoc-${PANDOC_VER}.tar.gz
# cd pandoc-${PANDOC_VER}
# wget -qO- https://get.haskellstack.org/ | sh
# stack init
# stack setup
# stack install
# mv /root/.local/bin/pandoc /usr/bin
