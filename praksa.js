const URL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/";
const POINT_ID = 0;
const GROUP_ID = 1;
const COUNTIES_ID = 2;
const STATES_ID = 3;
const LAYERS = 4;

let expression;
let selectedLayerId;

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("esri.map");
var map;

function init() {
    require(["esri/layers/FeatureLayer", "dojo/on", "dojo/_base/lang", "esri/InfoTemplate"], function(FeatureLayer, on, lang, InfoTemplate) {

        const blockPointLayerToggle = document.getElementById("blockPoints");
        const blockGroupToggle = document.getElementById("blockGroup");
        const countiesToggle = document.getElementById("counties");
        const stateToggle = document.getElementById("state");
        const basemapToggle = document.getElementById("basemap");

        const selectedPointFilter = document.getElementById("filterPoints");
        const filterPoints = document.getElementById("filterPoint_btn");
        const filterGroup = document.getElementById("filterGroup_btn");
        const selectedCountieFilter = document.getElementById("filterCounties");
        const filterCounties = document.getElementById("filterCounties_btn");
        const filterState = document.getElementById("filterState_btn");

        const searchPoint = document.getElementById("searchPoint_btn");
        const selectedPointSearch = document.getElementById("searchPoints");
        const searchGroup = document.getElementById("searchGroup_btn");
        const selectedCountieSearch = document.getElementById("searchCounties");
        const searchCounties = document.getElementById("searchCountie_btn");
        const serachState = document.getElementById("searchState_btn");

        const refreshPoints = document.getElementById("refreshPoints");
        const refreshGroup = document.getElementById("refreshGroup");
        const refreshCounties = document.getElementById("refreshCounties");
        const refreshStates = document.getElementById("refreshStates");

        const searchTable = document.getElementById("searchTable");

        map = new esri.Map("map", {
            basemap: "topo-vector",
            center: [-96.571671, 39.183609],
            zoom: 13
        });

        var layers = [];
        for (let i = 0; i < LAYERS; i++) {
            let layer = new FeatureLayer(URL + i, {
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"]
            });
            layers.push(layer);
        }

        map.addLayers(layers);
        on.once(map, 'layers-add-result', lang.hitch(this, function(results) {
            function getLayer(layerIndex) {
                let index = "graphicsLayer" + layerIndex;
                return map._layers[index];
            }

            var popupPoint = { title: "HOUSEHOLDS: ${HOUSEHOLDS}", content: "${OBJECTID}: STATE_FIPS: ${STATE_FIPS}" }
            getLayer(POINT_ID).infoTemplate = new InfoTemplate(popupPoint)

            var popupGroup = { title: "STATE_FIPS: ${STATE_FIPS}", content: " ${OBJECTID}: Number of females population is ${FEMALES}, number of population between 29 to 29 is ${AGE_22_29}" }
            getLayer(GROUP_ID).infoTemplate = new InfoTemplate(popupGroup)

            var popupCounties = { title: "NAME: ${NAME}", content: "${OBJECTID}: STATE NAME: ${STATE_NAME}, CITY_FIPS: ${CNTY_FIPS}" }
            getLayer(COUNTIES_ID).infoTemplate = new InfoTemplate(popupCounties)

            var popupStates = { title: "STATE NAME: ${STATE_NAME}, STATE_FIPS: ${STATE_FIPS}", content: "${OBJECTID}: SUB REGION: ${SUB_REGION}, STATE ABBR: ${STATE_ABBR}" }
            getLayer(STATES_ID).infoTemplate = new InfoTemplate(popupStates)

            blockPointLayerToggle.addEventListener("change", function() {
                getLayer(POINT_ID).setVisibility(blockPointLayerToggle.checked);
            });
            blockGroupToggle.addEventListener("change", function() {
                getLayer(GROUP_ID).setVisibility(blockGroupToggle.checked);
            });
            countiesToggle.addEventListener("change", function() {
                getLayer(COUNTIES_ID).setVisibility(countiesToggle.checked);
            });
            stateToggle.addEventListener("change", function() {
                getLayer(STATES_ID).setVisibility(stateToggle.checked);
            });
            basemapToggle.addEventListener("change", function() {
                if (!basemapToggle.checked) {
                    map._layers["layer4"].setVisibility(basemapToggle.checked);
                    map._layers["layer5"].setVisibility(basemapToggle.checked);
                } else {
                    map._layers["layer4"].setVisibility(basemapToggle.checked);
                    map._layers["layer5"].setVisibility(basemapToggle.checked);
                }
            });


            //FILTER
            selectedPointFilter.addEventListener("change", function() {
                const input = document.getElementById("pointValue1");
                if (selectedPointFilter.value == "STATE_FIPS") {
                    input.type = "number";
                } else {
                    input.type = "text";
                }
            });
            filterPoints.addEventListener("click", function() {
                const operator = document.getElementById("pointOperators1").value;
                const pointValue1 = document.getElementById("pointValue1").value;

                if (selectedPointFilter.value == "STATE_FIPS") {
                    if (operator == "less") {
                        expression = selectedPointFilter.value + " " + "<" + " '" + pointValue1 + "'";
                    } else {
                        expression = selectedPointFilter.value + " " + operator + " '" + pointValue1 + "'";
                    }
                } else {
                    if (operator == "less") {
                        expression = selectedPointFilter.value + " " + "<" + " " + pointValue1;
                    } else {
                        expression = selectedPointFilter.value + " " + operator + " " + pointValue1;
                    }
                }

                getLayer(POINT_ID).setDefinitionExpression(expression);
            });

            filterGroup.addEventListener("click", function() {
                const filter = document.getElementById("filterGroup").value;
                const operator = document.getElementById("groupOperators1").value;
                const groupValue = document.getElementById("groupValue1").value;

                if (operator == "less") {
                    expression = filter + " " + "<" + " " + groupValue;
                } else {
                    expression = filter + " " + operator + " " + groupValue;
                }

                getLayer(GROUP_ID).setDefinitionExpression(expression);
            });

            selectedCountieFilter.addEventListener("change", function() {
                const input = document.getElementById("countieValue1");
                const operators = document.getElementById("countieOperators1");
                if (selectedCountieFilter.value == "CNTY_FIPS") {
                    input.type = "number";
                    removeOperator(operators);
                    addOperator(operators);
                } else {
                    input.type = "text";
                    removeOperator(operators);
                    addOperator2(operators);
                }
            });

            filterCounties.addEventListener("click", function() {
                const operator = document.getElementById("countieOperators1").value;
                const countieValue = document.getElementById("countieValue1").value;

                if (selectedCountieFilter.value == "CNTY_FIPS") {
                    if (operator == "less") {
                        expression = selectedCountieFilter.value + " " + "<" + " '" + countieValue + "'";
                    } else {
                        expression = selectedCountieFilter.value + " " + operator + " '" + countieValue + "'";
                    }
                } else {
                    expression = "Upper(" + selectedCountieSearch.value + ") " + operator + " Upper('" + countieValue + "')";
                }

                getLayer(COUNTIES_ID).setDefinitionExpression(expression);
            });

            filterState.addEventListener("click", function() {
                const filter = document.getElementById("filterStates").value;
                const operator = document.getElementById("stateOperators1").value;
                const stateValue = document.getElementById("stateValue1").value;

                if (operator == 1) {
                    expression = "Upper(" + filter + ") LIKE Upper('" + stateValue + "%')";
                } else if (operator == 2) {
                    expression = "Upper(" + filter + ") LIKE Upper('%" + stateValue + "%')";
                } else {
                    expression = "Upper(" + filter + ") " + operator + " Upper('" + stateValue + "')";
                }

                getLayer(STATES_ID).setDefinitionExpression(expression);
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

            function addOperator2(operators) {
                if (operators.length == 1) {
                    var option1 = document.createElement("option");
                    option1.value = "1";
                    option1.innerHTML = "start with";
                    operators.appendChild(option1);

                    var option2 = document.createElement("option");
                    option2.value = "2";
                    option2.innerHTML = "contain";
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
                getLayer(POINT_ID).setDefinitionExpression("");
            });
            refreshGroup.addEventListener("click", function() {
                getLayer(GROUP_ID).setDefinitionExpression("");
            });
            refreshCounties.addEventListener("click", function() {
                getLayer(COUNTIES_ID).setDefinitionExpression("");
            });
            refreshStates.addEventListener("click", function() {
                getLayer(STATES_ID).setDefinitionExpression("");
            });

            selectedPointSearch.addEventListener("change", function() {
                const input = document.getElementById("pointValue2");
                if (selectedPointSearch.value == "STATE_FIPS") {
                    input.type = "number";
                } else {
                    input.type = "text";
                }
            });
            //SEARCH
            searchPoint.addEventListener("click", function() {
                const operator = document.getElementById("pointOperators2").value;
                const pointValue2 = document.getElementById("pointValue2").value;

                if (selectedPointSearch.value == "STATE_FIPS") {
                    if (operator == "less") {
                        expression = selectedPointSearch.value + " " + "<" + " '" + pointValue2 + "'";
                    } else {
                        expression = selectedPointSearch.value + " " + operator + " '" + pointValue2 + "'";
                    }
                } else {
                    if (operator == "less") {
                        expression = selectedPointSearch.value + " " + "<" + " " + pointValue2;
                    } else {
                        expression = selectedPointSearch.value + " " + operator + " " + pointValue2;
                    }
                }

                queryFeatureLayer(POINT_ID);
            });

            searchGroup.addEventListener("click", function() {
                const search = document.getElementById("searchGroup").value;
                const operator = document.getElementById("groupOperators2").value;
                const groupValue = document.getElementById("groupValue2").value;

                if (operator == "less") {
                    expression = search + " " + "<" + " " + groupValue;
                } else {
                    expression = search + " " + operator + " " + groupValue;
                }

                queryFeatureLayer(GROUP_ID);
            });

            selectedCountieSearch.addEventListener("change", function() {
                const input = document.getElementById("countieValue2");
                const operators = document.getElementById("countieOperators2");
                if (selectedCountieSearch.value == "CNTY_FIPS") {
                    input.type = "number";
                    removeOperator(operators);
                    addOperator(operators);
                } else {
                    input.type = "text";
                    removeOperator(operators);
                    addOperator2(operators);
                }
            });

            searchCounties.addEventListener("click", function() {
                const operator = document.getElementById("countieOperators2").value;
                const countieValue = document.getElementById("countieValue2").value;

                if (selectedCountieSearch.value == "CNTY_FIPS") {
                    if (operator == "less") {
                        expression = selectedCountieSearch.value + " " + "<" + " '" + countieValue + "'";
                    } else {
                        expression = selectedCountieSearch.value + " " + operator + " '" + countieValue + "'";
                    }
                } else {
                    if (operator == 1) {
                        expression = "Upper(" + selectedCountieSearch.value + ") LIKE Upper('" + countieValue + "%')";
                    } else if (operator == 2) {
                        expression = "Upper(" + selectedCountieSearch.value + ") LIKE Upper('%" + countieValue + "%')";
                    } else {
                        expression = "Upper(" + selectedCountieSearch.value + ") " + operator + " Upper('" + countieValue + "')";
                    }
                }

                queryFeatureLayer(COUNTIES_ID);
            });

            serachState.addEventListener("click", function() {
                const search = document.getElementById("searchState").value;
                const operator = document.getElementById("stateOperators2").value;
                const stateValue = document.getElementById("stateValue2").value;

                if (operator == 1) {
                    expression = "Upper(" + search + ") LIKE Upper('" + stateValue + "%')";
                } else if (operator == 2) {
                    expression = "Upper(" + search + ") LIKE Upper('%" + stateValue + "%')";
                } else {
                    expression = "Upper(" + search + ") " + operator + " Upper('" + stateValue + "')";
                }

                queryFeatureLayer(STATES_ID);
            });

            function queryFeatureLayer(index) {
                selectedLayerId = index;
                var queryTask = new esri.tasks.QueryTask(URL + index);
                var query = new esri.tasks.Query();
                query.where = expression;
                query.returnGeometry = true;
                query.outFields = ["*"];
                queryTask.execute(query, handleQuery);
            }

            function handleQuery(result) {
                var table;
                if (searchTable.childElementCount < 1) {
                    table = document.createElement("table");
                    table.classList.add("searchTable");
                    table.setAttribute("id", "featureTable");;
                } else {
                    table = document.getElementById("featureTable");
                    table.innerHTML = '';
                }

                const tr1 = document.createElement("tr");
                const th1 = document.createElement("th");
                tr1.appendChild(th1);
                for (let i = 0; i < result.fields.length; i++) {
                    const field = document.createElement("th");
                    field.innerText = result.fields[i].name;
                    tr1.appendChild(field);
                    table.appendChild(tr1);
                }

                for (let i = 0; i < result.features.length; i++) {
                    const tr3 = document.createElement("tr");
                    createSearchButton(tr3, result.features[i].attributes["OBJECTID"]);
                    for (let j = 0; j < result.fields.length; j++) {
                        const value = document.createElement("td");
                        value.innerText = result.features[i].attributes[result.fields[j].name];
                        tr3.appendChild(value);
                        table.appendChild(tr3);
                    }
                }

                searchTable.appendChild(table);
            }

            function createSearchButton(tr3, objectId) {
                const tdImage = document.createElement("td");
                const button = document.createElement("button");
                button.setAttribute("class", "btn");
                button.setAttribute("id", objectId);
                button.addEventListener("click", function() {
                    for (let i = 0; i < LAYERS; i++) {
                        getLayer(i).clearSelection();
                    }
                    let query = new esri.tasks.Query();
                    query.objectIds = [objectId];
                    getLayer(selectedLayerId).selectFeatures(query, selectedLayerId, function(features) {
                        let stateExtent;
                        let highlightSymbol;
                        /*if (features[0].geometry.type === "point") {
                            stateExtent = new esri.geometry.Extent({
                                "xmin": features[0].geometry.x - 250,
                                "ymin": features[0].geometry.y - 250,
                                "xmax": features[0].geometry.x + 250,
                                "ymax": features[0].geometry.y + 250,
                                "spatialReference": map.spatialReference
                            });
                            highlightSymbol = new esri.symbol.SimpleMarkerSymbol().setColor(new dojo.Color([255, 0, 0]));
                            getLayer(selectedLayerId).setSelectionSymbol(highlightSymbol);
                        } else {
                            stateExtent = features[0].geometry.getExtent();
                            highlightSymbol = new esri.symbol.SimpleFillSymbol().setColor(esri.symbol.SimpleFillSymbol.STYLE_NULL,
                                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                    new esri.Color([255, 0, 0]), 2), new esri.Color([255, 0, 0, 0.25]));
                            getLayer(selectedLayerId).setSelectionSymbol(highlightSymbol);
                        }*/
                        switch (features[0].geometry.type) {
                            case "point":
                                stateExtent = new esri.geometry.Extent({
                                    "xmin": features[0].geometry.x - 250,
                                    "ymin": features[0].geometry.y - 250,
                                    "xmax": features[0].geometry.x + 250,
                                    "ymax": features[0].geometry.y + 250,
                                    "spatialReference": map.spatialReference
                                });
                                var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 0, 0]), 2);
                                var sms = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, sls, new esri.Color([255, 0, 0, 0.25]));
                                getLayer(selectedLayerId).setSelectionSymbol(sms);
                                break;
                            case "polyline":
                                stateExtent = features[0].geometry.getExtent();
                                var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 0, 0, 0.25]), 2);
                                getLayer(selectedLayerId).setSelectionSymbol(sls);
                                break;
                            case "polygon":
                                stateExtent = features[0].geometry.getExtent();
                                var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 0, 0]), 2);
                                var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL, sls, new esri.Color([255, 0, 0, 0.25]));
                                getLayer(selectedLayerId).setSelectionSymbol(sfs);
                                break;
                        }

                        map.setExtent(stateExtent);
                    });
                });
                const icon = document.createElement("i");
                icon.setAttribute("class", "fa fa-search");
                button.appendChild(icon);
                tdImage.appendChild(button);
                tr3.appendChild(tdImage);
            }
        }))
    });
}
dojo.ready(init);