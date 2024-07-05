function generateRandomAccountNumber() {
  const bankIdentifier = "2390";
  const accountSpecific = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  const checkDigit = Math.floor(Math.random() * 10);

  return `${bankIdentifier}${accountSpecific}${checkDigit}`;
}

function generateRandomRoutingNumber() {
  const fedReserveZone = "23";
  const fedReserveBranch = "90";
  const bankSpecific = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  return `${fedReserveZone}${fedReserveBranch}${bankSpecific}`;
}

function generateRandomCardNumber() {
  const iin = "424242";
  const accountNumber = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(9, "0");

  return `${iin}${accountNumber}`;
}

function generateRandomCVV() {
  return Math.floor(Math.random() * 900) + 100;
}

function generateRandomExpirationDate() {
  const month = Math.floor(Math.random() * 12) + 1;
  const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
  return `${month.toString().padStart(2, "0")}/${year}`;
}

module.exports = {
  generateRandomAccountNumber,
  generateRandomRoutingNumber,
  generateRandomCardNumber,
  generateRandomCVV,
  generateRandomExpirationDate,
};
