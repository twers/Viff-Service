Viff Service ![Build Status](https://travis-ci.org/twers/Viff-Service.png)
===============

Viff as service in cloud, no need to install again, MATE!!


Development
---------------

1. ```npm install --g grunt-cli```
2. ```git clone https://github.com/twers/Viff-Service.git```
3. ```npm install```
4. ```grunt dev```

##Installation

1. Use `git clone --recursive git@github.com:twers/Viff-Service.git` to clone the repository. Please beware that `--recursive` would ensure you install all submodules required by Chef.
2. Ensure you have installed software below, with correct version:
	* VirtualBox 4.3.4
	* Vagrant 1.4.0
3. Run `vagrant box list` to check if you have installed `precise64` box. If not, install one from Internet or local sharing drive.
4. Run `vagrant up` in the repository. It will take about 50 minutes. Be patient.
5. When it's finished, use `vagrant ssh` to connect and check if packages are installed. You could run `which viff` and similarly for `mocha`, `karma`, `grunt`, `bower`, `express`, `coffee`, `mongod`, `phantomjs`.


HISTORY
---------------

Project Created  ----- 2013/12/10


TODO
---------------

1. REVISION NUMBER for static files
