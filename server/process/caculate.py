#!/usr/bin/python
#-*- coding: utf-8 -*-
import json

fscore = open('./process/score.out','r')
frome = open('./process/rome.out','r')

fresult = open('./process/final.out','w')

x = fscore.read()
list_ = x.strip('\n').split(' ')[1:]
sum_ = 0
for score in list_:
	sum_ += float(score)
score = sum_ / len(list_) * 100

wow = False
x = frome.read()
rome = x.split('|')[1].replace(' ','')

d = {'score':score,'rome':rome}
print score
print rome

json.dump(d,fresult)

