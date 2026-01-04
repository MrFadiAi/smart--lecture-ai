import streamlit as st
from supabase import create_client
supabase = create_client(st.secrets["SUPABASE_URL"], st.secrets["SUPABASE_ANON_KEY"])
def require_auth():
    if "user" not in st.session_state:
        show_auth()
        st.stop()
def show_auth():
    st.title("🔐 تسجيل الدخول")
    tab1, tab2 = st.tabs(["تسجيل الدخول", "إنشاء حساب"])
    with tab1:
        email = st.text_input("البريد الإلكتروني")
        password = st.text_input("كلمة المرور", type="password")
        if st.button("دخول"):
            res = supabase.auth.sign_in_with_password({"email": email, "password": password})
            if res.user:
                st.session_state.user = {"id": res.user.id, "email": email, "plan": "free"}
                st.experimental_rerun()
            else:
                st.error("بيانات غير صحيحة")
    with tab2:
        email = st.text_input("بريد جديد", key="reg_email")
        password = st.text_input("كلمة مرور", type="password", key="reg_pass")
        if st.button("إنشاء حساب"):
            res = supabase.auth.sign_up({"email": email, "password": password})
            if res.user:
                st.success("تم إنشاء الحساب، سجل الدخول الآن")
            else:
                st.error("حدث خطأ")
