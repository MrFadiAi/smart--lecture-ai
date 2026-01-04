import streamlit as st
import pages.landing as landing
import pages.dashboard as dashboard
from utils.auth import require_auth
if "page" not in st.session_state:
    st.session_state.page = "landing"
if st.session_state.page == "landing":
    landing.show()
else:
    require_auth()
    dashboard.show()
