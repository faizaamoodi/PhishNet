from flask import Flask, request, jsonify
from flask_cors import CORS
from detection.analyzer import EmailAnalyzer

app = Flask(__name__)
CORS(app)  #testinsg

@app.route('/analyze', methods=['POST'])
def analyze_email():
    data = request.json
    email_subject = data.get('subject')
    email_content = data.get('content')

    analyzer = EmailAnalyzer()
    is_phishing = analyzer.analyze_email(email_content, email_subject)

    result = "Phishing" if is_phishing else "Safe"
    print(f"📩 Backend Analysis: Subject='{email_subject}', Result='{result}'")  # Debugging log

    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)
