import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
import torch

data_path = "detection/datasets/combined_dataset.csv"
data = pd.read_csv(data_path)
print(f"Columns in dataset: {data.columns}")
data = data.rename(columns={"Text": "text", "Label": "label"})
if 'Label' in data.columns:
    data = data.drop(columns=['Label'])
if 'label' not in data.columns:
    raise ValueError("The dataset is missing the 'label' column. Please check the data.")
data['label'] = data['label'].astype(str)
label_column = data['label']
print(f"Unique labels before mapping: {label_column.unique()}")
data['label'] = data['label'].apply(lambda x: x.strip().capitalize())
print(f"Unique labels after capitalizing: {data['label'].unique()}")


valid_labels = {'Phishing': 1, 'Legitimate': 0}
data['label'] = data['label'].map(valid_labels)

if data['label'].isnull().any():
    print("Found NaN values in 'label' column after mapping! These rows will be dropped.")
    data = data.dropna(subset=['label'])
data['label'] = data['label'].astype(int)
print(f"Unique labels after cleaning and conversion: {data['label'].unique()}")

train_texts, val_texts, train_labels, val_labels = train_test_split(
    data['text'].tolist(),
    data['label'].tolist(),
    test_size=0.2,
    random_state=42
)


tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=512)
val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=512)

train_labels = torch.tensor(train_labels)
val_labels = torch.tensor(val_labels)
class PhishingDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = self.labels[idx]
        return item

train_dataset = PhishingDataset(train_encodings, train_labels)
val_dataset = PhishingDataset(val_encodings, val_labels)

model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

training_args = TrainingArguments(
    output_dir="detection/models",  # Directory to save the model
    num_train_epochs=3,             # Number of epochs to train the model
    per_device_train_batch_size=16, # Batch size for training
    per_device_eval_batch_size=16,  # Batch size for evaluation
    warmup_steps=500,               # Number of warmup steps for learning rate scheduler
    weight_decay=0.01,              # Strength of weight decay (regularization)
    logging_dir="logs",             # Directory to save logs
    logging_steps=10,               # Log every 10 steps
    evaluation_strategy="epoch",    # Evaluate model at the end of every epoch
    save_strategy="epoch"           # Save model at the end of every epoch
)
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset
)

trainer.train()
model.save_pretrained("detection/models")
tokenizer.save_pretrained("detection/models")
