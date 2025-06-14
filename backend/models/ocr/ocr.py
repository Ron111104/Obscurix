import easyocr as ocr
import streamlit as st
from PIL import Image
import numpy as np
st.title("OCR for Obscurix")
st.markdown("## This OCR system is a small component of the Obscurix project, designed for easy extraction of text from images using `easyocr` and `opencv`")
st.markdown("")
image = st.file_uploader(label = "Upload your image here",type=['png','jpg','jpeg'])
@st.cache
def load_model(): 
    reader = ocr.Reader(['en'],model_storage_directory='.')
    return reader 
reader = load_model()
if image is not None:
    input_image = Image.open(image)
    st.image(input_image)
    with st.spinner("Obscurix is running!"):
        result = reader.readtext(np.array(input_image))
        result_text = []
        for text in result:
            result_text.append(text[1])
        st.write(result_text)
    st.balloons()
else:
    st.write("Upload an Image")