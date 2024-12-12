import re
import spacy

class ContentAnalyzer:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.suspicious_phrases = [
            "verify your account",
            "update your information",
            "click here to login",
            "urgent action required",
            "your account will be suspended"
        ]

    def analyze(self, content):
        doc = self.nlp(content)
        
        # Check for grammatical errors (simplified)
        grammar_score = sum(1 for token in doc if token.pos_ == "VERB") / len(doc)
        
        # Check for suspicious phrases
        phrase_score = sum(1 for phrase in self.suspicious_phrases if phrase.lower() in content.lower()) / len(self.suspicious_phrases)
        
        # Check for personal information requests
        info_request_score = len(re.findall(r'\b(password|credit card|social security|bank account)\b', content, re.IGNORECASE)) / 10

        return (grammar_score + phrase_score + info_request_score) / 3
