const PERMISSIONS = {
    // Fee Management
    FEE_STRUCTURE_VIEW: 'fee:structure:view',
    FEE_STRUCTURE_CREATE: 'fee:structure:create',
    FEE_STRUCTURE_UPDATE: 'fee:structure:update',
    FEE_STRUCTURE_DELETE: 'fee:structure:delete',
    FEE_INVOICE_VIEW: 'fee:invoice:view',
    FEE_INVOICE_CREATE: 'fee:invoice:create',
    FEE_PAYMENT_RECORD: 'fee:payment:record',
    FEE_PAYMENT_VIEW: 'fee:payment:view',

    // Attendance
    ATTENDANCE_STUDENT_MARK: 'attendance:student:mark',
    ATTENDANCE_STUDENT_VIEW: 'attendance:student:view',
    ATTENDANCE_STAFF_MARK: 'attendance:staff:mark',
    LEAVE_APPLICATION_APPLY: 'leave:application:apply',
    LEAVE_APPLICATION_APPROVE: 'leave:application:approve',

    // Examination
    EXAM_CREATE: 'exam:create',
    EXAM_VIEW: 'exam:view',
    MARKS_ENTER: 'marks:enter',
    MARKS_VERIFY: 'marks:verify',
    RESULT_PUBLISH: 'result:publish',
    REPORT_CARD_GENERATE: 'reportcard:generate',
};

module.exports = PERMISSIONS;
