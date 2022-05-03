mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [-97.51185189224819, 45.09168313878067], // starting position [lng, lat]
            projection: {
                name: 'albers',
                center: [-97.51185189224819, 45.09168313878067]
            },
            zoom: 3 // starting zoom
        }); 

        map.on('load', () => {
            map.addSource('covidrates', {
                type: 'geojson',
                data: 'assets/us-covid-2020-rates.json'
            });

            map.addLayer({
                'id': 'rates-layer',
                'type': 'fill',
                'source': 'covidrates',
                'paint': {
                    'fill-color': [
                        'step',
                        ['get', 'rates'],
                        '#FFEDA0',   // use color #FFEDA0
                        5,           // if density < 5
                        '#FED976',   // use color #FED976
                        10,          // if 5 <= density < 10
                        '#FEB24C',   // use color #FEB24C
                        20,          // if 10 <= density < 20
                        '#FD8D3C',   // use color #FD8D3C
                        40,          // if 20 <= density < 40
                        '#FC4E2A',   // use color #FC4E2A
                        60,          // if 40 <= density < 60
                        '#E31A1C',   // use color #E31A1C
                        80,          // if 60 <= density < 80
                        '#BD0026',   // use color #BD0026
                        100,         // if 80 <= density < 100
                        "#800026"    // use color #800026 if 100 <= density
                    ],
                    'fill-outline-color': '#BBBBBB',
                    'fill-opacity': 0.7,
                },
            }); 

            const layers = [
                '0-4',
                '5-9',
                '10-19',
                '20-39',
                '40-59',
                '60-79',
                '80-99',
                '100 or More'
            ];
            const colors = [
                '#FFEDA070',
                '#FED97670',
                '#FEB24C70',
                '#FD8D3C70',
                '#FC4E2A70',
                '#E31A1C70',
                '#BD002670',
                '#80002670'
            ];

            const legend = document.getElementById('legend');
            legend.innerHTML = "<b>Covid Case Rates<br>(percentage %)</b><br><br>"

            layers.forEach((layer, i) => {
                const color = colors[i];
                const item = document.createElement('div');
                const key = document.createElement('span');
                key.className = 'legend-key';
                key.style.backgroundColor = color;

                const value = document.createElement('span');
                value.innerHTML = `${layer}`;
                item.appendChild(key);
                item.appendChild(value);
                legend.appendChild(item);
            });

            map.on('mousemove', ({point}) => {
                const state = map.queryRenderedFeatures(point, {
                    layers: ['rates-layer']
                });
                document.getElementById('text-escription').innerHTML = state.length ?
                    `<h3><strong>County: </strong>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.rates}</strong>%</em></p>` :
                    `<p>Hover Over a County!</p>`;
            });
        });

        const source =
        '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a></p>';
        legend.innerHTML = value.join(' ') + source;