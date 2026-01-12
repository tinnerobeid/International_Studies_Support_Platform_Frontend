import requests
import sys

BASE_URL = "http://localhost:8000/api/auth"

def test_auth_flow():
    # 1. Register
    email = "test_user_verify@example.com"
    password = "password123"
    full_name = "Verification User"
    
    print(f"1. Registering user: {email}")
    try:
        res = requests.post(f"{BASE_URL}/register", json={
            "email": email,
            "password": password,
            "full_name": full_name,
            "role": "student"
        })
        if res.status_code == 200:
            print("   SUCCESS: User registered.")
        elif res.status_code == 400 and "already registered" in res.text:
             print("   User already exists, proceeding to login.")
        else:
            print(f"   FAILED: {res.status_code} {res.text}")
            return
            
        # 2. Login
        print("2. Logging in...")
        res = requests.post(f"{BASE_URL}/login", json={
            "email": email,
            "password": password
        })
        
        if res.status_code != 200:
            print(f"   FAILED: {res.status_code} {res.text}")
            return
            
        data = res.json()
        token = data.get("access_token")
        if not token:
            print("   FAILED: No token received.")
            return
        print("   SUCCESS: Token received.")
        
        # 3. Get Me
        print("3. Fetching /me...")
        res = requests.get(f"{BASE_URL}/me", headers={"Authorization": f"Bearer {token}"})
        
        if res.status_code != 200:
             print(f"   FAILED: {res.status_code} {res.text}")
             return
             
        user = res.json()
        print(f"   SUCCESS: Hello {user.get('full_name')} ({user.get('email')})")
        
    except Exception as e:
        print(f"   ERROR: {e}")

if __name__ == "__main__":
    test_auth_flow()
