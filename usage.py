from pydub import AudioSegment
from supabase import create_client
import streamlit as st
from datetime import datetime
supabase = create_client(st.secrets["SUPABASE_URL"], st.secrets["SUPABASE_ANON_KEY"])
PLANS_LIMITS = {"free": 30, "student": 300, "pro": 9999}
def get_audio_duration_minutes(file_path):
    audio = AudioSegment.from_file(file_path)
    return int(len(audio)/1000/60) + 1
def get_current_month():
    return datetime.now().strftime("%Y-%m")
def get_user_usage(user_id):
    month = get_current_month()
    res = supabase.table("usage").select("*").eq("user_id", user_id).eq("month", month).execute()
    if res.data:
        return res.data[0]["minutes_used"]
    else:
        supabase.table("usage").insert({"user_id": user_id, "minutes_used": 0, "month": month}).execute()
        return 0
def can_user_upload(user_id, plan, audio_minutes):
    used = get_user_usage(user_id)
    limit = PLANS_LIMITS.get(plan, 0)
    return (used + audio_minutes) <= limit
def update_usage(user_id, added_minutes):
    month = get_current_month()
    supabase.table("usage").update({"minutes_used": get_user_usage(user_id)+added_minutes}).eq("user_id", user_id).eq("month", month).execute()
