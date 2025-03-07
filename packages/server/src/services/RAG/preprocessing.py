import sys
import json
import contractions
import spacy

# Load SpaCy model with only necessary components
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

def process_text(text):
    """Cleans, normalizes, and pre-processes text for consistency."""
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
        print(f"Processing batch {i // batch_size + 1}...", file=sys.stderr)
        yield [process_text(text) for text in batch]

if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read()
        print(f"Received input: {input_data}", file=sys.stderr)
        data = json.loads(input_data)

        # Validate input
        if not isinstance(data, list):
            raise ValueError("Input must be a JSON array of texts.")

        # Process texts in batches
        results = []
        for batch_results in process_batch(data, batch_size=100):
            results.extend(batch_results)

        # Output the results as JSON
        print(json.dumps(results) + "\n")
    except Exception as e:
        print(json.dumps({"error": str(e)}))