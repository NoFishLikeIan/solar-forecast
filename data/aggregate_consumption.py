import pathlib
import json

import pandas as pd

if __name__ == "__main__":
    data_path = pathlib.Path("consumption")
    data = []

    for subdir in data_path.iterdir():
        if subdir.is_file() and subdir.suffix == '.json':

            print(f"Working on '{subdir}'...", end = '\r')

            with open(subdir, 'r') as file:
                daily_data = json.load(file)
                hourly_data = daily_data['data']['graphData']

                data += hourly_data

    df = pd.DataFrame.from_records(data)
    df.columns = [
        col.replace("ldn", "supplied").replace("odn", "received") for col in df.columns
    ]

    df.to_csv("consumption/hourly.csv", index = False)