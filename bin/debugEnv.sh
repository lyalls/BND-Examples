#?/bin/bash

currDir=`pwd`
echo 'current dir:' $currDir
npm i

cd ../BND-ServiceProvider-HTTP
providerDir=`pwd`
echo "provider dir:" $providerDir
npm i

cd ../BND-ServiceDriver-HTTP
driverDir=`pwd`
echo "driver dir:" $driverDir
npm i

cd ../BND-Kernel
kernelDir=`pwd`
echo "kernel dir:" $kernelDir
npm i

cd "$kernelDir"
npm link

echo "***********"
cd "$providerDir"
npm link "$kernelDir" && npm link 
ls -l ./node_modules|grep bnd

echo "***********"
cd "$driverDir"
npm link "$kernelDir" && npm link 
ls -l  ./node_modules|grep bnd

echo "***********"
cd "$currDir"
npm link "$kernelDir"
npm link "$providerDir"
npm link "$driverDir"
ls -l ./node_modules|grep bnd
