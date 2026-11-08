/**
 * Format integer paise into localized currency string.
 * Money is stored as integer paise (e.g. 280000 = ₹2,800.00). Never use floats for storage.
 *
 * @param {number|bigint} paise
 * @param {string} [currency='INR']
 * @param {string} [locale='en-IN']
 * @returns {string}
 */
export function formatMoney(paise = 0, currency = "INR", locale = "en-IN") {
  const amount = Number(paise) / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

