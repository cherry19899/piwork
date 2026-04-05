/**
 * Pi currency utilities
 */

const PI_SYMBOL = 'π';

export const formatPi = (amount, decimals = 2) => {
  if (amount === null || amount === undefined) return `${PI_SYMBOL}0`;

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${PI_SYMBOL}${num.toFixed(decimals)}`;
};

export const parsePi = (piString) => {
  // Remove Pi symbol and convert to number
  return parseFloat(piString.replace(PI_SYMBOL, '').trim());
};

export const getPiDisplayValue = (amount, currency = 'usd', exchangeRate = 0) => {
  if (currency === 'pi') {
    return formatPi(amount);
  }

  if (currency === 'usd' && exchangeRate > 0) {
    const usdValue = amount * exchangeRate;
    return `$${usdValue.toFixed(2)}`;
  }

  // Show both
  return `${formatPi(amount)} ($${(amount * exchangeRate).toFixed(2)})`;
};

export const convertPiToUsd = (piAmount, exchangeRate) => {
  return piAmount * exchangeRate;
};

export const convertUsdToPi = (usdAmount, exchangeRate) => {
  return usdAmount / exchangeRate;
};

export const validatePiAmount = (amount) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0;
};
