#!/bin/bash

echo "============================================"
echo "Smart Lecture AI - Firebase Setup Script"
echo "============================================"
echo ""

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "[1/6] Logging in to Firebase..."
    firebase login
    if [ $? -ne 0 ]; then
        echo "Error: Failed to login to Firebase"
        exit 1
    fi
else
    echo "[1/6] Already logged in to Firebase ✓"
fi

echo ""
echo "[2/6] Creating Firebase project..."
read -p "Enter project name (e.g., smart-lecture-ai): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-smart-lecture-ai}

if firebase projects:create "$PROJECT_NAME" --display-name="Smart Lecture AI" 2>/dev/null; then
    echo "Project created successfully ✓"
else
    echo "Project may already exist, using existing project"
    firebase projects:list
    read -p "Enter existing project name: " PROJECT_NAME
fi

echo ""
echo "[3/6] Enabling Firebase services..."
echo "Go to Firebase Console: https://console.firebase.google.com/project/$PROJECT_NAME"
echo ""
echo "Please enable the following services:"
echo "  1. Authentication (Email/Password provider)"
echo "  2. Firestore Database (Start in test mode)"
echo "  3. Storage (Start in test mode)"
echo ""
read -p "Press Enter after enabling services..."

echo ""
echo "[4/6] Getting Firebase configuration..."
firebase apps:create web --project="$PROJECT_NAME" --json > firebase-config.json 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Configuration saved to firebase-config.json ✓"
else
    echo "Warning: Could not auto-generate config, get it from Firebase Console"
fi

echo ""
echo "[5/6] Deploying Firestore and Storage rules..."
firebase deploy --only firestore:rules --project="$PROJECT_NAME"
firebase deploy --only storage:rules --project="$PROJECT_NAME"

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Firebase credentials"
echo "2. Run: npm install"
echo "3. Run: vercel --prod"
echo ""
