// Main script for Quicksilver Ledger Coin Melt Value Calculator

// Constants
const TROY_OUNCE_CONVERSION = 0.0321507466;
let currentSilverPrice = 29.15;
let currentGoldPrice = 1800.00;
let activeCountry = 'us';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const silverPriceElement = document.getElementById('silver-price');
    const goldPriceElement = document.getElementById('gold-price');
    const silverUpdateElement = document.getElementById('silver-update');
    const goldUpdateElement = document.getElementById('gold-update');
    const calculateButton = document.getElementById('calculate-btn');
    const quantityInput = document.getElementById('quantity');
    const usCoinTypeSelect = document.getElementById('us-coin-type');
    const canadaCoinTypeSelect = document.getElementById('canada-coin-type');
    const mexicoCoinTypeSelect = document.getElementById('mexico-coin-type');
    const coinImageElement = document.getElementById('coin-image');
    const resultCoinTypeElement = document.getElementById('result-coin-type');
    const resultMetalContentElement = document.getElementById('result-metal-content');
    const resultWeightElement = document.getElementById('result-weight');
    const resultQuantityElement = document.getElementById('result-quantity');
    const resultMeltValueElement = document.getElementById('result-melt-value');
    const coinFactsElement = document.getElementById('coin-facts-text');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Initialize
    updatePrices();
    setInterval(updatePrices, 300000); // Update prices every 5 minutes

    // Set default image when page loads
    setDefaultImage();

    // Event Listeners
    calculateButton.addEventListener('click', calculateMeltValue);
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const country = tab.getAttribute('data-country');
            changeCountry(country);
        });
    });

    usCoinTypeSelect.addEventListener('change', function() {
        const selectedCoin = this.value;
        if (selectedCoin) {
            updateCoinInfo(selectedCoin);
        }
    });

    canadaCoinTypeSelect.addEventListener('change', function() {
        const selectedCoin = this.value;
        if (selectedCoin) {
            updateCoinInfo(selectedCoin);
        }
    });

    mexicoCoinTypeSelect.addEventListener('change', function() {
        const selectedCoin = this.value;
        if (selectedCoin) {
            updateCoinInfo(selectedCoin);
        }
    });
	function getCoinData(coinType) {
    return coinData[coinType] || null;
}

    quantityInput.addEventListener('input', function() {
        let coinType;
        switch (activeCountry) {
            case 'us':
                coinType = usCoinTypeSelect.value;
                break;
            case 'canada':
                coinType = canadaCoinTypeSelect.value;
                break;
            case 'mexico':
                coinType = mexicoCoinTypeSelect.value;
                break;
        }

        if (!coinType) return;

        const coinInfo = getCoinData(coinType);
        if (!coinInfo) return;

        const quantity = parseInt(this.value) || 1;
        resultQuantityElement.textContent = quantity;
        const metalPrice = coinInfo.metal === 'silver' ? currentSilverPrice : currentGoldPrice;
        const meltValue = metalPrice * TROY_OUNCE_CONVERSION * coinInfo.weight * coinInfo.purity * quantity;
        resultMeltValueElement.textContent = `$${meltValue.toFixed(2)}`;
    });

    function changeCountry(country) {
        activeCountry = country;

        tabs.forEach(tab => {
            if (tab.getAttribute('data-country') === country) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if (content.id === `${country}-content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Update default image on tab change
        setDefaultImage();
    }

    async function updatePrices() {
        try {
            const silverFluctuation = (Math.random() * 4 - 2) / 100;
            currentSilverPrice = Math.max(20, Math.min(40, currentSilverPrice * (1 + silverFluctuation)));

            const goldFluctuation = (Math.random() * 2 - 1) / 100;
            currentGoldPrice = Math.max(1500, Math.min(2200, currentGoldPrice * (1 + goldFluctuation)));

            silverPriceElement.textContent = `$${currentSilverPrice.toFixed(2)}/oz`;
            goldPriceElement.textContent = `$${currentGoldPrice.toFixed(2)}/oz`;

            const now = new Date();
            const updateTime = now.toLocaleString();
            silverUpdateElement.textContent = updateTime;
            goldUpdateElement.textContent = updateTime;
        } catch (error) {
            console.error('Error updating prices:', error);
        }
    }

    function calculateMeltValue() {
        let coinType;
        switch (activeCountry) {
            case 'us':
                coinType = usCoinTypeSelect.value;
                break;
            case 'canada':
                coinType = canadaCoinTypeSelect.value;
                break;
            case 'mexico':
                coinType = mexicoCoinTypeSelect.value;
                break;
        }

        if (!coinType) {
            alert('Please select a coin type.');
            return;
        }

        const quantity = parseInt(quantityInput.value) || 1;
        const coinInfo = getCoinData(coinType);

        if (!coinInfo) {
            alert('Could not find data for selected coin.');
            return;
        }

        const metalPrice = coinInfo.metal === 'silver' ? currentSilverPrice : currentGoldPrice;
        const meltValue = metalPrice * TROY_OUNCE_CONVERSION * coinInfo.weight * coinInfo.purity * quantity;

        resultCoinTypeElement.textContent = coinType;
        resultMetalContentElement.textContent = `${coinInfo.metal === 'silver' ? 'Silver' : 'Gold'} ${(coinInfo.purity * 100).toFixed(1)}%`;
        resultWeightElement.textContent = `${coinInfo.weight.toFixed(2)} grams`;
        resultQuantityElement.textContent = quantity;
        resultMeltValueElement.textContent = `$${meltValue.toFixed(2)}`;

        coinImageElement.src = getCoinImageUrl(coinType, coinInfo.country);
        coinFactsElement.textContent = coinFacts[coinType] || 'No additional information available for this coin.';
    }

    function updateCoinInfo(coinType) {
        const coinInfo = getCoinData(coinType);
        if (!coinInfo) return;

        coinImageElement.src = getCoinImageUrl(coinType, coinInfo.country);
        coinFactsElement.textContent = coinFacts[coinType] || 'No additional information available for this coin.';

        resultCoinTypeElement.textContent = coinType;
        resultMetalContentElement.textContent = `${coinInfo.metal === 'silver' ? 'Silver' : 'Gold'} ${(coinInfo.purity * 100).toFixed(1)}%`;
        resultWeightElement.textContent = `${coinInfo.weight.toFixed(2)} grams`;

        const quantity = parseInt(quantityInput.value) || 1;
        resultQuantityElement.textContent = quantity;
        const metalPrice = coinInfo.metal === 'silver' ? currentSilverPrice : currentGoldPrice;
        const meltValue = metalPrice * TROY_OUNCE_CONVERSION * coinInfo.weight * coinInfo.purity * quantity;
        resultMeltValueElement.textContent = `$${meltValue.toFixed(2)}`;
    }

    function setDefaultImage() {
        const coinImageElement = document.getElementById('coin-image');
        switch (activeCountry) {
            case 'us':
                coinImageElement.src = "images/US/default_coin.jpg";
                break;
            case 'canada':
                coinImageElement.src = "images/Canada/default_coin.jpg";
                break;
            case 'mexico':
                coinImageElement.src = "images/Mexico/default_coin.jpg";
                break;
            default:
                coinImageElement.src = "images/default_coin.jpg";
        }
    }


// Helper function to get coin image URL
function getCoinImageUrl(coinType, country) {
    // Map coin types to image filenames
    const imageMap = {
        // US Silver Coins
        "1942-1945 Silver War Nickel": "war_nickel.jpg",
        "1892-1916 Silver Barber Dime": "barber_dime.jpg",
        "1916-1945 Silver Mercury Dime": "mercury_dime.jpg",
        "1946-1964 Roosevelt Silver Dime": "roosevelt_dime.jpg",
        "1892-1916 Barber Quarter": "barber_quarter.jpg",
        "1916-1930 Standing Liberty Quarter": "standing_liberty_quarter.jpg",
        "1932-1964 Washington Quarter": "silver_quarter_1932.jpg",
        "1892-1915 Barber Half Dollar": "barber_half_dollar.jpg",
        "1916-1947 Walking Liberty Half Dollar": "walking_liberty_half_dollar.jpg",
        "1948-1963 Franklin Half Dollar": "franklin_half_dollar.jpg",
        "1964 Kennedy Half Dollar": "kennedy_half_dollar_1964.jpg",
        "1965-1970 Kennedy Half Dollar": "kennedy_half_dollar_1965_1970.jpg",
        "1878-1921 Morgan Dollar": "morgan_dollar.jpg",
        "1921-1935 Peace Dollar": "peace_dollar.jpg",
        "1971-1974, 1976 Ike Dollar": "ike_dollar.jpg",
        "1986-2013 Silver Eagle": "silver_eagle.jpg",

        // US Gold Coins
        "1849-1854 Liberty Gold Dollar Type 1": "g_type1.jpeg",
        "1854-1856 Liberty Gold Dollar Type 2": "g_type2.jpeg",
        "1856-1889 Liberty Gold Dollar Type 3": "g_type3.jpeg",
        "1840-1907 Liberty Quarter Eagle": "g_quarereagle.jpeg",
        "1839-1908 Liberty Half Eagle": "g_liberyhalfeagle.jpg",
        "1908-1929 Indian Half Eagle": "g_indianhalfeagle.jpg",
        "1838-1907 Liberty Eagle": "g_liberyeagle.jpeg",
        "1907-1933 Indian Eagle": "g_indianeagle.jpeg",
        "1849-1907 Liberty Double Eagle": "g_liberydoubleeagle.jpeg",
        "1907-1933 Saint Gaudens Double Eagle": "g_saintgaudensdoubleeagle.jpeg",

        // Canadian Silver Coins
        "1858–1919 Nickel": "canada_5_cents_1917.jpg",
        "1920–1921 Nickel": "canada_5_cents_1921.jpg",
        "1858–1910 Dime": "canada_10_cents_1858.jpg",
        "1910–1919 Dime": "canada_10_cents_1919.jpg",
        "1920–1966 Dime": "canada_10_cents_1966.jpg",
        "mid 1967-mid 1968 Dime": "canada_10_cents_1968.jpg",
        "1908–1910 Quarter": "canada_25_cents_1908.jpg",
        "1910–1919 Quarter": "canada_25_cents_1919.jpg",
        "1920–1952 Quarter": "canada_25_cents_1939.jpg",
        "1953–1967 Quarter": "canada_25_cents_1953.jpg",
        "mid 1967-mid 1968 Quarter": "canada_25_cents_1968.jpg",
        "1908–1919 Fifty-cent": "canada_50_cents_1910.jpg",
        "1920–1967 Fifty-cent": "canada_50_cents_1945.jpg",
        "1935–1967 Voyageur Dollar": "canada_VoyageurDollar_1945.jpg",

        // Canadian Gold Coins
        "1912-1914 Five Dollar": "can5d1912.jpg",
        "1912-1914 Ten Dollar": "can10d1912.jpg",

        // Mexican Silver Coins
        "1867-1905 5 Centavos": "mexican_5_cents_1905.jpeg",
        "1867-1905 10 Centavos": "mexican_10_cents_1894.jpg",
        "1905-1914 10 Centavos": "mexican_10_cents_1905.jpg",
        "1925-1935 10 Centavos": "mexican_10_cents_1934.jpg",
        "1898-1905 20 Centavos": "mexican_20_cents_1898.jpg",
        "1905-1914 20 Centavos": "mexican_20_cents_1905.jpg",
        "1920-1943 20 Centavos": "mexican_20_cents_1940.jpg",
        "1869-1890 25 Centavos": "mexican_25_cents_1889.jpeg",
        "1950-1953 25 Centavos": "mexican_25_cents_1953.jpg",
        "1869-1894 50 Centavos": "mexican_50_cents_1878.jpg",
        "1905-1918 50 Centavos": "mexican_50_cents_1913.jpeg",
        "1919-1945 50 Centavos": "mexican_50_cents_1943.jpeg",
        "1935 50 Centavos": "mexican_50_cents_1935.jpeg",
        "1950-1951 50 Centavos": "mexican_50_cents_1950.jpg",
        "1869-1913 1 Peso": "mexican_1_peso_1871.jpeg",
        "1920-1945 1 Peso": "mexican_1_peso_1920.jpg",
        "1947-1948 1 Peso": "mexican_1_peso_1948.jpeg",
        "1950 1 Peso": "mexico_peso_1950.jpg",
        "1947-1948 5 Pesos": "mexican_5_peso_1948.jpeg",
        "1950-1954 5 Pesos": "mexico_5_pesos_1950.jpg",
        "1955-1959 5 Pesos": "mexico_5_peso_1956.jpg",
        "1955-1960 10 Pesos": "mexican_10_peso_1955.jpg",
        "1968-1972 25 Pesos": "mexican_20_peso_1968.jpg",
        "1977-1979 100 Pesos": "mexican_100_peso_1977.jpeg",

        // Mexican Gold Coins
        "1870-1905 1 Peso": "mex1p1903g.jpg",
        "1919-1947 2 Pesos": "mex2p1920.jpg",
        "1870-1892 2-1/2 Pesos": "mex250c1875.jpg",
        "1918-1948 2-1/2 Pesos": "mex250c1945.jpg",
        "1870-1905 5 Pesos": "mex5p1892.jpg",
        "1905-1955 5 Pesos": "mex5p1955.jpeg",
        "1870-1905 10 Pesos": "mex10p1875.jpg",
        "1905-1959 10 Pesos": "mex10p1906.jpg",
        "1870-1905 20 Pesos": "mex20p1871.jpg",
        "1917-1959 20 Pesos": "mex20p1959.jpg",
        "1921-1947 50 Pesos": "mex50p1943.jpg"
    };

    // Get the image filename for this coin
    const imageFile = imageMap[coinType] || "default_coin.jpg";
	 
    switch (country.toLowerCase()) {
        case "us":
            countryFolder = "US";
            break;
        case "canada":
            countryFolder = "Canada"; 
            break;
        case "mexico":
            countryFolder = "Mexico";
            break;
        default:
            countryFolder = "default_coin.jpg";    
}
// Use a relative path to the images directory
    return `./images/${countryFolder}/${imageFile}`;
	}
});