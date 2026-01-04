import streamlit as st
from utils.lectures import get_user_lectures, save_lecture
from utils.usage import get_audio_duration_minutes, can_user_upload, update_usage
from utils.payments import create_checkout_session
def show():
    st.title("🎓 لوحة التحكم")
    user = st.session_state.user
    st.write(f"مرحبًا، {user['email']}")
    uploaded_file = st.file_uploader("ارفع ملف المحاضرة الصوتية", type=["mp3","wav","m4a"])
    if uploaded_file:
        audio_path = f"temp_{uploaded_file.name}"
        with open(audio_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        duration = get_audio_duration_minutes(audio_path)
        if not can_user_upload(user['id'], user['plan'], duration):
            st.error("❌ لقد تجاوزت الحد الشهري لخطةك")
        else:
            summary = "ملخص تجريبي للمحاضرة"
            update_usage(user['id'], duration)
            save_lecture(user['id'], uploaded_file.name, "عام", duration, summary)
            st.success("✅ تم حفظ المحاضرة بنجاح!")
    st.subheader("📚 محاضراتك السابقة")
    lectures = get_user_lectures(user['id'])
    for lec in lectures:
        with st.expander(f"{lec['title']} — {lec['created_at'][:10]}"):
            st.write(f"⏱️ المدة: {lec['duration']} دقيقة")
            st.markdown(lec["content"])
            st.download_button("⬇️ تحميل TXT", data=lec["content"], file_name=f"{lec['title']}.txt")
    st.subheader("ترقية الخطة")
    if st.button("🚀 الترقية إلى Student"):
        url = create_checkout_session(user, "student")
        st.markdown(f"[اضغط هنا لإتمام الدفع]({url})")
