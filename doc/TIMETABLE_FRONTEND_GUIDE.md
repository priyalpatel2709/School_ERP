# 🕒 Admin Timetable: Frontend Implementation Guide

This guide provides a blueprint for building a high-performance, intuitive Timetable Management interface for the School Admin.

---

## 🏗️ 1. Architecture Overview

Timetable management is a **three-step process** in the UI:
1.  **Global Filters**: Select `Academic Year` and `Class` (e.g., 10-A).
2.  **Master Fetching**: Load available `Teachers` and `Subjects` to use as "building blocks".
3.  **Grid View**: A 7-column (Monday-Sunday) interactive grid showing the schedule.

---

## ⚡ 2. API Integration Blueprint

### A. Load Initial Data (The Dropdowns)
Before the admin can build a timetable, you must fetch the required Masters:
- **Classes**: `GET /api/v1/class` (to choose which class's timetable to edit).
- **Teachers**: `GET /api/v1/teacher` (to assign to slots).
- **Subjects**: `GET /api/v1/subject` (to assign to slots).

### B. Fetch Existing Timetable
When a Class is selected, check if a timetable already exists:
- **Endpoint**: `GET /api/v1/timeTable`
- **Frontend Logic**: Filter the response for the selected `classId`.

### C. Creating/Updating
- **Create**: `POST /api/v1/timeTable` (First-time setup).
- **Update**: `PUT /api/v1/timeTable/:id` (Adding/Editing lectures).

---

## 🎨 3. UI/UX Design (The "WOW" Factor)

### The Weekly Grid Component
Build a responsive grid using CSS Grid or Flexbox.
- **Top Row**: Days of the week (Mon, Tue, Wed, ...).
- **Left Column**: Time Slots or Lecture Numbers.

### Premium Features to Implement:
1.  **Visual Conflict Alerts**: Since the backend is flexible, the frontend should highlight if the same Teacher is placed in two different class grids at the same time.
2.  **Break Slots**: Use a toggle switch for `isBreak`. Break slots should span across the entire row and be styled differently (e.g., light gray background).
3.  **Quick Copy**: Add a button to "Copy Monday schedule to Tuesday" to save the Admin's time.

---

## 🛠️ 4. Payload Structures for Frontend

### Adding a Lecture (via `PUT /api/v1/timeTable/:id`)
When the admin clicks on a slot in the grid (e.g., Monday at 9:00 AM), open a modal and send this data on save:

```json
{
  "day": "Monday",
  "lectures": [
    {
      "index": 0, // 0 for the first slot, 1 for second...
      "subjectId": "64b...", 
      "teacherId": "64b...",
      "startTime": "09:00 AM",
      "endTime": "10:00 AM",
      "isBreak": false,
      "classRoom": "Room 204",
      "lectureNumber": 1
    }
  ]
}
```

---

## 🧩 5. State Management Example (React)

```javascript
const [selectedClass, setSelectedClass] = useState(null);
const [timetableData, setTimetableData] = useState({
  Monday: [],
  Tuesday: [],
  // ...other days
});

// Load timetable when class changes
useEffect(() => {
  if (selectedClass) {
    fetchTimetableByClass(selectedClass._id).then(data => {
      setTimetableData(data.week);
    });
  }
}, [selectedClass]);
```

---

## 🚀 6. Admin User Workflow

1.  **Navigate** to `Academics > Timetable`.
2.  **Select** Class (e.g., "9th - B").
3.  **View** existing data or a "Blank Grid" if none exists.
4.  **Click a Slot** to add a lecture:
    *   Pick Subject (Dropdown).
    *   Pick Teacher (Dropdown).
    *   Set Time (TimePicker).
5.  **Save** changes. The UI should show a "Success" toast and refresh the grid.

---

## 📱 7. Responsive Considerations
On mobile devices, a 7-column grid is too wide. 
- **Mobile View**: Show a "Tabbed" interface where the user selects one day at a time (e.g., Only Monday lectures are visible, with tabs for other days).
- **Desktop View**: Full weekly overview.
