"""Payment service for Instamojo integration."""

from typing import Any

import httpx

from app.config import get_settings

settings = get_settings()


class PaymentService:
    """
    Service for Instamojo payment gateway integration.
    Handles payment request creation, verification, and refunds.
    """

    def __init__(self):
        self.api_key = settings.instamojo_api_key
        self.auth_token = settings.instamojo_auth_token
        self.base_url = settings.instamojo_base_url
        self.headers = {
            "X-Api-Key": self.api_key,
            "X-Auth-Token": self.auth_token,
            "Content-Type": "application/x-www-form-urlencoded",
        }

    async def create_payment_request(
        self,
        amount: float,
        purpose: str,
        buyer_name: str,
        buyer_phone: str,
        redirect_url: str,
        buyer_email: str | None = None,
        webhook_url: str | None = None,
    ) -> dict[str, Any]:
        """
        Create a payment request on Instamojo.

        Args:
            amount: Payment amount in INR
            purpose: Payment purpose/description
            buyer_name: Customer name
            buyer_phone: Customer phone
            redirect_url: URL to redirect after payment
            buyer_email: Optional customer email
            webhook_url: Optional webhook URL for payment notifications

        Returns:
            dict with payment_request_id, payment_url, and other details

        Raises:
            Exception: If API call fails
        """
        # In development/mock mode, return fake response
        if not self.api_key or settings.is_development:
            return self._mock_payment_request(amount, purpose)

        payload = {
            "amount": str(amount),
            "purpose": purpose,
            "buyer_name": buyer_name,
            "phone": buyer_phone,
            "redirect_url": redirect_url,
            "send_email": "False",
            "send_sms": "False",
            "allow_repeated_payments": "False",
        }

        if buyer_email:
            payload["email"] = buyer_email

        if webhook_url:
            payload["webhook"] = webhook_url

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/payment-requests/",
                headers=self.headers,
                data=payload,
            )

            if response.status_code != 201:
                error_data = response.json()
                raise Exception(f"Instamojo API error: {error_data}")

            data = response.json()
            payment_request = data.get("payment_request", {})

            return {
                "payment_request_id": payment_request.get("id"),
                "payment_url": payment_request.get("longurl"),
                "status": payment_request.get("status"),
            }

    async def get_payment_status(self, payment_request_id: str) -> dict[str, Any]:
        """
        Get payment request status from Instamojo.

        Args:
            payment_request_id: The payment request ID

        Returns:
            dict with payment status details
        """
        if not self.api_key or settings.is_development:
            return {"status": "Completed", "payments": [{"payment_id": "mock_payment_123"}]}

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/payment-requests/{payment_request_id}/",
                headers=self.headers,
            )

            if response.status_code != 200:
                raise Exception("Failed to get payment status")

            data = response.json()
            return data.get("payment_request", {})

    async def create_refund(
        self,
        payment_id: str,
        refund_type: str,
        body: str,
        refund_amount: float | None = None,
    ) -> dict[str, Any]:
        """
        Create a refund for a payment.

        Args:
            payment_id: The payment ID to refund
            refund_type: Type of refund (RFD, TNR, QFL, QNR, EWN, TAN, PTH)
            body: Reason for refund
            refund_amount: Amount to refund (optional, defaults to full)

        Returns:
            dict with refund details
        """
        if not self.api_key or settings.is_development:
            return {"refund_id": "mock_refund_123", "status": "Pending"}

        payload = {
            "payment_id": payment_id,
            "type": refund_type,
            "body": body,
        }

        if refund_amount:
            payload["refund_amount"] = str(refund_amount)

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/refunds/",
                headers=self.headers,
                data=payload,
            )

            if response.status_code != 201:
                error_data = response.json()
                raise Exception(f"Refund creation failed: {error_data}")

            data = response.json()
            return data.get("refund", {})

    def _mock_payment_request(self, amount: float, purpose: str) -> dict[str, Any]:
        """Generate mock payment request for development."""
        import uuid

        mock_id = str(uuid.uuid4())[:8]
        return {
            "payment_request_id": f"mock_req_{mock_id}",
            "payment_url": f"http://localhost:3000/mock-payment?id={mock_id}&amount={amount}&purpose={purpose}",
            "status": "Pending",
        }
