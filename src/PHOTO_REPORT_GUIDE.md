# 📸 Photo Capture & Report Submission - Complete Guide

## ✅ **What I've Built:**

### **New Components:**
1. **ReportForm.jsx** - Form with photo management, category, train/station selection, description
2. **ReviewReport.jsx** - Review screen before final submission
3. **ReportSuccess.jsx** - Success confirmation screen

### **Updated Components:**
1. **PassengerHome.jsx** - Now captures photos and navigates to report form
2. **App.js** - Handles navigation between all screens

---

## 🎯 **Complete User Flow:**

### **1. Passenger Sign In**
- Enter name → Click "Continue"

### **2. Home Page (Camera)**
- See greeting: "Afternoon [Name]"
- Tap "Tap to Open Camera"
- Allow camera permission
- **Take photo** → Automatically navigates to Report Form

### **3. Report Form**
- **Photo displayed** (first photo taken)
- **Add more photos** (optional, up to 3 total):
  - Click "Add Photo" button
  - Choose: "Take Photo" (camera) OR "Choose from Gallery"
  - Can delete any photo by clicking X
- **Select Category**: Accessibility OR Safety (mutually exclusive)
- **Select Train Line**: Capital, Metro, or Valley
- **Select Station**: Automatically filtered based on train line
- **Describe Issue**: Text area for description
- **Click "Review Report"** → Goes to review screen

### **4. Review Report**
- See all photos
- See all details (category, train line, station, description)
- See validation checkmarks (all requirements met)
- **Options:**
  - "Submit Report" → Downloads JSON and shows success
  - "Edit Report" → Go back to form

### **5. Success Screen**
- Green checkmark animation
- Confirmation message
- Report ID displayed
- JSON file downloaded
- "Back to Home" button

---

## 📥 **Files You Need:**

### **New Files (Download these):**
1. **[ReportForm.jsx](ReportForm.jsx)** - Report form component
2. **[ReviewReport.jsx](ReviewReport.jsx)** - Review screen
3. **[ReportSuccess.jsx](ReportSuccess.jsx)** - Success screen

### **Updated Files (Replace these):**
1. **[PassengerHome.jsx](PassengerHome.jsx)** - Updated with photo capture
2. **[App.js](App.js)** - Updated with navigation

---

## 🚀 **Installation:**

1. Copy all 5 files above to your `src` folder
2. Run `npm start`
3. Test the complete flow!

---

## 📸 **Photo Features:**

### **Photo Capture:**
- ✅ Captures from video stream (canvas API)
- ✅ Max 3 photos total
- ✅ First photo from camera automatically included
- ✅ Can add 2 more photos (camera or gallery)

### **Photo Management:**
- ✅ Delete any photo
- ✅ First photo labeled as "Main"
- ✅ Preview all photos
- ✅ Photos shown in review

### **Add More Photos:**
- Camera: Opens full-screen camera
- Gallery: Opens device file picker
- Can mix camera + gallery photos

---

## 📋 **Form Validation:**

### **Required Fields:**
- ✅ At least 1 photo (checked)
- ✅ Category selected (checked)
- ✅ Train line selected (checked)
- ✅ Station selected (checked)
- ✅ Description filled (checked)

### **Button States:**
- "Review Report" button disabled until all fields valid
- Shows validation errors when trying to submit incomplete

---

## 🚆 **Train Line & Station Logic:**

### **Cascading Dropdowns:**
```
1. Select Train Line
   ↓
2. Stations filtered automatically
   ↓
3. Select Station
```

### **Station Data:**

**Capital Line (15 stations):**
- Clareview, Belvedere, Coliseum, Stadium, Churchill, Central, Bay/Enterprise Square, Corona, Government Centre, University, Health Sciences/Jubilee, McKernan/Belgravia, South Campus/Fort Edmonton Park, Southgate, Century Park

**Metro Line (10 stations):**
- NAIT, Kingsway, MacEwan, Churchill, Central, Bay/Enterprise Square, Corona, Government Centre, University, Health Sciences/Jubilee

