function checkPrime() {
    const number = document.getElementById('number').value;
    const resultButton = document.getElementById('resultButton');

    if (number === '') {
        resultButton.className = 'black'; 
    } else {
        const num = parseInt(number);
        if (isPrime(num)) {
            resultButton.className = 'green'; 
        } else {
            resultButton.className = 'red'; 
        }
    }
}

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}
