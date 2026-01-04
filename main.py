import streamlit as st
from pages import landing, dashboard
from utils.auth import require_auth
if "page" not in st.session_state:
    st.session_state.page = "landing"
if st.session_state.page == "landing":
    landing.show()
else:
    require_auth()
    dashboard.show()