**Valley Line (5 stations):**
- Mill Woods, Davies, Muttart, Downtown, West Edmonton Mall

### **Important:**
- Changing train line resets station selection
- Can't select station until train line is chosen

---

## 📄 **JSON Generation:**

### **What Gets Generated:**
When user clicks "Submit Report", a JSON file is created with:

```json
{
  "report_id": "tmp-20251102-191210",
  "timestamp": "2025-11-02T19:12:10-07:00",
  "user_id": "anon_4281",
  "report_details": { ... },
  "photos": [ ... ],
  "geo": { ... },
  "device_info": { ... },
  "validation_flags": { ... },
  "ui_flow": { ... },
  "backend_flags": { ... }
}
```

### **File Download:**
- Automatically downloads as `report_[ID].json`
- Contains all form data
- Includes photo data (base64 in current implementation)
- Ready for backend processing

---

## ⚠️ **Back Button Behavior:**

### **From Report Form:**
- Shows confirmation: "Are you sure?"
- Warns: "You will lose all progress"
- If confirmed: Returns to home (camera)
- All photos and form data lost

### **From Review:**
- Simply goes back to form
- No data loss
- Can edit and re-submit

---

## 🎨 **Design Consistency:**

All screens use the **same blue passenger theme:**
- Blue gradient background
- Blue accent colors
- Consistent button styles
- Consistent spacing and padding
- Professional appearance

---

## 🧪 **Testing Checklist:**

### **Photo Capture:**
- [ ] Camera opens when tapping viewfinder
- [ ] Photo captured on shutter click
- [ ] Navigates to form with photo

### **Add Photos:**
- [ ] "Add Photo" button appears (when < 3 photos)
- [ ] Modal shows "Take Photo" and "Choose from Gallery"
- [ ] Camera opens for new photo
- [ ] Gallery opens and accepts selection
- [ ] Max 3 photos enforced
- [ ] Can delete photos

### **Form Fields:**
- [ ] Category buttons toggle (mutually exclusive)
- [ ] Train line dropdown works
- [ ] Stations update when train line changes
- [ ] Station resets when changing train line
- [ ] Description textarea works
- [ ] Review button disabled until complete

### **Review Screen:**
- [ ] All photos displayed
- [ ] All details correct
- [ ] Validation checkmarks shown
- [ ] Edit goes back to form
- [ ] Submit downloads JSON

### **Success Screen:**
- [ ] Animation plays
- [ ] Report ID shown
- [ ] Back to home works
- [ ] Returns to camera page

### **Back Button:**
- [ ] Confirmation dialog appears
- [ ] Canceling keeps you on form
- [ ] Confirming returns to home
- [ ] All data cleared

---

## 💡 **Key Features:**

1. **Automatic Navigation**: Photo capture → Form → Review → Success
2. **Smart Validation**: Can't submit incomplete reports
3. **Photo Flexibility**: Camera or gallery, up to 3 photos
4. **Cascading Dropdowns**: Stations filter by train line
5. **Data Preservation**: Edit button preserves all data
6. **JSON Export**: Full report data downloadable
7. **User-Friendly**: Clear confirmations and success messages

---

## 🔄 **Navigation Map:**

```
Passenger Welcome
    ↓ (sign in)
Passenger Home (Camera)
    ↓ (take photo)
Report Form
    ↓ (review report)
Review Report
    ↓ (submit)
Success Screen
    ↓ (back to home)
Passenger Home (Camera)
```

---

## 📱 **Mobile Optimization:**

- ✅ Touch-friendly buttons (44px minimum)
- ✅ Responsive layout
- ✅ Full-screen camera
- ✅ Native file picker for gallery
- ✅ Smooth animations
- ✅ Proper keyboard handling

---

## 🎉 **You're All Set!**

Download the 5 files, copy to `src`, and run `npm start`. The complete photo capture and report submission flow is ready to test!

---

**Questions? Issues? Let me know!** 🚀
