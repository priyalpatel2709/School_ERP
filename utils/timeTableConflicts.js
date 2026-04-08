const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function timeToMinutes(t) {
  if (!t || typeof t !== "string") return 0;
  const [h, m] = t.split(":").map((x) => parseInt(x, 10) || 0);
  return h * 60 + m;
}

function slotOverlaps(aStart, aEnd, bStart, bEnd) {
  const as = timeToMinutes(aStart);
  const ae = timeToMinutes(aEnd);
  const bs = timeToMinutes(bStart);
  const be = timeToMinutes(bEnd);
  if (ae <= as || be <= bs) return false;
  return as < be && bs < ae;
}

/**
 * Flatten all teaching slots from one timetable document.
 * @returns {Array<{ day: string, startTime: string, endTime: string, teacherId: string, classId: string, subjectId: string, isBreak: boolean }>}
 */
function collectSlots(timeTableDoc) {
  const out = [];
  if (!timeTableDoc || !timeTableDoc.week) return out;
  const classId = timeTableDoc.class ? String(timeTableDoc.class) : "";
  for (const day of DAYS) {
    const lectures = timeTableDoc.week[day];
    if (!Array.isArray(lectures)) continue;
    lectures.forEach((lec) => {
      if (!lec || lec.isBreak) return;
      if (!lec.teacher) return;
      out.push({
        day,
        startTime: lec.startTime,
        endTime: lec.endTime,
        teacherId: String(lec.teacher),
        subjectId: lec.subject ? String(lec.subject) : "",
        classId,
        isBreak: !!lec.isBreak,
      });
    });
  }
  return out;
}

/**
 * Find conflicts: same teacher, same day, overlapping times, different classes.
 * @param {Array} timeTableDocs - populated or lean TimeTable docs for one academic year
 */
function findTeacherSlotConflicts(timeTableDocs) {
  const all = [];
  timeTableDocs.forEach((tt) => {
    collectSlots(tt).forEach((s) => all.push(s));
  });

  const conflicts = [];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];
      if (a.teacherId !== b.teacherId) continue;
      if (a.day !== b.day) continue;
      if (a.classId === b.classId) continue;
      if (!slotOverlaps(a.startTime, a.endTime, b.startTime, b.endTime)) continue;
      conflicts.push({
        teacherId: a.teacherId,
        day: a.day,
        slotA: { classId: a.classId, startTime: a.startTime, endTime: a.endTime },
        slotB: { classId: b.classId, startTime: b.startTime, endTime: b.endTime },
      });
    }
  }
  return conflicts;
}

module.exports = {
  DAYS,
  collectSlots,
  findTeacherSlotConflicts,
  slotOverlaps,
  timeToMinutes,
};
