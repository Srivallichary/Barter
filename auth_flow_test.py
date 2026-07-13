import os
import json
from urllib import request
from urllib.error import HTTPError

BASE_URL = "http://localhost:5000"

headers = {"Content-Type": "application/json"}

email = f"authtest-{os.getpid()}-{int(os.times().system)}@example.com"

print('email', email)

payload = json.dumps({"email": email}).encode('utf-8')
req = request.Request(f"{BASE_URL}/api/auth/send-otp", data=payload, headers=headers, method='POST')
try:
    with request.urlopen(req) as resp:
        print('send-otp', resp.status, resp.read().decode())
except HTTPError as err:
    print('send-otp error', err.code, err.read().decode())
    raise

# read OTP from database using backend models via node? fallback to direct API using same email
print('done')
