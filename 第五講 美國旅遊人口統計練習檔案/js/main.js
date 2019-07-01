// 是否第一次載入
let firstLoad = true;

// 定義地圖的寬度與高度
const width = d3.select('#map').node().clientWidth,
    height = width / 2;

// 設定地界投影
const projection = d3
    // 以美國地界投影
    // https://github.com/d3/d3-geo/blob/v1.11.3/README.md#geoAlbersUsa
    .geoAlbersUsa()
    // 設定位移
    .translate([width / 2, height / 2])
    // 設定縮放
    .scale([800]);

// 定義路徑產生器(path generator)
const usa = d3.geoPath()
    .projection(projection);

// const testData = {"type":"Feature","id":"01","properties":{"name":"Alabama"},"geometry":{"type":"Polygon","coordinates":[[[-87.359296,35.00118],[-85.606675,34.984749],[-85.431413,34.124869],[-85.184951,32.859696],[-85.069935,32.580372],[-84.960397,32.421541],[-85.004212,32.322956],[-84.889196,32.262709],[-85.058981,32.13674],[-85.053504,32.01077],[-85.141136,31.840985],[-85.042551,31.539753],[-85.113751,31.27686],[-85.004212,31.003013],[-85.497137,30.997536],[-87.600282,30.997536],[-87.633143,30.86609],[-87.408589,30.674397],[-87.446927,30.510088],[-87.37025,30.427934],[-87.518128,30.280057],[-87.655051,30.247195],[-87.90699,30.411504],[-87.934375,30.657966],[-88.011052,30.685351],[-88.10416,30.499135],[-88.137022,30.318396],[-88.394438,30.367688],[-88.471115,31.895754],[-88.241084,33.796253],[-88.098683,34.891641],[-88.202745,34.995703],[-87.359296,35.00118]]]}}
// console.log(usa(testData))

// 定義色彩列表
const colorScale = d3.scaleLinear()
    .domain([10000, 50000, 100000, 800000, 3000000, 5000000, 7000000, 9000000, 10000000, 15000000, 20000000, 25000000])
    .range(['#546E7A', '#B0BEC5', '#FFF076', '#FCE26A', '#F9D35F', '#F6C255', '#F3B04A', '#F19E40', '#EE8A36', '#EB752C', '#E86022', '#E64919'])
// console.log(colorScale(10000))

// 渲染畫面流程
function renderMap(data) {
    console.log(data);
    const svgContainer = d3.select('#map');
    let svg;
    //第一次開地圖
    if (firstLoad) {
        //放入svg
        svg = svgContainer
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)

        svg.selectAll('.state')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'state')
            .attr('d', function(d) {
            console.log(usa(d));
            //回傳產生地界形狀所需要的d的值
            return usa(d);
        })
        .attr('fill', function(d) {
            // console.log(d);
            const visited = d.properties.visited;
            return colorScale(visited);
        })
        .on('mousemove', function(d) {
            console.log(d)
            d3
            .select('#labelGroup')
            .html(
                `
                <h1>
                    <i class="fas fa-map-marker-alt fa-fw"></i>
                    ${d.properties.name}
                    <br>
                    <i class="fas fa-male fa-fw"></i>
                    <span class="badge badge-primary">
                    ${d.properties.visited}
                    </span>
                </h1>
                `
            )
        });
    } else {
        //第n次
        svgContainer.selectAll('.state')
        .data(data)
        .attr('fill', function(d) {
            const visited = d.properties.visited;
            return colorScale(visited);
        })

    }
    // const svg = d3.select('#map')
    //     .append('svg')
    //     .append('width', '100%')
    //     .append('height', '100%')
    //     .append('viewbox', `0 0 ${width} ${height}`)
    firstLoad = false;

}

// 定義圖表所需資料
let chartData = [];

// 載入真實資料
function loadData() {
    //引用載入州界的資訊
    d3.json('us-states-map.json')
    .then(states => {
        states = states.features
        //載入旅遊數據
        d3.csv('source.csv')
        .then(data => {
            // console.log('states: ', states);
            // console.log('data: ', data);
            data.forEach(d => {
                // console.log('d: ', d);
                const idx = states.findIndex(state => {
                    return state.properties.name === d.state
                });
                // console.log('idx: ', idx);
                states[idx].properties.visited = +d.visited
            });
            // console.log('states: ', states);
            //設定圖表所需要的資料
            chartData = states
            //渲染圖表
            renderMap(chartData);
        })
    })
}

// 產生隨機數
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 放置隨機資料
function randomSeed() {
    chartData.forEach(d => {
        d.properties.visited = randomIntFromInterval(1000, 10000000)
    });
    //渲染圖表

}

// 將所有資料歸零
function setZero() {
    chartData.forEach(d => {
        d.properties.visited = 0;
    });
    //渲染圖表
    renderMap(chartData);
}

// 將所有資料+1000000
function increase() {

}

// 將所有資料-1000000
function decrease() {

}