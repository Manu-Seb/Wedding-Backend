#!/bin/bash

BASE_URL="http://localhost:5000"

GREEN="\e[32m"
RED="\e[31m"
YELLOW="\e[33m"
BLUE="\e[34m"
RESET="\e[0m"

print() {
    echo -e "${BLUE}[*]${RESET} $1"
}

ok() {
    echo -e "${GREEN}[✓]${RESET} $1"
}

fail() {
    echo -e "${RED}[✗]${RESET} $1"
}

# --------------------------------------------------------
# Function to call API safely and return JSON + STATUS
# --------------------------------------------------------
call_api() {
    METHOD=$1
    ENDPOINT=$2
    DATA=$3
    TOKEN=$4

    if [ -n "$DATA" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X $METHOD "$BASE_URL$ENDPOINT" \
            -H "Content-Type: application/json" \
            -H "x-auth-token: $TOKEN" \
            -d "$DATA")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" -X $METHOD "$BASE_URL$ENDPOINT" \
            -H "Content-Type: application/json" \
            -H "x-auth-token: $TOKEN")
    fi

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    echo "$HTTP_CODE"
    echo "$BODY"
}

# --------------------------------------------------------
# 1. Create Organization
# --------------------------------------------------------
print "Creating organization..."

read -r STATUS BODY <<<$(call_api "POST" "/org/create" \
'{
  "name": "test-wedding-org",
  "adminEmail": "admin@test.com",
  "adminPassword": "pass123"
}')

if [ "$STATUS" = "201" ]; then
    ok "Created organization successfully"

    TOKEN=$(echo "$BODY" | jq -r '.token')

    print "Token: ${TOKEN:0:25}..."
else
    fail "Organization creation failed (status $STATUS)"
    echo "$BODY"
fi

# --------------------------------------------------------
# 2. Login admin
# --------------------------------------------------------
print "Logging in admin..."

read -r STATUS BODY <<<$(call_api "POST" "/admin/login" \
'{
  "email": "admin@test.com",
  "password": "pass123"
}')

if [ "$STATUS" = "200" ]; then
    ok "Login OK"
    LOGIN_TOKEN=$(echo "$BODY" | jq -r '.token')
else
    fail "Login failed (status $STATUS)"
fi

# --------------------------------------------------------
# 3. Get org
# --------------------------------------------------------
print "Fetching organization details..."

read -r STATUS BODY <<<$(call_api "GET" "/org/get/test-wedding-org" "" "$TOKEN")

if [ "$STATUS" = "200" ]; then
    ok "Organization fetched successfully"
else
    fail "Failed to fetch organization (status $STATUS)"
fi

# --------------------------------------------------------
# 4. Update org name
# --------------------------------------------------------
print "Updating organization..."

read -r STATUS BODY <<<$(call_api "PUT" "/org/update/test-wedding-org" \
'{
  "name": "updated-wedding-org"
}' "$TOKEN")

if [ "$STATUS" = "200" ]; then
    ok "Organization updated"
else
    fail "Organization update failed (status $STATUS)"
fi

# --------------------------------------------------------
# 5. Delete org
# --------------------------------------------------------
print "Deleting organization..."

read -r STATUS BODY <<<$(call_api "DELETE" "/org/delete/updated-wedding-org" "" "$TOKEN")

if [ "$STATUS" = "200" ]; then
    ok "Organization deleted successfully"
else
    fail "Deletion failed (status $STATUS)"
fi

echo -e "\n${GREEN}All tests complete.${RESET}"
