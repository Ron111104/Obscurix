import json
import urllib.parse
from checker import check_if_company_code

def handle_reddit(flow):
    print("HANDLE_REDDIT")
    
    content_type = flow.request.headers.get("Content-Type", "").lower()
    request_text = flow.request.content.decode('utf-8')
    
    # Reddit can use both JSON and form data depending on the endpoint
    if "application/json" in content_type:
        return handle_reddit_json(request_text)
    elif "application/x-www-form-urlencoded" in content_type:
        return handle_reddit_form(request_text)
    else:
        # Try both formats as fallback
        try:
            return handle_reddit_json(request_text)
        except:
            return handle_reddit_form(request_text)

def handle_reddit_json(request_text):
    """Handle Reddit API requests with JSON payload"""
    try:
        request_data = json.loads(request_text)
        print("Reddit JSON data:", request_data)
        
        # Check for post content in various Reddit API formats
        text_fields = [
            'text',           # Post text content
            'selftext',       # Self post text
            'body',           # Comment body
            'title',          # Post title
            'markdown',       # Markdown content
            'richtext_json'   # Rich text content
        ]
        
        for field in text_fields:
            if field in request_data:
                content = request_data[field]
                if content and check_if_company_code(str(content)):
                    return True
        
        # Check nested structures
        if 'data' in request_data:
            data = request_data['data']
            for field in text_fields:
                if field in data:
                    content = data[field]
                    if content and check_if_company_code(str(content)):
                        return True
        
        return False
        
    except json.JSONDecodeError:
        print("Failed to parse Reddit JSON")
        return False

def handle_reddit_form(request_text):
    """Handle Reddit form submissions"""
    try:
        form_data = urllib.parse.parse_qs(request_text)
        print("Reddit form data:", form_data)
        
        # Common Reddit form field names
        form_fields = [
            'text',
            'selftext', 
            'body',
            'title',
            'markdown',
            'content'
        ]
        
        for field in form_fields:
            if field in form_data:
                field_values = form_data[field]
                if field_values:
                    content = field_values[0]  # Take first value
                    if content and check_if_company_code(content):
                        return True
        
        return False
        
    except Exception as e:
        print(f"Error parsing Reddit form data: {e}")
        return False
    