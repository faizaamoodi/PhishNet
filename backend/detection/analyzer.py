from .content_analysis import ContentAnalyzer
from .ml_model import MLModel

class EmailAnalyzer:
    def __init__(self):
        # initialize the components for analyzing content and ML model
        self.content_analyzer = ContentAnalyzer()
        self.ml_model = MLModel()

    def analyze_email(self, email_content, email_subject):
        #analyze content
        content_score = self.content_analyzer.analyze(email_content)
        ml_score = self.ml_model.predict(email_subject + " " + email_content)
        #combine scores
        final_score = 0.5 * content_score + 0.5 * ml_score

        print(f"Analyzing email - Subject: {email_subject[:50]}...")
        print(f"Content Score: {content_score}, ML Score: {ml_score}, Final Score: {final_score}")
        print(f"Decision: {'Phishing' if final_score > 0.35 else 'Safe'}")

        #return true if the final score is above a threshold to show if phishing; false if it's safe
        return final_score > 0.35  #lower threshold, bring back up to 0.5
