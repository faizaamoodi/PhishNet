from transformers import BertForSequenceClassification, BertTokenizer
import torch

# Load fine-tuned model and tokenizer
model = BertForSequenceClassification.from_pretrained("./phishing_model")
tokenizer = BertTokenizer.from_pretrained("./phishing_model")

# Function to predict phishing or non-phishing
def predict_phishing(email_content):
    inputs = tokenizer(email_content, return_tensors="pt", truncation=True, padding=True, max_length=512)
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        prediction = torch.argmax(logits, dim=1).item()
    return "Phishing" if prediction == 1 else "Safe"

# Example usage
email = "Your account has been hacked, please verify your account here: https://suspiciouslink.com"
print(predict_phishing(email))
