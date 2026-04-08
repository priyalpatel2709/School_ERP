/**
 * Build invoice discount line items from fee structure "Siblings" rules when student has siblings.
 * @param {import("mongoose").Document} student - Student doc with siblings array
 * @param {import("mongoose").Document} feeStructure - FeeStructure doc
 * @param {number} subtotal - Invoice subtotal before discounts
 * @returns {{ discounts: Array, totalDiscount: number }}
 */
function computeSiblingDiscounts(student, feeStructure, subtotal) {
  const discounts = [];
  let totalDiscount = 0;

  const siblingCount = Array.isArray(student.siblings) ? student.siblings.length : 0;
  if (siblingCount === 0 || !feeStructure.discounts || !feeStructure.discounts.length) {
    return { discounts, totalDiscount };
  }

  const rules = feeStructure.discounts.filter(
    (d) => d.applicableFor === "Siblings"
  );

  for (const rule of rules) {
    let discountAmount = 0;
    if (rule.discountType === "Percentage") {
      discountAmount = Math.round((subtotal * (rule.discountValue / 100)) * 100) / 100;
    } else {
      discountAmount = Math.min(rule.discountValue, subtotal - totalDiscount);
    }
    if (discountAmount <= 0) continue;
    discounts.push({
      discountName: rule.discountName,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount,
      reason: `Sibling discount (${siblingCount} linked sibling(s))`,
    });
    totalDiscount += discountAmount;
  }

  return { discounts, totalDiscount };
}

module.exports = {
  computeSiblingDiscounts,
};
