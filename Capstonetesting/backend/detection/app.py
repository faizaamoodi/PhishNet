from flask import Flask, request, jsonify
from detection.analyzer import EmailAnalyzer

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_email():
    data = request.json
    email_subject = data.get('subject')
    email_content = data.get('content')
    analyzer = EmailAnalyzer()
    is_phishing = analyzer.analyze_email(email_content, email_subject)
    return jsonify({"result": "Phishing" if is_phishing else "Safe"})

if __name__ == '__main__':
    app.run(debug=True)
