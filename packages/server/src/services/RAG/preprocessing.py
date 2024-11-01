import sys
import re
import contractions
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download NLTK resources (quietly)
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)

# Initialize NLTK tools
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def process_text(text):
    """Cleans, normalizes, and pre-processes text for consistency."""
    # Remove non-ASCII characters
    text = text.encode("ascii", "ignore").decode("ascii")
    
    # Lowercase all text
    text = text.lower()
    
    # Expand contractions
    text = contractions.fix(text)
    
    # Normalize punctuation
    text = text.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
    text = text.replace("–", "-").replace("—", "-")
    
    # Remove all punctuation
    text = re.sub(r"[^\w\s]", "", text)
    
    # Tokenize the text
    words = word_tokenize(text)
    
    # Remove stopwords and apply lemmatization
    processed_words = [lemmatizer.lemmatize(word) for word in words if word not in stop_words]
    
    # Join words back to a single string
    return " ".join(processed_words)

if __name__ == "__main__":
    # Read the text data from stdin
    text_data = sys.stdin.read()

    # Process the text to extract, clean, and preprocess
    processed_text = process_text(text_data)

    # Output the preprocessed result to stdout
    print(processed_text)
