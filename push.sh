#!/bin/bash
git add *

if [ "$1" = "" ]
then
    echo "没有commit -m的输入，请输入commit -m内容，以[ENTER]结束："
    read msg
    git commit -m "$msg"
    git push
else
    git commit -m "$1"
    git push
fi
