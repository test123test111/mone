#!/usr/bin/sh bash
if [ -d "./store_marketing" ];then rm -rvf ./store_marketing;fi;
./git_clone.exp
#build cmd mvn clear;-Dtest.ignore package
cd store_marketing
mvn clear
mvn -Dmaven.test.skip=true package
#mkdir result
#cp target/*.war ./result
#cp target/*.zip ./result


