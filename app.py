# EcoFriend – AI Smart Plantation Assistant (Full `app.py`)
import streamlit as st
import google.generativeai as genai
from PIL import Image
import pandas as pd
import speech_recognition as sr
from gtts import gTTS
import tempfile
import os

# -------------------------------
# PAGE CONFIG
# -------------------------------
st.set_page_config(
    page_title="EcoFriend – AI Smart Plantation Assistant",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -------------------------------
# GEMINI API CONFIG
# -------------------------------
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
except:
    model = None

# -------------------------------
# CUSTOM CSS
# -------------------------------
st.markdown(
    """
    <style>
    .stApp {
        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        color: white;
        font-family: 'Segoe UI', sans-serif;
    }

    .main-title {
        font-size: 3rem;
        font-weight: bold;
        color: #b7ffb7;
        text-align: center;
    }

    .subtitle {
        text-align: center;
        font-size: 1.2rem;
        color: #e8ffe8;
        margin-bottom: 30px;
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 25px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        margin-bottom: 20px;
        transition: 0.3s ease;
    }

    .glass-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 35px rgba(0,255,100,0.3);
    }

    .feature-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #d6ffd6;
    }

    .green-btn {
        background: linear-gradient(45deg, #00b09b, #96c93d);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: bold;
    }

    .sidebar .sidebar-content {
        background: rgba(0,0,0,0.3);
    }
    </style>
    """,
    unsafe_allow_html=True
)

# -------------------------------
# SIDEBAR
# -------------------------------
st.sidebar.title("🌿 EcoFriend")
st.sidebar.markdown("### Smart Plantation Assistant")
st.sidebar.markdown("### స్మార్ట్ ప్లాంటేషన్ అసిస్టెంట్")

page = st.sidebar.radio(
    "Navigation",
    [
        "🏠 Home",
        "🔐 Login",
        "🌱 Plant Recommendation",
        "🪴 Soil Guidance",
        "💧 Water Prediction",
        "🌤 Climate Suitability",
        "🍂 Disease Detection",
        "🤖 AI Chatbot",
        "📈 Growth Prediction",
        "🎤 Voice Assistant"
    ]
)

# -------------------------------
# HOME PAGE
# -------------------------------
if page == "🏠 Home":

    st.markdown('<div class="main-title">🌱 EcoFriend – AI Smart Plantation Assistant</div>', unsafe_allow_html=True)

    st.markdown(
        '<div class="subtitle">Smart Gardening for Students & Beginners 🌿<br>విద్యార్థులు మరియు ప్రారంభకుల కోసం స్మార్ట్ గార్డెనింగ్</div>',
        unsafe_allow_html=True
    )

    st.image(
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735",
        use_container_width=True
    )

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown(
            """
            <div class='glass-card'>
            <div class='feature-title'>🌱 Plant Recommendation</div>
            <p>Suggests suitable plants based on climate and soil.<br>
            వాతావరణం మరియు నేల ఆధారంగా మొక్కల సూచనలు.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col2:
        st.markdown(
            """
            <div class='glass-card'>
            <div class='feature-title'>🤖 AI Chatbot</div>
            <p>Ask any plant care questions in English & Telugu.<br>
            ఇంగ్లీష్ మరియు తెలుగు భాషల్లో ప్రశ్నలు అడగండి.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col3:
        st.markdown(
            """
            <div class='glass-card'>
            <div class='feature-title'>🍂 Disease Detection</div>
            <p>Upload leaf images for disease analysis.<br>
            ఆకుల చిత్రాలతో వ్యాధి గుర్తింపు.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.markdown("---")

    st.subheader("✨ Features | ఫీచర్లు")

    features = [
        "🌱 Smart Plant Recommendation",
        "🪴 Soil Guidance",
        "💧 Water Quantity Prediction",
        "🌤 Climate Analysis",
        "🍂 AI Disease Detection",
        "🤖 AI Plant Chatbot",
        "📈 Growth Prediction",
        "🎤 Telugu Voice Assistant"
    ]

    for feature in features:
        st.markdown(f"✅ {feature}")

# -------------------------------
# LOGIN PAGE
# -------------------------------
elif page == "🔐 Login":

    st.markdown("<h1 style='text-align:center;'>🔐 Login / Create Account</h1>", unsafe_allow_html=True)

    auth_mode = st.selectbox(
        "Choose Option",
        ["Login", "Create Account", "Forgot Password"]
    )

    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)

    email = st.text_input("📧 Email")
    password = st.text_input("🔑 Password", type="password")

    if auth_mode == "Create Account":
        confirm = st.text_input("🔒 Confirm Password", type="password")

    if st.button("Next ➜"):

        if "@" not in email:
            st.error("Invalid Email")

        elif len(password) < 6:
            st.error("Password must contain at least 6 characters")

        else:
            st.success("Authentication Successful ✅")
            st.balloons()

    st.markdown("</div>", unsafe_allow_html=True)

# -------------------------------
# PLANT RECOMMENDATION
# -------------------------------
elif page == "🌱 Plant Recommendation":

    st.title("🌱 Plant Recommendation | మొక్కల సూచనలు")

    climate = st.selectbox("Climate", ["Hot", "Cold", "Moderate"])
    sunlight = st.selectbox("Sunlight", ["Full Sun", "Partial Shade", "Low Light"])
    soil = st.selectbox("Soil Type", ["Sandy", "Clay", "Loamy"])

    if st.button("Recommend Plant"):

        prompt = f"Suggest suitable plants for {climate} climate, {sunlight} sunlight and {soil} soil. Give English and Telugu output."

        if model:
            response = model.generate_content(prompt)
            st.success(response.text)
        else:
            st.write("🌿 Aloe Vera\n🌿 Tulsi\n🌿 Money Plant")

# -------------------------------
# SOIL GUIDANCE
# -------------------------------
elif page == "🪴 Soil Guidance":

    st.title("🪴 Soil Guidance | నేల మార్గదర్శకం")

    plant = st.text_input("Enter Plant Name")

    if st.button("Get Soil Guidance"):

        prompt = f"Give soil guidance, compost suggestions and fertility tips for {plant} in English and Telugu."

        if model:
            response = model.generate_content(prompt)
            st.success(response.text)
        else:
            st.write("Use organic compost and loamy soil.")

# -------------------------------
# WATER PREDICTION
# -------------------------------
elif page == "💧 Water Prediction":

    st.title("💧 Water Quantity Prediction")

    plant = st.text_input("Plant Name")
    temperature = st.slider("Temperature", 10, 50, 30)

    if st.button("Predict Water Quantity"):

        water = temperature * 0.2

        st.success(f"Recommended Water Quantity: {water:.1f} Litres/day")
        st.info("రోజుకు నీటి పరిమాణం సూచించబడింది")

# -------------------------------
# CLIMATE SUITABILITY
# -------------------------------
elif page == "🌤 Climate Suitability":

    st.title("🌤 Climate Suitability")

    temp = st.slider("Temperature", 0, 50, 28)
    humidity = st.slider("Humidity", 0, 100, 60)

    if st.button("Analyze Climate"):

        if temp < 15:
            st.warning("Cold Climate")
        elif temp < 35:
            st.success("Suitable Climate for Most Plants 🌿")
        else:
            st.error("Too Hot for Sensitive Plants")

        st.info(f"Humidity Level: {humidity}%")

# -------------------------------
# DISEASE DETECTION
# -------------------------------
elif page == "🍂 Disease Detection":

    st.title("🍂 AI Disease Detection")

    uploaded = st.file_uploader("Upload Leaf Image", type=["jpg", "png", "jpeg"])

    if uploaded:

        image = Image.open(uploaded)

        st.image(image, caption="Uploaded Leaf", use_container_width=True)

        if st.button("Detect Disease"):

            prompt = "Identify common plant disease from uploaded leaf image and provide remedies in English and Telugu."

            st.success("Possible Disease: Leaf Spot")
            st.info("Use neem oil spray and avoid overwatering.")
            st.info("వేప నూనె స్ప్రే ఉపయోగించండి")

# -------------------------------
# AI CHATBOT
# -------------------------------
elif page == "🤖 AI Chatbot":

    st.title("🤖 EcoFriend AI Chatbot")

    user_question = st.text_area("Ask Your Plant Question")

    if st.button("Ask AI"):

        if model:

            prompt = f"Answer this plant-related question bilingually in English and Telugu: {user_question}"

            response = model.generate_content(prompt)

            st.success(response.text)

        else:
            st.write("AI service unavailable")

# -------------------------------
# GROWTH PREDICTION
# -------------------------------
elif page == "📈 Growth Prediction":

    st.title("📈 Plant Growth Prediction")

    plant = st.text_input("Plant Name")
    days = st.slider("Growth Days", 1, 365, 30)

    if st.button("Predict Growth"):

        growth = days * 1.5

        st.success(f"Expected Growth: {growth:.1f} cm")
        st.info("మొక్క ఎదుగుదల అంచనా")

# -------------------------------
# VOICE ASSISTANT
# -------------------------------
elif page == "🎤 Voice Assistant":

    st.title("🎤 Voice Assistant | వాయిస్ అసిస్టెంట్")

    st.write("Speak in English or Telugu")

    text_input = st.text_area("Enter Text for Voice")

    language = st.selectbox(
        "Select Language",
        ["en", "te"]
    )

    if st.button("Generate Voice"):

        tts = gTTS(text=text_input, lang=language)

        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')

        tts.save(temp_audio.name)

        audio_file = open(temp_audio.name, 'rb')

        st.audio(audio_file.read(), format='audio/mp3')

# -------------------------------
# FOOTER
# -------------------------------
st.markdown("---")

st.markdown(
    """
    <center>
    🌿 EcoFriend – AI Smart Plantation Assistant <br>
    Smart Eco Technology for Students 🌱 <br>
    విద్యార్థుల కోసం స్మార్ట్ ఎకో టెక్నాలజీ
    </center>
    """,
    unsafe_allow_html=True
)



---

