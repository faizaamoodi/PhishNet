import re
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

class URLAnalyzer:
    def __init__(self):
        self.suspicious_tlds = [".xyz", ".top", ".work", ".date", ".loan"]

    def analyze(self, content):
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', content)
        
        if not urls:
            return 0

        score = 0
        for url in urls:
            parsed_url = urlparse(url)
            
            if any(parsed_url.netloc.endswith(tld) for tld in self.suspicious_tlds):
                score += 0.5

            if self.is_url_shortener(parsed_url.netloc):
                score += 0.3

            #mismatched URLs
            try:
                response = requests.get(url, timeout=5)
                soup = BeautifulSoup(response.text, 'html.parser')
                if soup.find('a', href=True):
                    if urlparse(soup.find('a', href=True)['href']).netloc != parsed_url.netloc:
                        score += 0.2
            except:
                score += 0.1

        return min(score / len(urls), 1) 

    def is_url_shortener(self, domain):
        shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly']
        return domain in shorteners
