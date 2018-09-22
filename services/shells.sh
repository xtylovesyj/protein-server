#!/bin/bash
echo "Hello World !"

IP=""
NAME=""
PASSWORD=""
NEWPASSWORD=""

while getopts "H:U:P:N:" arg #选项后面的冒号表示该选项需要参数
do
        case $arg in
             H)
                IP=$OPTARG
                ;;
             U)
                NAME=$OPTARG
                ;;
             P)
                PASSWORD=$OPTARG
                ;;
             N)
                NEWPASSWORD=$OPTARG
                ;;
             ?)  #当有不认识的选项的时候arg为?
            echo "含有未知参数"
        exit 1
        ;;
        esac
done

echo $IP
echo $NAME