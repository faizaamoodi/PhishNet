import pandas as pd
import os

#1: phishing, 0: non-phishing
datasets = [
    {"file": "detection/datasets/CEAS_08.csv", "label": "phishing"},
    {"file": "detection/datasets/Enron.csv", "label": "legitimate"},
    {"file": "detection/datasets/Ling.csv", "label": "phishing"},
    {"file": "detection/datasets/Nazario.csv", "label": "phishing"},
    {"file": "detection/datasets/Nigerian_Fraud.csv", "label": "phishing"},
    {"file": "detection/datasets/SpamAssasin.csv", "label": "legitimate"},
]

# combine
all_data = []

for dataset in datasets:
    df = pd.read_csv(dataset["file"], encoding='ISO-8859-1')
    df = df.rename(columns={df.columns[0]: "Text"})  # Ensure first column is "Text"
    df["Label"] = dataset["label"]
    all_data.append(df)
combined_df = pd.concat(all_data, ignore_index=True)
combined_df.to_csv("combined_dataset.csv", index=False)
print("Datasets combined into 'combined_dataset.csv'")
