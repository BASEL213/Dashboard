import csv

data = [
    {
        "type": "Science",
        "percent": 35,
        "color": '#2990a6',
        "subs": [
            {"type": "biomedical", "percent": 20},
            {"type": "Nanotech", "percent": 15}
        ],
    },
    {
        "type": "Engineering",
        "percent": 25,
        "color": '#1a5b69',
        "subs": [
            {"type": "civil", "percent": 5},
            {"type": "Nanotech", "percent": 10},
            {"type": "Material", "percent": 10}
        ],
    },
    {
        "type": "CS",
        "percent": 30,
        "color": '#1f6d7d',
        "subs": [
            {"type": "DSAI", "percent": 15},
            {"type": "SW", "percent": 10},
            {"type": "IT", "percent": 5}
        ],
    },
    {
        "type": "Business",
        "percent": 15,
        "color": '#247e92',
        "subs": [
            {"type": "Marketing", "percent": 5},
            {"type": "Finance", "percent": 7},
            {"type": "Accounting", "percent": 3}
        ],
    },
]

# Specify the output CSV file
csv_file_path = "categories.csv"

# Open the CSV file in write mode
with open(csv_file_path, mode="w", newline="") as csv_file:
    # Create a CSV writer
    csv_writer = csv.writer(csv_file)

    # Write the header row
    csv_writer.writerow(["Type", "Percent", "Color", "SubType", "SubPercent"])

    # Write data rows
    for entry in data:
        type_value = entry["type"]
        percent_value = entry["percent"]
        color_value = entry["color"]

        # Write the main row
        csv_writer.writerow([type_value, percent_value, color_value, "", ""])

        # Write sub-rows if any
        for sub_entry in entry.get("subs", []):
            sub_type_value = sub_entry["type"]
            sub_percent_value = sub_entry["percent"]

            # Write the sub-row
            csv_writer.writerow(["", "", "", sub_type_value, sub_percent_value])

print(f"CSV file '{csv_file_path}' has been created successfully.")
