from flask import Flask, request, jsonify
from flask_cors import CORS
from detection.analyzer import EmailAnalyzer

app = Flask(__name__)
CORS(app)  # Allow requests from any origin

@app.route('/analyze', methods=['POST'])
def analyze_email():
    data = request.json
    print("Received data:", data)  # Debugging log
    email_subject = data.get('subject')
    email_content = data.get('content')

    analyzer = EmailAnalyzer()
    is_phishing = analyzer.analyze_email(email_content, email_subject)

    return jsonify({"result": "Phishing" if is_phishing else "Safe"})

if __name__ == '__main__':
    app.run(debug=True)

