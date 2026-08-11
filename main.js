"use strict";

// === fetch data ===

async function fetchData() {
  const url = "https://api.frankfurter.dev/v2/currencies";
  const url02 = "https://api.frankfurter.dev/v2/rates?base=USD";

  function getYesterdayDate() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }
  const yesterday = getYesterdayDate();
  const urlYesterday = `https://api.frankfurter.dev/v2/rates?base=USD&date=${yesterday}`;

  try {
    const res = await fetch(url);
    const res2 = await fetch(url02);
    const res3 = await fetch(urlYesterday);
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

        return `<li><div class="flag-small">
            <div class="currency-flag currency-flag2"
style = "background-image: url('./assets/images/flags/${flagCode}.webp')

           "
            ></div>${code}<p class="currency-small">${currencyInfo.name}</p></div>
            <div class="currecy-check"></div></li>`;
      })
      .join("");

    otherList.innerHTML = Object.entries(targetCurrencies)
      .map(([code, flagCode]) => {
        const currencyInfo = currencyByCode[code];
        if (!currencyInfo) return "";

        return `<li><div class="flag-small">
            <div class="currency-flag currency-flag2"
style = "background-image: url('./assets/images/flags/${flagCode}.webp')

           "
            ></div>${code}<p class="currency-small">${currencyInfo.name}</p></div>
            <div class="currecy-check"></div></li>`;
      })
      .join("");
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
