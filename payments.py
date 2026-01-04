import stripe
import streamlit as st
from supabase import create_client
supabase = create_client(st.secrets["SUPABASE_URL"], st.secrets["SUPABASE_ANON_KEY"])
stripe.api_key = st.secrets["STRIPE_SECRET_KEY"]
PLANS = {"free": {"price_id": None, "minutes": 30},"student": {"price_id": "price_student_xxx", "minutes": 300},"pro": {"price_id": "price_pro_xxx", "minutes": 9999}}
def get_or_create_customer(user):
    if user.get("stripe_customer_id"):
        return user["stripe_customer_id"]
    customer = stripe.Customer.create(email=user["email"])
    supabase.table("users").update({"stripe_customer_id": customer.id}).eq("id", user["id"]).execute()
    return customer.id
def create_checkout_session(user, plan_key):
    customer_id = get_or_create_customer(user)
    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{"price": PLANS[plan_key]["price_id"], "quantity": 1}],
        success_url="https://yourapp.com/success",
        cancel_url="https://yourapp.com/cancel"
    )
    return session.url
