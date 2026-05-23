import os
import streamlit as st
import json
from PIL import Image
from google import genai
from google.genai import types

# Load environment secrets
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Page Configuration
st.set_page_config(
    page_title="EcoFriend AI - Smart Plantation App",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CS styling for botanical natural aesthetic
st.markdown("""
<style>
    .main {
        background-color: #f7faf8;
    }
    .main-title {
        color: #1b4332;
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        text-align: center;
        margin-bottom: 2px;
    }
    .subtitle {
        color: #40916c;
        font-family: 'Inter', sans-serif;
        text-align: center;
        margin-bottom: 30px;
        font-size: 1.1rem;
    }
    .card {
        background: #ffffff;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e1e8e4;
        margin-bottom: 15px;
    }
    .telugu-text {
        font-family: 'NTR', 'Inter', sans-serif;
        color: #2d6a4f;
        background-color: #f0fdf4;
        padding: 10px;
        border-radius: 8px;
        border-left: 4px solid #52b788;
        margin-top: 5px;
        font-size: 0.95rem;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Gemini AI API safely
api_key = os.environ.get("GEMINI_API_KEY", "")
client = None
if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        st.error(f"Error initializing Gemini client: {e}")

# Navigation bar or Sidebar selectors
with st.sidebar:
    st.markdown("<h2 style='color: #1b4332;'>🌱 EcoFriend AI</h2>", unsafe_allow_html=True)
    st.markdown("### Choice of Language / భాష ఎంపిక")
    lang_opt = st.selectbox("Select Language", ["Bilingual (English + తెలుగు)", "English", "తెలుగు"])
    
    st.markdown("---")
    st.info("""
    **Bilingual Botany Assistant**
    Helps school students and beginner gardeners prepare soil, select appropriate crops, assess climate suitability, and prevent plant diseases with Gemini AI.
    
    **ద్విభాషా తోటపనికి సహాయకుడు**
    పాఠశాలల విద్యార్థులు మరియు తోటపనిని ప్రారంభించే వారికి మట్టి తయారీ, పంటల ఎంపిక, శీతోష్ణస్థితి అనుకూలత మరియు వ్యాధుల నివారణలో జెమిని సహాయపడుతుంది.
    """)

# Helper for showing content in respective languages
def show_bilingual(en_txt, te_txt, header=""):
    if header:
        st.markdown(f"**{header}**")
    if lang_opt == "English":
        st.write(en_txt)
    elif lang_opt == "తెలుగు":
        st.markdown(f"<div class='telugu-text'>{te_txt}</div>", unsafe_allow_html=True)
    else:
        st.write(en_txt)
        st.markdown(f"<div class='telugu-text'>{te_txt}</div>", unsafe_allow_html=True)

# Title Header
st.markdown("<h1 class='main-title'>🌱 EcoFriend AI - Smart Plantation Companion</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Bilingual Gardening, Crop & Disease Assistant / ద్విభాషా తోటపని మరియు వ్యాధుల సహాయకుడు</p>", unsafe_allow_html=True)

if not api_key:
    st.warning("⚠️ GEMINI_API_KEY is not defined in environment secrets. Displaying interactive guidance modes using integrated smart offline model parameters.")

# Main Application Tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "🥗 Plant Chooser / ఎంపిక", 
    "🪵 Soil & Fertilizer / మట్టి మరియు ఎరువులు", 
    "🍁 Disease Identifier / తెగులు గుర్తింపు",
    "💬 Eco Chat / చాట్‌బాట్"
])

# 1. PLANT CHOOSER TAB
with tab1:
    st.markdown("### Regional Crop Recommendations / మొక్కల ఎంపిక సూచనలు")
    col1, col2 = st.columns(2)
    with col1:
        climate = st.selectbox("Local Climate / స్థానిక శీతోష్ణస్థితి", ["Tropical (ఉష్ణమండల)", "Dry/Arid (ఎండినది)", "Cool/Temperate (చల్లనిది)", "High Rainfall (ఎక్కువ వర్షపాతం)"])
        sunlight = st.selectbox("Sunlight / సూర్యరశ్మి", ["Full Sun (పూర్తి ఎండ - 6+ hours)", "Partial Shade (పాక్షిక నీడ)", "Deep Shade (పూర్తి నీడ)"])
    with col2:
        soil_type = st.selectbox("Soil Type / మట్టి రకం", ["Loamy Soil (చిక్కటి నల్లరేగడి మట్టి)", "Sandy Soil (ఇసుక మట్టి)", "Clay Soil (బంకమట్టి)", "Red Soil (ఎర్ర మట్టి)"])
        water = st.selectbox("Water Availability / నీటి సదుపాయం", ["Abundant (సరిపడా నీరు ఉంది)", "Moderate (మధ్యస్థంగా ఉంది)", "Scarce/Drought (చాలా తక్కువ)"])

    if st.button("Recommend Suitable Plants / పంటలను సిఫార్సు చేయు"):
        if client:
            with st.spinner("AI is analyzing local parameters..."):
                prompt = f"""Recommend 3 suitable plants for conditions: Climate: {climate}, Sunlight: {sunlight}, Soil: {soil_type}, Water: {water}.
                Return JSON format of a list strictly matching:
                [
                  {{
                    "name": "Plant Name",
                    "teluguName": "తెలుగు పేరు",
                    "description": "Intro in English",
                    "teluguDescription": "తెలుగు ఉపోద్ఘాతం",
                    "growthTime": "e.g. 60 days",
                    "sunlightRequired": "advice",
                    "soilRequired": "advice",
                    "waterRequired": "advice",
                    "careTips": ["Tip 1 in English"],
                    "careTipsTelugu": ["తెలుగు చిట్కా 1"]
                  }}
                ]"""
                try:
                    response = client.models.generate_content(
                        model="gemini-3.5-flash",
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json"
                        )
                    )
                    plants = json.loads(response.text)
                    for plant in plants:
                        with st.container():
                            st.markdown(f"#### 🌿 {plant.get('name')} | <span style='color: #2d6a4f;'>{plant.get('teluguName')}</span>", unsafe_allow_html=True)
                            show_bilingual(plant.get('description'), plant.get('teluguDescription'))
                            
                            subcol1, subcol2 = st.columns(2)
                            with subcol1:
                                st.write(f"⏱️ **Growth Time:** {plant.get('growthTime')}")
                                st.write(f"☀️ **Sunlight required:** {plant.get('sunlightRequired')}")
                            with subcol2:
                                st.write(f"🪵 **Soil Required:** {plant.get('soilRequired')}")
                                st.write(f"💧 **Water Required:** {plant.get('waterRequired')}")
                            
                            st.write("**Planting Tips / నాటడానికి చిట్కాలు:**")
                            for en_tip, te_tip in zip(plant.get('careTips', []), plant.get('careTipsTelugu', [])):
                                show_bilingual(f"- {en_tip}", f"- {te_tip}")
                            st.markdown("---")
                except Exception as e:
                    st.error(f"Error querying Gemini: {e}")
        else:
            # Fallback mock data
            st.info("Showing default regional plants for beginners:")
            st.markdown("""
            #### 🌿 Holy Basil (Tulsi) | <span style='color: #2d6a4f;'>తులసి</span>
            """, unsafe_allow_html=True)
            show_bilingual(
                "Tulsi is a highly revered medicinal plant. It grows exceptionally well in warm climates with moderate watering.",
                "తులసి ఒక పురాతన ఔషధ గుణాలు గల మొక్క. ఇది వెచ్చని వాతావరణంలో చాలా వేగంగా పెరుగుతుంది."
            )
            st.markdown("""
            #### 🌿 Marigold (Banthi) | <span style='color: #2d6a4f;'>బంతి పూలు</span>
            """, unsafe_allow_html=True)
            show_bilingual(
                "Bright marigolds act as natural pest repellents, perfect for school gardens.",
                "బంతి పువ్వులు సహజంగా కీటకాలను వివారిస్తాయి. పాఠశాల తోటలకు ఎంతో అనుకూలం."
            )

# 2. SOIL TAB
with tab2:
    st.markdown("### Soil Preparation & Compost Guide / మట్టి తయారీ మరియు సేంద్రియ ఎరువులు")
    st.write("Understand soil fertility values and calculate recommended organic additions.")
    soil_sel = st.selectbox("Select Soil Type to Analyze / విశ్లేషించడానికి మట్టి రకాన్ని ఎంచుకోండి", ["Sandy Soil", "Red Clay", "Loamy Silt", "Black Cotton Soil"])
    soil_condition = st.text_input("Describe current soil condition (e.g. Dry and stony) / నివేదించండి", "Slightly dry with some pebbles")
    
    if st.button("Generate Soil Enhancement Plan / అభివృద్ధి ప్రణాళికను తయారుచేయు"):
        if client:
            with st.spinner("Preparing analytical recommendations..."):
                prompt = f"""Provide organic enrichment solutions for {soil_sel} that is currently {soil_condition}.
                Deliver valid JSON with keys: 'bestCrops' (list), 'fertilityRating' (string), 'fertilityTips' (list of en), 'fertilityTipsTelugu' (list of te), 'compostSuggestions' (list of en), 'compostSuggestionsTelugu' (list of te)"""
                try:
                    response = client.models.generate_content(
                        model="gemini-3.5-flash",
                        contents=prompt,
                        config=types.GenerateContentConfig(response_mime_type="application/json")
                    )
                    res = json.loads(response.text)
                    st.success(f"**Fertility Rating:** {res.get('fertilityRating')}")
                    st.write(f"💡 **Recommended Crops:** {', '.join(res.get('bestCrops', []))}")
                    
                    st.markdown("#### Soil Tilling Advice / దున్నడానికి చిట్కా")
                    for en, te in zip(res.get('fertilityTips', []), res.get('fertilityTipsTelugu', [])):
                        show_bilingual(en, te)
                        
                    st.markdown("#### Compost & Addition / సేంద్రియ ఎరువుల చిట్కాలు")
                    for en, te in zip(res.get('compostSuggestions', []), res.get('compostSuggestionsTelugu', [])):
                        show_bilingual(en, te)
                except Exception as e:
                    st.error(f"Error: {e}")
        else:
            st.info("Offline Sample Soil Plan for Beginners:")
            show_bilingual(
                "- Add Vermicompost or earthworm castings to naturally double organic nitrogen levels.",
                "- నైట్రోజన్ శాతాన్ని పెంచడానికి వర్మికంపోస్ట్ (వానపాముల ఎరువు) ని జోడించండి.",
                "Fertility Plan"
            )

# 3. DISEASE IDENTIFIER TAB
with tab3:
    st.markdown("### Leaf Disease Detector / పంటల తెగులు గుర్తింపు సహాయకుడు")
    st.write("Upload or drag copy/photo of an affected leaf to identify issues and organic spray remedies.")
    uploaded_file = st.file_uploader("Choose a leaf photo... / ఆకు ఫోటోను అప్‌లోడ్ చేయండి", type=["jpg", "png", "jpeg"])
    
    if uploaded_file is not None:
        img = Image.open(uploaded_file)
        st.image(img, caption="Uploaded Leaf", width=300)
        
        if st.button("Analyze for Disease / తెగులును విశ్లేషించు"):
            if client:
                with st.spinner("Scanning botanical structures with Gemini AI..."):
                    try:
                        prompt = """Analyze this plant leaf photo. Identify any diseases present, and list organic remedies and preventive actions in both English and Telugu.
                        Strictly return a JSON object:
                        {
                          "detectedDisease": "English Name",
                          "detectedDiseaseTelugu": "తెలుగు పేరు",
                          "confidenceScore": 90,
                          "remedies": ["step 1 in English"],
                          "remediesTelugu": ["తెలుగు నివారణ 1"],
                          "preventions": ["step 1 in English"],
                          "preventionsTelugu": ["తెలుగు జాగ్రత్త 1"]
                        }"""
                        response = client.models.generate_content(
                            model="gemini-3.5-flash",
                            contents=[img, prompt],
                            config=types.GenerateContentConfig(response_mime_type="application/json")
                        )
                        res = json.loads(response.text)
                        
                        st.subheader(f"🛡️ Identified: {res.get('detectedDisease')} | {res.get('detectedDiseaseTelugu')}")
                        st.info(f"Confidence Level: {res.get('confidenceScore')}%")
                        
                        st.markdown("#### Remedies / నివారణా క్రియలు")
                        for en, te in zip(res.get('remedies', []), res.get('remediesTelugu', [])):
                            show_bilingual(en, te)
                            
                        st.markdown("#### Future Prevention / వ్యాధి రాకుండా జాగ్రత్తలు")
                        for en, te in zip(res.get('preventions', []), res.get('preventionsTelugu', [])):
                            show_bilingual(en, te)
                    except Exception as e:
                        st.error(f"Error parsing image analysis: {e}")
            else:
                # Mock result when offline
                st.subheader("🛡️ Identified: Cercospora Leaf Spot | సెర్కోస్పోరా ఆకు మచ్చ తెగులు")
                show_bilingual(
                    "Spray Neem Oil solution (5ml in 1L of tepid water) once every 3 days at sunrise.",
                    "వేప నూనె ద్రావణాన్ని (1 లీటర్ నీటిలో 5మి.లీ వేప నూనె) వారానికి రెండు సార్లు స్ప్రే చేయండి.",
                    "Immediate Remedies / నివారణా చర్యలు"
                )

# 4. CHAT TAB
with tab4:
    st.markdown("### Speak with EcoFriend Greenhouse Chatbot / చాట్‌బాట్")
    st.write("Ask any questions regarding watering, seed preparation, composting, pruning, or potting.")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []
        
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            if msg["role"] == "user":
                st.write(msg["content"])
            else:
                show_bilingual(msg["content"], msg["content_telugu"])
                
    user_query = st.chat_input("Ask about gardening... / తోటపని ప్రశ్నలు అడగండి...")
    if user_query:
        st.session_state.messages.append({"role": "user", "content": user_query})
        with st.chat_message("user"):
            st.write(user_query)
            
        with st.chat_message("assistant"):
            if client:
                with st.spinner("Typing answer in English & తెలుగు..."):
                    try:
                        prompt = f"""Solve this beginner gardening query. Provide a response bilingually using this JSON schema:
                        {{
                          "reply": "Friendly response in English with simple tips",
                          "replyTelugu": "అదే చిట్కాల వివరాలు తెలుగులో సరళంగా"
                        }}
                        User query: "{user_query}" """
                        response = client.models.generate_content(
                            model="gemini-3.5-flash",
                            contents=prompt,
                            config=types.GenerateContentConfig(response_mime_type="application/json")
                        )
                        res = json.loads(response.text)
                        show_bilingual(res.get("reply"), res.get("replyTelugu"))
                        st.session_state.messages.append({
                            "role": "assistant", 
                            "content": res.get("reply"), 
                            "content_telugu": res.get("replyTelugu")
                        })
                    except Exception as e:
                        st.write("Sorry, I had trouble processing that with Gemini AI.")
            else:
                reply_en = "Beginner gardeners should ensure 6 hours of daily sunlight, maintain soil porosity, and water directly at key root levels."
                reply_te = "మొక్కలకు రోజుకు 6 గంటల సూర్యరశ్మి అందేలా చూసుకోవాలి మరియు మట్టిని ఎల్లప్పుడూ గుల్లగా ఉంచుకోవాలి."
                show_bilingual(reply_en, reply_te)
                st.session_state.messages.append({
                    "role": "assistant", 
                    "content": reply_en, 
                    "content_telugu": reply_te
                })
