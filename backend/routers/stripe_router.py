import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
import models
import auth

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_123")

router = APIRouter(prefix="/api/stripe", tags=["stripe"])

@router.post("/create-checkout-session")
def create_checkout_session(current_user: models.User = Depends(auth.get_current_user)):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Studio Pilot Premium',
                    },
                    'unit_amount': 2999,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:3000/dashboard?success=true',
            cancel_url='http://localhost:3000/dashboard?canceled=true',
            client_reference_id=str(current_user.id)
        )
        return {"id": session.id, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    
    import json
    try:
        event = json.loads(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Webhook error")
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('client_reference_id')
        if user_id:
            user = db.query(models.User).filter(models.User.id == int(user_id)).first()
            if user:
                user.subscription_status = "active"
                db.commit()
    
    return {"status": "success"}
