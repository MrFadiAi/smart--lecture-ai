from supabase import create_client
import streamlit as st
supabase = create_client(st.secrets["SUPABASE_URL"], st.secrets["SUPABASE_ANON_KEY"])
def save_lecture(user_id, title, category, duration, content):
    supabase.table("lectures").insert({"user_id": user_id,"title": title,"category": category,"duration": duration,"content": content}).execute()
def get_user_lectures(user_id):
    res = supabase.table("lectures").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data
