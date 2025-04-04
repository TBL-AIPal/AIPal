import sys
import json
import contractions
import spacy

# Load SpaCy model with only necessary components
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

def process_text(text):
    """Cleans, normalizes, and pre-processes text for consistency."""
    # Replace invalid characters with a placeholder
    text = text.encode('utf-8', errors='replace').decode('utf-8')

    # Lowercase all text
    text = text.lower()

    # Expand contractions
    text = contractions.fix(text)

    # Process text with SpaCy
    doc = nlp(text)
    processed_words = [
        token.lemma_ for token in doc
        if not token.is_stop and token.is_alpha and not token.is_punct
    ]

    # Join words back to a single string
    return " ".join(processed_words)

def process_batch(texts, batch_size=100):
    """Processes texts in smaller batches to reduce memory usage."""
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        yield [process_text(text) for text in batch]

if __name__ == "__main__":
    while True:
        try:
            # Read one line (JSON array) from stdin
            line = sys.stdin.readline().strip()

            # Handle empty input
            if not line:  
                continue
            
            data = json.loads(line)
            if not isinstance(data, list):
                raise ValueError("Input must be a JSON array of texts.")
            
            results = []
            for batch in process_batch(data):
                results.extend(batch)
            
            print(json.dumps(results))
            sys.stdout.flush()
            
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.stdout.flush()