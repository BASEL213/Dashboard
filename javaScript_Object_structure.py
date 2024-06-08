import csv

data = {
    '2017': {
        "Computer science": 180000,
        'Busniess': 70000,
        'Enginering': 135000,
        'Science': 400000,
    },
    '2018': {
        "Computer science": 600000,
        'Busniess': 300000,
        'Enginering': 1598040,
        'Science': 900000,
    },
    '2019': {
        "Computer science": 1200000,
        'Busniess': 900000,
        'Enginering': 1900000,
        'Science': 1500000,
    },
    '2020': {
        "Computer science": 1800000,
        'Busniess': 1200000,
        'Enginering': 2400000,
        'Science': 2100000,
    },
    '2021': {
        "Computer science": 2500000,
        'Busniess': 1700000,
        'Enginering': 3000000,
        'Science': 2900000,
    },
    '2022': {
        "Computer science": 3000000,
        'Busniess': 2400000,
        'Enginering': 3800000,
        'Science': 3500000,
    },
    '2023': {
        "Computer science": 4200000,
        'Busniess': 2900000,
        'Enginering': 4080004,
        'Science': 4500000,
    },
}

# Specify the output CSV file
csv_file_path = "Major_raise.csv"

# Open the CSV file in write mode
with open(csv_file_path, mode="w", newline="") as csv_file:
    # Create a CSV writer
    csv_writer = csv.writer(csv_file)

    # Write the header row with columns in the desired order
    csv_writer.writerow(["Year", "Computer science",
                        "Busniess", "Enginering", "Science"])

    # Write data rows
    for year, majors in data.items():
        # Write data for each major in the desired order
        csv_writer.writerow([year, majors["Computer science"],
                            majors["Busniess"], majors["Enginering"], majors["Science"]])

print(f"CSV file '{csv_file_path}' has been created successfully.")
