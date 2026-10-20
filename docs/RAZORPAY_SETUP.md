# Razorpay Subscriptions & Webhook Integration Guide

## 1. Overview
NammaContent AI supports recurring subscriptions and one-time credits in Indian Rupees (INR) through Razorpay.

## 2. Setting Up Razorpay
1. **Register Account**: Sign up at [https://razorpay.com](https://razorpay.com) and complete merchant KYC.
2. **Generate API Keys**:
   - Go to **Account & Settings → API Keys**.
   - Generate keys in **Test Mode** (starts with `rzp_test_...`).
   - Add to `.env.local`:
     ```env
     RAZORPAY_KEY_ID=rzp_test_xxxxxx
     RAZORPAY_KEY_SECRET=yyyyyy
     ```
3. **Configure Webhook Endpoint**:
   - Go to **Account & Settings → Webhooks → Add New Webhook**.
   - URL: `https://your-domain.com/api/webhooks/razorpay`
   - Secret: Choose a secure random string and set as `RAZORPAY_WEBHOOK_SECRET`.
   - Events to activate:
     - `subscription.activated`
     - `subscription.charged`
     - `subscription.cancelled`
     - `payment.captured`
     - `payment.failed`

## 3. Webhook Idempotency & HMAC Security
- Every webhook request payload is verified against the HMAC-SHA256 signature passed in the `x-razorpay-signature` HTTP header.
- The system logs unique `event_id` in `payment_events` to prevent duplicate credit granting or double counting.
- When in sandbox/test mode without live keys, the platform operates seamlessly using simulated checkouts.
