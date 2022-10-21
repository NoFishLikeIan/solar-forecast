import pandas as pd

def parse_weather(filepath:str) -> pd.DataFrame:
    df = pd.read_json(filepath)

    df = df.pivot(
        index = "date",
        columns = "station_code",
        values = df.columns[2:]
    )

    return df


if __name__ == "__main__":
    df = parse_weather("weer-data.json")