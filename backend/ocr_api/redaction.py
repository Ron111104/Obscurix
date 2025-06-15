import spacy
import re
import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # path to /backend
MODEL_DIR = os.path.join(BASE_DIR, "models", "redaction", "models", "bart-large-mnli")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

nlp = spacy.load("xx_ent_wiki_sm")

profane = 0
emails = 0
phone_numbers = 0
passwords = 0
pins = 0
api_keys = 0
bank_accounts = 0
card_numbers = 0

def load_classifier():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    classifier = pipeline("zero-shot-classification", model=model, tokenizer=tokenizer)
    return classifier

def is_code_transformer(text, classifier, threshold=0.85):
    labels = ["code", "nl"]
    result = classifier(text, candidate_labels=labels)
    
    predicted_label = result["labels"][0]
    score = result["scores"][0]

    return predicted_label == "code" and score >= threshold



# def mask_personal_info(text):
#     doc = nlp(text)
#     masked_text = text
#     masked_names = set()
#     masked_places = set()
#     masked_org = set()
#     for ent in doc.ents:
#         if ent.label_ == "PERSON":
#             masked_names.add(ent.text)
#         elif ent.label_ == "GPE":
#             masked_places.add(ent.text)
#         elif ent.label_ == "ORG":   
#             masked_org.add(ent.text)


#     # Replace only once per entity
    

#     for entity in masked_names:
#         masked_text = re.sub(rf'\b{re.escape(entity)}\b', "[Name]", masked_text)
#     for entity in masked_places:
#         masked_text = re.sub(rf'\b{re.escape(entity)}\b', "[Place]", masked_text)
#     for entity in masked_org:
#         masked_text = re.sub(rf'\b{re.escape(entity)}\b', "[Organization]", masked_text)

#     return masked_text

def mask_personal_info(text):
    doc = nlp(text)
    masked_text = text
    masked_names = set()
    masked_places = set()
    masked_org = set()

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            masked_names.add(ent.text)
        elif ent.label_ == "GPE":
            masked_places.add(ent.text)
        elif ent.label_ == "ORG":   
            masked_org.add(ent.text)

    # Avoid overwriting already masked sensitive data
    for entity in masked_names:
        if any(mask in masked_text for mask in ["[Password]", "[PIN]", "[API Key]", "[Bank Account]", "[Card Number]"]):
            continue
        masked_text = re.sub(rf'\b{re.escape(entity)}\b', "[Name]", masked_text)

    for entity in masked_places:
        masked_text = re.sub(rf'\b{re.escape(entity)}\b', "[Place]", masked_text)
    
    for entity in masked_org:
        masked_text = re.sub(rf'\b{re.escape(entity)}\b', "[Organization]", masked_text)

    return masked_text



PROFANITY_LIST = ["fuck", "shit", "bitch", "asshole", "bastard", "damn"]

def censor_profanity(text):
    global profane
    profane += len(re.findall(r"\b(" + "|".join(re.escape(word) for word in PROFANITY_LIST) + r")\b", text, flags=re.IGNORECASE))
    pattern = r"\b(" + "|".join(re.escape(word) for word in PROFANITY_LIST) + r")\b"
    return re.sub(pattern, "[CENSORED]", text, flags=re.IGNORECASE)

def censor_personal_info(text):
    global emails, phone_numbers
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    emails += len(re.findall(email_pattern, text))
    phone_numbers += len(re.findall(r"\b\d{10}\b", text))  # Assuming 10-digit phone numbers
    phone_pattern = r"\b\d{10}\b"  

    filtered_text = re.sub(email_pattern, "[Email ID]", text)
    filtered_text = re.sub(phone_pattern, "[Phone Number]", filtered_text)

    return filtered_text

def detect_password(text):
    global passwords
    pattern = r"(password|pwd|pass)\s*[:=]\s*\S+"
    matches = re.findall(pattern, text, flags=re.IGNORECASE)
    passwords += len(matches)
    return re.sub(pattern, "password : [Password]", text, flags=re.IGNORECASE)


def detect_pin(text):
    global pins
    pin_matches = re.findall(r"\b\d{4}\b|\b\d{6}\b", text)
    pins += len(pin_matches)
    return re.sub(r"\b\d{4}\b|\b\d{6}\b", "pin : [PIN]", text)


def detect_api_key(text):
    global api_keys
    patterns = [
        r"(api[-_]?key\s*[:=]\s*[A-Za-z0-9_\-]{20,})",
        r"\b[A-Za-z0-9_\-]{32,}\b"
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text, flags=re.IGNORECASE)
        api_keys += len(matches)
        text = re.sub(pattern, "api is [API Key]", text, flags=re.IGNORECASE)
    return text


