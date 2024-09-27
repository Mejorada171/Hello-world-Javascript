const dropList = document.querySelectorAll(".drop-list select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code) {
        // Selecting USD by default as FROM currency and NPR as TO currency 
        let selected;
        if (i == 0) {
            selected = currency_code == "USD" ? "selected" : "";
        } else if (i == 1) {
            selected = currency_code == "NPR" ? "selected" : "";
        }
        // Creating option tag with passing currency cose as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // Inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target); // Calling loadFlag with passing target element as an argument
    });
}

function loadFlag(element) {
    // Loop over the keys of the country_code object
    for (let code in country_code) {
        if (code == element.value) {  // If currency code matches the option value
            let imgTag = element.parentElement.querySelector("img");  // Select the img tag
            // Set the image source dynamically based on the country code
            imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
        }
    }
}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault(); // Preventing form from submitting 
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value; // Temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value // Passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // Passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // Calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); // Calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate();
});

function getExchangeRate() {
    const amount = document.querySelector(".amount input"),
        exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;

    // If user doesn't enter any value or enters 0, set 1 as default
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerHTML = "Getting exchange rate...";

    // Replace YOUR_API_KEY with your actual API key
    let url = `https://v6.exchangerate-api.com/v6/226344872bdad1857d10cd75/latest/${fromCurrency.value}`;

    // Fetching API response and returning it as a parsed JS object
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value]; // Use 'exchangeRate' instead of 'getExchangeRate'
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2); // Use 'exchangeRate' for conversion
            exchangeRateTxt.innerHTML = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        })
        .catch(() => {
            // If an error occurs, like being offline, show an error message
            exchangeRateTxt.innerHTML = "Something went wrong.";
        });
}

