"use strict";

// === fetch data ===

async function fetchData() {
  const baseUrl = "https://api.frankfurter.dev";
  // const url = "https://api.frankfurter.dev/v2/currencies";
  // const url02 = "https://api.frankfurter.dev/v2/rates?base=USD";

  function getYesterdayDate() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }
  const yesterday = getYesterdayDate();
  // const urlYesterday = `https://api.frankfurter.dev/v2/rates?base=USD&date=${yesterday}`;

  try {
    const res = await fetch(`${baseUrl}/v2/currencies`);
    const res2 = await fetch(`${baseUrl}/v2/rates?base=USD`);
    const res3 = await fetch(`${baseUrl}/v2/rates?base=USD&date=${yesterday}`);

    if (!res.ok) {
      throw new Error("failed to fetch data");
    }
    const data = await res.json();
    const data2 = await res2.json();
    const data3 = await res3.json();
    console.log(data);
    console.log(data2);
    console.log(data3);

    const mainCurrencies = {
      AUD: "au",
      CAD: "ca",
      CHF: "ch",
      CNY: "cn",
      EUR: "eu",
      GBP: "gb",
      HKD: "hk",
      JPY: "jp",
      KRW: "kr",
      NZD: "nz",
      RUB: "ru",
      USD: "us",
    };

    const targetCurrencies = {
      AED: "ae",
      ARS: "ar",
      AUD: "au",
      BDT: "bd",
      BGN: "bg",
      BHD: "bh",
      BRL: "br",
      CAD: "ca",
      CHF: "ch",
      CLP: "cl",
      CNY: "cn",
      COP: "co",
      CYP: "cy",
      CZK: "cz",
      DKK: "dk",
      EGP: "eg",
      EUR: "eu",
      GBP: "gb",
      HKD: "hk",
      HNL: "hn",
      HRK: "hr",
      HTG: "ht",
      HUF: "hu",
      IDR: "id",
      INR: "in",
      ISK: "is",
      JOD: "jo",
      JPY: "jp",
      KES: "ke",
      KRW: "kr",
      KWD: "kw",
      LBP: "lb",
      LKR: "lk",
      MAD: "ma",
      MXN: "mx",
      MYR: "my",
      NGN: "ng",
      NOK: "no",
      NPR: "np",
      NZD: "nz",
      OMR: "om",
      PEN: "pe",
      PHP: "ph",
      PKR: "pk",
      PLN: "pl",
      QAR: "qa",
      RON: "ro",
      RUB: "ru",
      SAR: "sa",
      SEK: "se",
      SGD: "sg",
      THB: "th",
      TRY: "tr",
      TWD: "tw",
      UAH: "ua",
      USD: "us",
      VND: "vn",
      ZAR: "za",
    };

    //    === dynamically insert into ticker ===

    const tickerContainer = document.querySelector(".ticker__wrapper");

    const mainByCode = Object.fromEntries(
      data2.map((entry) => [entry.quote, entry.rate])
    );
    const mainYesterday = Object.fromEntries(
      data3.map((entry) => [entry.quote, entry.rate])
    );

    tickerContainer.innerHTML = Object.entries(mainCurrencies)
      .map(([quote, code]) => {
        const rate = mainByCode[quote];
        const rateYesterday = mainYesterday[quote];

        if (rate === undefined || rateYesterday === undefined) return "";

        const difference = ((rate - rateYesterday) / rateYesterday) * 100;
        const sign = difference >= 0 ? "+" : "";
        const formattedDifference = `${sign}${difference.toFixed(2)}%`;
        const isUp = difference >= 0;

        return `
      <div class="ticker__container">
        <div class="ticker__pairs">
          <div class="ticker__pairs--currencies">USD/${quote}</div>
          <div class="ticker__pairs--number">${rate}</div>
          <div class="ticker__pairs--movement">
          <div class=" ${isUp ? "up" : "down"}"></div>
<div class="${isUp ? "fav__rate--active" : "fav__rate--inactive"}">
            ${formattedDifference}</div>
          </div>
        </div>
      </div>
          `;
      })
      .join("");

    // === dynamically insert data into currency pickers ===
    const currencyByCode = Object.fromEntries(
      data.map((entry) => [entry.iso_code, entry])
    );

    const otherList = document.querySelector(".other-dropdown");
    const otherList02 = document.querySelector(".other-dropdown02");
    const currencyNumbers = document.querySelectorAll(".other-currency-number");

    currencyNumbers.forEach((number) => {
      number.innerHTML = Object.keys(targetCurrencies).length;
    });

    otherList02.innerHTML = Object.entries(targetCurrencies)
      .map(([code, flagCode]) => {
        const currencyInfo = currencyByCode[code];
        if (!currencyInfo) return "";

        return `<li role="option" aria-selected="false" data-value="${code}"><div class="flag-small">
            <div class="currency-flag currency-flag2"
style = "background-image: url('./assets/images/flags/${flagCode}.webp')

           "
            ></div>${code}<p class="currency-small">${currencyInfo.name}</p></div>
            <div class="currency-check"></div></li>`;
      })
      .join("");

    otherList.innerHTML = Object.entries(targetCurrencies)
      .map(([code, flagCode]) => {
        const currencyInfo = currencyByCode[code];
        if (!currencyInfo) return "";

        return `<li role="option" aria-selected="false" data-value="${code}"><div class="flag-small">
            <div class="currency-flag currency-flag2"
style = "background-image: url('./assets/images/flags/${flagCode}.webp')

           "
            ></div>${code}<p class="currency-small">${currencyInfo.name}</p></div>
            <div class="currency-check"></div></li>`;
      })
      .join("");

    // === select from dropdown list ===

    const popularDropdown = document.querySelectorAll(".popular-dropdown li");
    const popularDropdown2 = document.querySelectorAll(".popular-dropdown2 li");
    const otherDropLi = document.querySelectorAll(".other-dropdown02 li");
    const targetCurrency = document.querySelector(".target-currency");
    const sendWrapper = document.querySelector(".currency-dropdown-btn ");
    const receiveWrapper = document.querySelector(".currency-dropdown-btn02");
    const formatter = new Intl.NumberFormat("en-US");

    function selectOption(option) {
      option.setAttribute("aria-selected", "true");
    }
    function unselectOption(option) {
      option.setAttribute("aria-selected", "false");
    }
    let optionValue = "";
    let optionValue2 = "";
    let optionValue3 = "";

    function getFlagPath(currencyCode, currencyMap) {
      const flagCode = currencyMap[currencyCode];
      return `./assets/images/flags/${flagCode}.webp`;
    }

    // --- send ---
    popularDropdown.forEach((option) => {
      option.addEventListener("click", () => {
        popularDropdown.forEach((item) => {
          unselectOption(item);
          item.lastElementChild.style.opacity = "0";
        });

        selectOption(option);
        optionValue = option.dataset.value;
        option.lastElementChild.style.opacity = "1";

        const flagPath = getFlagPath(optionValue, mainCurrencies);

        sendWrapper.innerHTML = `
        <div class="currency-flag" style = "background-image:url('${flagPath}')"></div>${optionValue}<div class="currency-caret"></div>
        `;

        localStorage.setItem("sendCurrency", optionValue);
      });
    });

    // --- receive ---

    popularDropdown2.forEach((option) => {
      option.addEventListener("click", () => {
        popularDropdown2.forEach((item) => {
          unselectOption(item);
          item.lastElementChild.style.opacity = "0";
        });

        selectOption(option);
        optionValue2 = option.dataset.value;
        option.lastElementChild.style.opacity = "1";
        const flagPath = getFlagPath(optionValue2, mainCurrencies);
        targetCurrency.innerHTML = optionValue2;
        receiveWrapper.innerHTML = `
        <div class="currency-flag currency-flag02"  style = "background-image:url('${flagPath}')"></div>${optionValue2}<div class="currency-caret"></div>
        `;

        localStorage.setItem("receiveCurrency", optionValue2);
        exchangeRate.innerHTML = mainByCode[optionValue2];
      });
    });

    otherDropLi.forEach((option) => {
      option.addEventListener("click", () => {
        otherDropLi.forEach((item) => {
          unselectOption(item);
          item.lastElementChild.style.opacity = "0";
        });

        selectOption(option);
        optionValue3 = option.dataset.value;
        option.lastElementChild.style.opacity = "1";

        const flagPath = getFlagPath(optionValue3, targetCurrencies);
        targetCurrency.innerHTML = optionValue3;
        receiveWrapper.innerHTML = `
        <div class="currency-flag currency-flag02"  style = "background-image:url('${flagPath}')"></div>${optionValue3}<div class="currency-caret"></div>
        `;

        localStorage.setItem("receiveCurrency", optionValue3);
        exchangeRate.innerHTML = mainByCode[optionValue3];
      });
    });

    // === conversion ===

    const exchangeRate = document.querySelector(".exchange-rate");
    const sendInput = document.querySelector("#send-amount");
    const receiveInput = document.querySelector("#receive-amount");
    const sendValue = sendInput.value;
    const receiveCur = localStorage.getItem("receiveCurrency");

    sendInput.addEventListener("input", () => {
      let sendValue = sendInput.value;
      let receiveCur = localStorage.getItem("receiveCurrency");
      sendInput.value = formatter.format(sendValue);
      receiveInput.value = formatter.format(sendValue * mainByCode[receiveCur]);
    });

    // === swap button ===

    const swapBtn = document.querySelector(".converter__swap-btn");

    swapBtn.addEventListener("click", () => {
      const leftCurrency = localStorage.getItem("sendCurrency");
      const rightCurrency = localStorage.getItem("receiveCurrency");
      const flagPath1 = getFlagPath(rightCurrency, targetCurrencies);
      const flagPath2 = getFlagPath(leftCurrency, targetCurrencies);

      sendWrapper.innerHTML = `
        <div class="currency-flag" style = "background-image:url('${flagPath1}')"></div>${rightCurrency}<div class="currency-caret"></div>
        `;

      receiveWrapper.innerHTML = `
        <div class="currency-flag currency-flag02"  style = "background-image:url('${flagPath2}')"></div>${leftCurrency}<div class="currency-caret"></div>
        `;
    });
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

fetchData();

const sendDropBtn = document.querySelector(".currency-dropdown-btn");
const receiveDropBtn = document.querySelector(".currency-dropdown-btn02");
const sendDropMenu = document.querySelector(".currency-dropdown");
const receiveDropMenu = document.querySelector(".currency-dropdown02");

// === display currency dropdown ===

function show(item) {
  item.classList.remove("hide");
}

function hide(item) {
  item.classList.add("hide");
}

function flex(item) {
  item.classList.add("flex");
}

document.addEventListener("click", (e) => {
  if (e.target !== sendDropMenu && e.target !== sendDropBtn) {
    hide(sendDropMenu);
  } else if (e.target === sendDropBtn) {
    show(sendDropMenu);
  }
});

document.addEventListener("click", (e) => {
  if (e.target !== receiveDropMenu && e.target !== receiveDropBtn) {
    hide(receiveDropMenu);
  } else if (e.target === receiveDropBtn) {
    show(receiveDropMenu);
  }
});

// === tab switch ===

const tabItems = document.querySelectorAll(".data__tab-item ");
const historyContainer = document.querySelector(".history-container");
const compareContainer = document.querySelector(".compare-container");
const favContainer = document.querySelector(".fav-container");
const logContainer = document.querySelector(".log-container");

tabItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    tabItems.forEach((tab) => tab.classList.remove("data__tab-item--active"));
    e.target.classList.add("data__tab-item--active");
    if (e.target === tabItems[0]) {
      show(historyContainer);
      hide(compareContainer);
      hide(favContainer);
      hide(logContainer);
    } else if (e.target === tabItems[1]) {
      hide(historyContainer);
      hide(favContainer);
      hide(logContainer);
      show(compareContainer);
    } else if (e.target === tabItems[2]) {
      hide(historyContainer);
      hide(compareContainer);
      hide(logContainer);
      show(favContainer);
    } else if (e.target === tabItems[3]) {
      hide(historyContainer);
      hide(compareContainer);
      hide(favContainer);
      show(logContainer);
    }
  });
});

