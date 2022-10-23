import pandas as pd


def parse_weather(filepath: str) -> pd.DataFrame:
    df = pd.read_json(filepath)
    return df


if __name__ == "__main__":
    df = parse_weather("weather/hourly.json")
    df.to_csv("weather/hourly.csv", index = False)