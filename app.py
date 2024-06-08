import flask
import sqlite3
import pandas as pd
from sqlalchemy import create_engine

app = flask.Flask(__name__)

df = pd.read_csv('AVG_GPA.csv')

df1 = pd.read_csv('categories.csv')

df2 = pd.read_csv('income.csv')

df3 = pd.read_csv('Major_raise.csv')


# app.config['SQLALCHEMY_DATABASE_URI'] = r'sqlite:///database.db'


@app.route('/')
@app.route('/index')
def index():
    return flask.render_template('index.html')


@app.route('/clustre_bar_data')
def clustre_bar_data():
    year = df['year'].values
    csai = df['CSAI'].values
    science = df['Science'].values
    engineering = df['Engineering'].values
    business = df['Busniess'].values

    data = []

    for i in range(len(year)):
        data.append({'year': str(year[i]),
                     'CSAI': float(csai[i]),
                     'Science': float(science[i]),
                     'Engineering': float(engineering[i]),
                     'Busniess': float(business[i])})
    return flask.jsonify(data)


@app.route('/data_index1')
def data_index1():
    data = []

    for _, row in df1.iterrows():
        entry_type = row['Type']
        entry_percent = row['Percent']
        entry_color = row['Color']

        # Check if it's a main entry or a sub-entry
        if pd.notna(row['SubType']):
            sub_type = row['SubType']
            sub_percent = row['SubPercent']

            found = False
            for entry in data:
                if entry['type'] == entry_type:
                    found = True
                    entry['subs'].append({"type": sub_type, "percent": sub_percent})
                    break

            if not found:
                data.append({"type": entry_type, "percent": entry_percent, "color": entry_color, "subs": [{"type": sub_type, "percent": sub_percent}]})
        else:
            data.append({"type": entry_type, "percent": entry_percent, "color": entry_color, "subs": []})

    return flask.jsonify(data)



@app.route('/data_index3')
def data_index3():
    data = {}

    for index, row in df3.iterrows():
        year = str(row['Year'])
        cs = int(row['Computer science'])
        bus = int(row['Busniess'])
        eng = int(row['Enginering'])
        sci = int(row['Science'])

        data[year] = {
            "Computer science": cs,
            "Busniess": bus,
            "Enginering": eng,
            "Science": sci,
        }

    return flask.jsonify(data)

@app.route('/data_index2')
def data_index2():
    data = []

    # Iterate through each row in the DataFrame
    for _, row in df2.iterrows():
        # Extract 'major' and 'value' from each row and create a dictionary
        entry_major = row['major']
        entry_value = row['value']

        data.append({'major': entry_major, 'value': entry_value})

    return flask.jsonify(data)
#
# ###############################
# '''SELECT COUNT(*) AS TotalStudents
# FROM university; ''' #totalnumber of students
#
# ''' SELECT School, COUNT(*) AS StudentsPerSchool
# FROM university
# GROUP BY School
# HAVING COUNT(*) > 1; ''' #number of students in each school
#
# '''SELECT Major, COUNT(*) AS StudentsPerSchool
# FROM university
# GROUP BY Major
# HAVING COUNT(*) > 1; ''' #number of student in each major
#
# '''SELECT
#     COUNT(*) AS TotalStudents,
#     (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM university)) AS PercentageOfTotal
# FROM university; ''' #total num of students 100%
#
# '''SELECT
#     School,
#     COUNT(*) AS StudentsPerSchool,
#     ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM university)), 2) AS PercentOfTotalStudents
# FROM university
# GROUP BY School
# HAVING COUNT(*) > 1; '''#percent of each total num of student in each school
#
# '''SELECT
#     Major,
#     COUNT(*) AS StudentsPermajor,
#     ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM university)), 2) AS PercentOfTotalStudents
# FROM university
# GROUP BY Major
# HAVING COUNT(*) > 1;''' #percent of each total num of student in each major
#
# '''SELECT
#     School,
#     COUNT(*) AS StudentsPerSchool,
#     ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM university)), 2) AS PercentOfTotalStudents_School
# FROM university
# GROUP BY School
# HAVING COUNT(*) > 1
#
# UNION ALL
#
# SELECT
#     Major,
#     COUNT(*) AS StudentsPerMajor,
#     ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM university)), 2) AS PercentOfTotalStudents_Major
# FROM university
# GROUP BY Major
# HAVING COUNT(*) > 1;''' #percent of each total num of student in each major&school
#
#
# #bar cahrt
# '''SELECT Major,
#     CASE
#         WHEN SUM(INCOME) >= 1000000 THEN ROUND(SUM(INCOME) / 1000000, 2) || 'M'
#         ELSE CAST(SUM(INCOME) AS TEXT)
#     END AS TotalIncome
# FROM university
# WHERE Major IS NOT NULL
# GROUP BY Major;'''#total income to each major
#
# #line chart
# '''SELECT School,
#     CASE
#         WHEN SUM(INCOME) >= 1000000 THEN ROUND(SUM(INCOME) / 1000000, 2) || 'M'
#         ELSE CAST(SUM(INCOME) AS TEXT)
#     END AS TotalIncome
# FROM university
# WHERE School IS NOT NULL
# GROUP BY School
# HAVING sum(INCOME) > 100000;''' #total income to each school
#
# #line target chart
# '''SELECT School,
#     CASE
#         WHEN SUM(INCOME) >= 1000000 THEN ROUND(SUM(INCOME) / 1000000, 2) || 'M'
#         WHEN SUM(INCOME) >= 1000 THEN ROUND(SUM(INCOME) / 1000, 2) || 'K'
#         ELSE CAST(SUM(INCOME) AS TEXT)
#     END AS TotalIncome,
#     CASE
#         WHEN (SELECT AVG(INCOME) FROM university) >= 1000000 THEN ROUND((SELECT AVG(INCOME) FROM university) / 1000000, 2) || 'M'
#         WHEN (SELECT AVG(INCOME) FROM university) >= 1000 THEN ROUND((SELECT AVG(INCOME) FROM university) / 1000, 2) || 'K'
#         ELSE CAST((SELECT AVG(INCOME) FROM university) AS TEXT)
#     END AS Target
# FROM university
# WHERE School IS NOT NULL
# GROUP BY School
# HAVING SUM(INCOME) > 100000;'''#total income to each school and setting the target
#
#
# #clusterd bar chart
# '''SELECT School, Year, ROUND(AVG(cGPA), 2) AS AverageCGPA
# FROM university
# GROUP BY School, year
# HAVING avg(cGPA) > 1;'''#avrg cgpa to each school during years


if __name__ == '__main__':
    app.run(debug=True)