// === chart history ===

const periodTabs = document.querySelectorAll(".data__period--item");
const xData = document.querySelector(".data__chart-x");
const xDays = ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5"];
const xWeeks = ["Apr 7", "Apr 14", "Apr 21", "Apr 28", "May 06"];
const xMonths = ["Apr", "May", "June", "July", "Aug"];
const x3Months = ["Apr", "July", "Oct", "Jan", "Apr"];
const xYears = ["2022", "2023", "2024", "2025", "2026"];
const x5Years = ["2005", "2010", "2015", "2020", "2025"];

periodTabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    periodTabs.forEach((item) => {
      item.classList.remove("data__period--item-active");
    });
    tab.classList.add("data__period--item-active");
    if (e.target == periodTabs[0]) {
      xData.innerHTML = `
        <p class="x-axis-date">${xDays[0]}</p>
    <p class="x-axis-date">${xDays[1]}</p>
    <p class="x-axis-date">${xDays[2]}</p>
    <p class="x-axis-date">${xDays[3]}</p>
    <p class="x-axis-date">${xDays[4]}</p>`;
    } else if (e.target == periodTabs[1]) {
      xData.innerHTML = `
        <p class="x-axis-date">${xWeeks[0]}</p>
    <p class="x-axis-date">${xWeeks[1]}</p>
    <p class="x-axis-date">${xWeeks[2]}</p>
    <p class="x-axis-date">${xWeeks[3]}</p>
    <p class="x-axis-date">${xWeeks[4]}</p>`;
    } else if (e.target == periodTabs[2]) {
      xData.innerHTML = `
        <p class="x-axis-date">${xMonths[0]}</p>
    <p class="x-axis-date">${xMonths[1]}</p>
    <p class="x-axis-date">${xMonths[2]}</p>
    <p class="x-axis-date">${xMonths[3]}</p>
    <p class="x-axis-date">${xMonths[4]}</p>`;
    } else if (e.target == periodTabs[3]) {
      xData.innerHTML = `
        <p class="x-axis-date">${x3Months[0]}</p>
    <p class="x-axis-date">${x3Months[1]}</p>
    <p class="x-axis-date">${x3Months[2]}</p>
    <p class="x-axis-date">${x3Months[3]}</p>
    <p class="x-axis-date">${x3Months[4]}</p>`;
    } else if (e.target == periodTabs[4]) {
      xData.innerHTML = `
        <p class="x-axis-date">${xYears[0]}</p>
    <p class="x-axis-date">${xYears[1]}</p>
    <p class="x-axis-date">${xYears[2]}</p>
    <p class="x-axis-date">${xYears[3]}</p>
    <p class="x-axis-date">${xYears[4]}</p>`;
    } else if (e.target == periodTabs[5]) {
      xData.innerHTML = `
        <p class="x-axis-date">${x5Years[0]}</p>
    <p class="x-axis-date">${x5Years[1]}</p>
    <p class="x-axis-date">${x5Years[2]}</p>
    <p class="x-axis-date">${x5Years[3]}</p>
    <p class="x-axis-date">${x5Years[4]}</p>`;
    }
  });
});

// === clear log ===

const clearBtn = document.querySelector("#clear-btn");
const logList = document.querySelector(".log__card");
const logEmpty = document.querySelector(".log__empty-wrapper");
const loggedNumber = document.querySelector(".compare__logged");

clearBtn.addEventListener("click", () => {
  logList.innerHTML = "";
  loggedNumber.innerHTML = "0 Logged";
  show(logEmpty);
  flex(logEmpty);
});

// === remove fav ===

const favStars = document.querySelectorAll(".fav__star");
const favCards = document.querySelectorAll(".fav__card");
const favNumbers = document.querySelector(".fav__pairs");
const favEmpty = document.querySelector(".fav__empty-wrapper");

favStars.forEach((star, index) => {
  star.addEventListener("click", () => {
    favCards[index].style.display = "none";
  });
});

// --- 📌restart from empty message ---
