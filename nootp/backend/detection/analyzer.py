from .content_analysis import ContentAnalyzer
from .url_analysis import URLAnalyzer
from .ml_model import MLModel

class EmailAnalyzer:
    def __init__(self):
        self.content_analyzer = ContentAnalyzer()
        self.url_analyzer = URLAnalyzer()
        self.ml_model = MLModel()

    def analyze_email(self, email_content, email_subject):
        content_score = self.content_analyzer.analyze(email_content)
        url_score = self.url_analyzer.analyze(email_content)
        ml_score = self.ml_model.predict(email_subject + " " + email_content)
        final_score = 0.4 * content_score + 0.3 * url_score + 0.3 * ml_score

        return final_score > 0.5  #true for phishing, false for safe
