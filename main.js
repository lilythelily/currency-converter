"use strict";

// === fetch data ===

async function fetchData() {
  const url = "https://api.frankfurter.dev/v2/currencies";
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("failed to fetch data");
    }
    const data = await res.json();
    console.log(data);

    // === dynamically insert data into dropdown ===

    // const targetCurrencies = {
    //   ae: data[0],
    //   ar: data[6],
    //   au: data[7],
    //   bd: data[116],
    //   bg: data[12],
    //   bh: data[13],
    //   br: data[18],
    //   ca: data[24],
    //   ch:data[26],
    //   cl: data[27],
    //   cn: data[29],
    //   co: data[30],
    //   cy: data[29],
    //   cz: data[34],
    //   dk: data[36],
    //   eg: data[39],
    //   eu: data[42],
    //   gb: data[45],
    //   hk: data[54],
    //   hm: data[55],
    //   hn: data[55],
    //   hr: data[57],
    //   ht: data[56],
    //   hu: data[57],
    //   id: data[58],
    //   in: data[61],
    //   is: data[64],
    //   jo: data[67],
    //   jp: data[68],
    //   ke: data[69],
    //   kr: data[74],
    //   kw: data[75],
    //   lb: data[79],
    //   lc: data[78],
    //   lk: data[80],
    //   ma: data[84],
    //   mx: data[96],
    //   my: data[97],
    //   ng: data[100],
    //   no: data[102],
    //   np: data[103],
    //   nz: data[104],
    //   om: data[105],
    //   pe: data[107],
    //   ph: data[109],
    //   pk: data[110],
    //   pl: data[111],
    //   qa: data[113],
    //   ro: data[114],
    //   ru: data[116],
    //   sa: data[118],
    //   se: data[122],
    //   sg: data[123],
    //   th: data[133],
    //   tr: data[138],
    //   tw: data[140],
    //   ua: data[142],
    //   us: data[144],
    //   vn: data[148],
    //   za: data[162],
    // };
      
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
   


    const otherList = document.querySelector(".other-dropdown");

      otherList.innerHTML = Object.entries(targetCurrencies).map(({ iso_code, name }) => {
        

        return `<li><div class="flag-small">
            <div class="currency-flag currency-flag2"
style = "background-image: url('./assets/images/flags/au.webp')

           "
            ></div>${iso_code}<p class="currency-small">${name}</p></div>
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
