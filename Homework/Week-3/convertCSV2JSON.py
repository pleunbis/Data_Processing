# Name: Pleun Bisseling
# Studentnumber: 10591249

import csv
import json

# open both files and declare fieldnames
csvfile = open('index.csv', 'r')
jsonfile = open('index.json', 'w')
fieldnames = ("Jaar", "Indexcijfer")

# read csvfile and write each row of data in jsonfile
reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
	json.dump(row, jsonfile)
	jsonfile.write(',\n')

csvfile.close()
jsonfile.close()
