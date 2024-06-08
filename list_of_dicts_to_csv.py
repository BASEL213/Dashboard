import csv

to_csv =[{
    'major': "SW",
    'value': 1200
    }, {
        'major': "DSAI",
        'value': 1809
    }, {
        'major': "IT",
        'value': 1000
        }, {
    'major': "Finance",
    'value': 500
    }, {
    'major': "marketing",
    'value': 900
    }, {
    'major': "accounting",
    'value': 1114
    }, {
    'major': "nanotech ",
    'value': 1500
    }, {
    'major': "biomedical",
    'value': 1100
    }, {
    'major': "civil",
    'value': 665
    }, {
    'major': "CIE",
    'value': 1300
    }, {
    'major': "Material",
    'value': 441
    }]

keys = to_csv[0].keys()

with open('income.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(to_csv)
