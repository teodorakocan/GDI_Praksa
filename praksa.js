const URL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/";
const POINT_ID = 0;
const GROUP_ID = 1;
const COUNTIES_ID = 2;
const STATES_ID = 3;
const LAYERS = 4;

let layers = [];
let expression;

require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/symbols/SimpleMarkerSymbol"], function(Map, MapView, FeatureLayer, SimpleMarkerSymbol) {
    const blockPointLayerToggle = document.getElementById("blockPoints");
    const blockGroupToggle = document.getElementById("blockGroup");
    const countiesToggle = document.getElementById("counties");
    const basemapToggle = document.getElementById("basemap");
    const stateToggle = document.getElementById("state");

    const selectedPointFilter = document.getElementById("points");
    const filterPoints = document.getElementById("btn_point");
    const filterGroup = document.getElementById("btn_group");
    const selectedCountieFilter = document.getElementById("countiesID");
    const filterCounties = document.getElementById("btn_counties");
    const filterState = document.getElementById("btn_state");

    const refreshPoints = document.getElementById("refreshPoints");
    const refreshGroup = document.getElementById("refreshGroup");
    const refreshCounties = document.getElementById("refreshCounties");
    const refreshStates = document.getElementById("refreshStates");

    const map = new Map({
        basemap: "topo-vector"
    });
    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-96.571671, 39.183609], //-95, 39, 37, 36
        zoom: 13 //4
    });

    for (let i = 0; i < LAYERS; i++) {
        let layer = new FeatureLayer({
            url: URL + i
        });
        map.add(layer);
        layers.push(layer);
    }

    layers[POINT_ID].outFields = ["HOUSEHOLDS", "STATE_FIPS"];
    layers[POINT_ID].popupTemplate = {
        title: "{HOUSEHOLDS}",
        content: "{STATE_FIPS}"
    }
    layers[GROUP_ID].outFields = ["FEMALES", "AGE_22_29", "STATE_FIPS"];
    layers[GROUP_ID].popupTemplate = {
        title: "{STATE_FIPS}",
        content: "Number of females population is {FEMALES}, number of population between 29 to 29 is {AGE_22_29}"
    }
    layers[COUNTIES_ID].outFields = ["NAME", "STATE_NAME", "CNTY_FIPS"];
    layers[COUNTIES_ID].popupTemplate = {
        title: "{NAME}",
        content: "{STATE_NAME}, {CNTY_FIPS}"
    }
    layers[STATES_ID].outFields = ["STATE_NAME", "STATE_FIPS", "SUB_REGION", "STATE_ABBR"];
    layers[STATES_ID].popupTemplate = {
        title: "{STATE_NAME}, {STATE_FIPS}",
        content: "{SUB_REGION}, {STATE_ABBR}"
    }

    blockPointLayerToggle.addEventListener("change", function() {
        layers[POINT_ID].visible = blockPointLayerToggle.checked;
    });
    blockGroupToggle.addEventListener("change", function() {
        layers[GROUP_ID].visible = blockGroupToggle.checked;
    });
    countiesToggle.addEventListener("change", function() {
        layers[COUNTIES_ID].visible = countiesToggle.checked;
    });
    stateToggle.addEventListener("change", function() {
        layers[STATES_ID].visible = stateToggle.checked;
    });
    basemapToggle.addEventListener("change", function() {
        if (!basemapToggle.checked) {
            map.basemap = "None";
        } else {
            map.basemap = "topo-vector";
        }
    });

    selectedPointFilter.addEventListener("change", function() {
        const input = document.getElementById("pointValue");
        if (selectedPointFilter.value == "STATE_FIPS") {
            input.type = "number";
        } else {
            input.type = "text";
        }
    });
    filterPoints.addEventListener("click", function() {
        const selectPoints = document.getElementById("points").value;
        const operator = document.getElementById("operators1").value;
        const pointValue = document.getElementById("pointValue").value;

        if (selectPoints == "STATE_FIPS") {
            if (operator == "less") {
                expression = selectPoints + " " + "<" + " '" + pointValue + "'";
            } else {
                expression = selectPoints + " " + operator + " '" + pointValue + "'";
            }
        } else {
            if (operator == "less") {
                expression = selectPoints + " " + "<" + " " + pointValue;
            } else {
                expression = selectPoints + " " + operator + " " + pointValue;
            }
        }

        layers[POINT_ID].definitionExpression = expression;
    });

    filterGroup.addEventListener("click", function() {
        const filter = document.getElementById("group").value;
        const operator = document.getElementById("operators2").value;
        const groupValue = document.getElementById("groupValue").value;

        if (operator == "less") {
            expression = filter + " " + "<" + " " + groupValue;
        } else {
            expression = filter + " " + operator + " " + groupValue;
        }

        layers[GROUP_ID].definitionExpression = expression;
    });

    selectedCountieFilter.addEventListener("change", function() {
        const input = document.getElementById("countieValue");
        const operators = document.getElementById("operators3");
        if (selectedCountieFilter.value == "CNTY_FIPS") {
            input.type = "number";
            addOperator(operators);
        } else {
            input.type = "text";
            removeOperator(operators);
        }
    });

    filterCounties.addEventListener("click", function() {
        const filter = document.getElementById("countiesID").value;
        const operator = document.getElementById("operators3").value;
        const countieValue = document.getElementById("countieValue").value;

        if (filter == "CNTY_FIPS") {
            if (operator == "less") {
                expression = filter + " " + "<" + " '" + countieValue + "'";
            } else {
                expression = filter + " " + operator + " '" + countieValue + "'";
            }
        } else {
            expression = filter + " " + operator + " '" + countieValue + "'";
        }

        layers[COUNTIES_ID].definitionExpression = expression;
    });

    filterState.addEventListener("click", function() {
        const filter = document.getElementById("states").value;
        const operator = document.getElementById("operators4").value;
        const stateValue = document.getElementById("stateValue").value;

        expression = filter + " " + operator + " '" + stateValue + "'";

        layers[STATES_ID].definitionExpression = expression;
    });

    function addOperator(operators) {
        if (operators.length == 1) {
            var option1 = document.createElement("option");
            option1.value = ">";
            option1.innerHTML = ">";
            operators.appendChild(option1);

            var option2 = document.createElement("option");
            option2.value = "<";
            option2.innerHTML = "<";
            operators.appendChild(option2);
        }
    }

    function removeOperator(operators) {
        if (operators.length > 1) {
            operators.remove(1);
            operators.remove(1);
        }
    }

    refreshPoints.addEventListener("click", function() {
        layers[POINT_ID].definitionExpression = "";
    });
    refreshGroup.addEventListener("click", function() {
        layers[GROUP_ID].definitionExpression = "";
    });
    refreshCounties.addEventListener("click", function() {
        layers[COUNTIES_ID].definitionExpression = "";
    });
    refreshStates.addEventListener("click", function() {
        layers[STATES_ID].definitionExpression = "";
    });
});