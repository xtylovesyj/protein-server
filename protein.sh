#!/bin/bash
echo "start to run code!"
PROTEIN_NAME=""
PROTEIN_ROOT_PATH=""

while getopts "P:N:" arg #选项后面的冒号表示该选项需要参数
do
        case $arg in
             P)
                PROTEIN_NAME=$OPTARG
                ;;
             N)
                PROTEIN_ROOT_PATH=$OPTARG
                ;;
             ?)  #当有不认识的选项的时候arg为?
            echo "含有未知参数"
        exit 1
        ;;
        esac
done

cd ~/$PROTEIN_ROOT_PATH/$PROTEIN_NAME/outputFolder
#rm *
~/rosetta_bin_linux_2016.32.58837_bundle/main/source/bin/AbinitioRelax.linuxgccrelease @../inputFolder/flags >log
#~/spicker
echo "End"