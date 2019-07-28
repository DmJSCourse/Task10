var savedCountries = null;

function buildTable(countries, newValue, sortedBy, highlighted) {
    let htmlCode = '<table class="table"><thead><tr><th>#</th><th>название страны</th><th>столица</th><th>населениe</th><th>площадь</th><th>валюты</th><th>языки</th><th>флаг</th><th>граничит с</th></tr></thead><tbody>';

    var stringified = JSON.stringify(countries);
    stringified = stringified.replace("Å", "A");
    countries = JSON.parse(stringified);

    if (sortedBy != undefined) {
        countries = sortCountries(countries, sortedBy);
    }

    for (let index in countries) {
        let element = countries[index];
        if (newValue && element.name !== newValue) {
            continue;
        }
        htmlCode += `<tr><td>${+index + 1}</td><td>${element.name}</td><td>${element.capital}</td><td>${element.population}</td><td>${element.area}</td><td>`;
        let currencies = element.currencies.map((item) => {
            return item.name;
        });
        htmlCode += `${currencies.join(', ')}</td><td>`;

        let languages = element.languages.map((item) => {
            return item.name;
        });
        htmlCode += `${languages.join(', ')}</td><td><img src="${element.flag}"></td><td>`;
        let borderNames = [];
        for (let borderItem of element.borders) {
            for (let searchArray in countries) {
                if (countries[searchArray].alpha3Code === borderItem) {
                    borderNames.push(countries[searchArray].name);
                }
            }
        }

        htmlCode += `${borderNames.join(', ')}</td></tr>`;
    }
    htmlCode += '</tbody></table>';


    let countriesNames = countries.map((el) => {
        return el.name;
    });

    if (!newValue) {
        $("#tags").autocomplete({
            source: countriesNames,
            select: function (event, ui) {
                buildTable(countries, ui.item.value);
            }
        });
    }

    $('.htmlTable').html(htmlCode);

    $('th').eq( highlighted ).addClass("highlight");
}

$(document).ready(() => {
    $('.ui-widget').hide();

    $('.btn').click(() => {
        $.ajax({
            url: "https://restcountries.eu/rest/v2/all"
        }).done((data) => {
            $("#tags").val();
            $('.ui-widget').show();
            $('.btn').hide();
            savedCountries = data;
            buildTable(data);
        });
    });
});


$(document).on('click', 'th', function (clickedData) {
    let selector = $(this).prop('outerHTML');
    let toHighlight = $(this).index();
    if (selector === '<th>название страны</th>') {
        let pass = "name";
        buildTable(savedCountries, null, pass, toHighlight);
    } else if (selector === '<th>населениe</th>') {
        let pass = "population";
        buildTable(savedCountries, null, pass, toHighlight);
    } else if (selector === '<th>площадь</th>') {
        let pass = "area";
        buildTable(savedCountries, null, pass, toHighlight);
    }
});

function sortCountries(countries, parameter) {
    return countries.sort(function (first, second) {
        var x = first[parameter]; var y = second[parameter];
        if (parameter === "name"){ return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        else { return ((x < y) ? 1 : ((x > y) ? -1 : 0)); }
    });
}
