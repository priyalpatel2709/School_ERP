### Teacher Monitoring: Check Submission Status
*See who submitted and who missed the deadline.*

**Endpoint**: `GET /api/v1/homeWork/submission-status/:homeworkId`

**Response**:
```json
{
  "homeworkTitle": "Algebra Chapter 5",
  "totalStudents": 40,
  "submittedCount": 25,
  "students": [
    {
      "name": "Alice",
      "status": "Submitted",
      "grade": "A"
    },
    {
      "name": "Bob",
      "status": "Overdue", // 🔴 Red Alert
      "submissionDate": null
    }
  ]
}
```
**Frontend Tip**: Use this to draw a Pie Chart (Submitted vs Pending).