def detect_bank_info(text):
    global bank_accounts, card_numbers
    # Bank accounts (10–18 digit numbers)
    bank_matches = re.findall(r"\b\d{10,18}\b", text)
    bank_accounts += len(bank_matches)
    text = re.sub(r"\b\d{10,18}\b", "[Bank Account]", text, count=bank_accounts)

    # Visa
    visa_matches = re.findall(r"\b4[0-9]{12}(?:[0-9]{3})?\b", text)
    card_numbers += len(visa_matches)
    text = re.sub(r"\b4[0-9]{12}(?:[0-9]{3})?\b", "[Card Number]", text)

    # MasterCard
    mastercard_matches = re.findall(r"\b5[1-5][0-9]{14}\b", text)
    card_numbers += len(mastercard_matches)
    text = re.sub(r"\b5[1-5][0-9]{14}\b", "[Card Number]", text)

    # Amex
    amex_matches = re.findall(r"\b3[47][0-9]{13}\b", text)
    card_numbers += len(amex_matches)
    text = re.sub(r"\b3[47][0-9]{13}\b", "[Card Number]", text)

    return text

def filter_text_updated(text, mode="strict"):
    """Filters text based on different modes"""
    creative_mode = (mode == "creative")
    original_text = text
    text = censor_profanity(text)
    text = detect_password(text)
    text = detect_pin(text)
    text = detect_api_key(text)
    text = detect_bank_info(text)
    text = censor_personal_info(text)
    text = mask_personal_info(text)  

    softened_text = text.replace("hate", "dislike").replace("angry", "frustrated")

    creative_variations = []
    for i in range(2):
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        response = model.generate_content(f"Generate a toned down variation of the text but dont let go of the context also if you encounter a name u can replace it with a different name and also redact all the private info such as phone numbers,bank details,passwords,pins,api keys,card details and all: {original_text}. Make sure you give only the sentence not anything else. ").text.strip()
        creative_variations.append(response)

    # Return based on mode
    if mode == "strict":
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        response = model.generate_content(f"Generate a toned down variation of the text keep all the redacted stuff such as [API KEY],[NAME],[PHONE NUMBERS], etc. do not remove this and compare with original text: {original_text} and the redacted sentence :{text} it should make sense. Make sure you give only the sentence not anything else. Dont give original text").text.strip()
        res = []
        res.append(softened_text)
        # res.append(response)
        return res
    elif mode == "creative":
        return creative_variations
    else:
        return [text]

def codetransform(text):
    model = genai.GenerativeModel('gemini-2.0-flash-lite')
    response = model.generate_content(f"Transform the following code only into psuedo code, redact any confidential stuff from the code as well and only in case there is a flaw give a small summary of the flaw correcting it. Here's the code : {text}. Please only give the output of the transformed sentence and not anything else.").text.strip()
    return response

# user_inputs = [
#     "My password: abc@1234 and my api_key=sk_test_51LJ93c98C3D also my bank account is 123456789012. My card is 4111111111111111 and PIN is 1234."
# ]

# for user_input in user_inputs:
#     filtered_outputs = {
#         "Strict Mode": filter_text_updated(user_input, mode="strict"),
#         "Creative Mode": filter_text_updated(user_input, mode="creative"),
#     }

#     print("\nFiltered Outputs for:", user_input)
#     for mode, outputs in filtered_outputs.items():
#         print(f"\n{mode}:")
#         for output in outputs:
#             print(f"- {output}")

if __name__ == "__main__":
    clf = load_classifier()

    input_texts = ["""My password: abc@1234 and my api_key=sk_test_51LJ93c98C3D.
                        My bank account is 123456789012. My card is 4111111111111111 and PIN is 1234.
                        Call me at 9876543210 or email me at test.user@example.com.
                        My name is John Doe, and I work in New York at OpenAI.""",
                     "def quicksort(arr): if len(arr) <= 1: return arr",
                     """import re
                        import io
                        import fasttext
                        from PIL import Image
                        from numpy import ndarray
                        from apple_ocr.ocr import OCR
                        from flask import Flask, request, jsonify
                        from typing import Tuple, List, Dict, Union
                        from huggingface_hub import hf_hub_download

                        app = Flask(_name_)

                        model = fasttext.load_model(hf_hub_download(
                            "kenhktsui/code-natural-language-fasttext-classifier", "model_quantized.bin"))

                        def replace_newlines(text: str) -> str:
                            return re.sub("\n+", " ", text)

                        def parse_labels_probs(
                            data: Tuple[List[List[str]], List[ndarray]],
                            remove_prefix: str = '_label_'
                        ) -> Dict[str, Union[List[Dict[str, float]], Dict[str, float]]]:
                            labels, probs = data

                            parsed_dict = {
                                label[0].replace(remove_prefix, ''): float(prob[0])
                                for label, prob in zip(labels, probs)
                            }

                            return {
                                'dict': parsed_dict
                            }""",]
    
    for text in input_texts:
        is_code = is_code_transformer(text, clf, threshold=0.85)
        if is_code:
            print(codetransform(text))
        else:
            filtered_outputs = filter_text_updated(text, mode="strict")
            print("Filtered Outputs:")
            for output in filtered_outputs:
                print(f"- {output}")
    

    

def reset_metrics():
    global profane, emails, phone_numbers, passwords, pins, api_keys, bank_accounts, card_numbers
    profane = emails = phone_numbers = passwords = pins = api_keys = bank_accounts = card_numbers = 0

def get_metrics():
    return {
        "profanities": profane,
        "emails": emails,
        "phone_numbers": phone_numbers,
        "passwords": passwords,
        "pins": pins,
        "api_keys": api_keys,
        "bank_accounts": bank_accounts,
        "card_numbers": card_numbers
    }
