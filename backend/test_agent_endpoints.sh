#!/bin/bash
# Test script for Agent endpoints

BASE_URL="http://localhost:3005/api/agent"

echo "Testing Agent Endpoints..."
echo "--------------------------------"

echo "1. List Active Jobs"
curl -s -X POST "$BASE_URL/list-active-jobs" \
  -H "Content-Type: application/json" \
  -d '{"filter": "all"}' | python3 -m json.tool || echo "Failed"
echo -e "\n--------------------------------"

echo "2. Analyze Revenue (Today)"
curl -s -X POST "$BASE_URL/analyze-revenue" \
  -H "Content-Type: application/json" \
  -d '{"time_period": "today"}' | python3 -m json.tool || echo "Failed"
echo -e "\n--------------------------------"

echo "3. Search Customer History (John)"
curl -s -X POST "$BASE_URL/search-history" \
  -H "Content-Type: application/json" \
  -d '{"customer_identifier": "John"}' | python3 -m json.tool || echo "Failed"
echo -e "\n--------------------------------"

echo "4. Generate Report (Daily)"
curl -s -X POST "$BASE_URL/generate-report" \
  -H "Content-Type: application/json" \
  -d '{"report_type": "daily"}' | python3 -m json.tool || echo "Failed"
echo -e "\n--------------------------------"

echo "5. Check Availability"
curl -s -X POST "$BASE_URL/check-availability" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-01-21", "appointment_type": "drop_off"}' | python3 -m json.tool || echo "Failed"
echo -e "\n--------------------------------"

echo "Done."
