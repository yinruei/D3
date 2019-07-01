const width = 500,
    height = 500;


// 在圖表容器裡面放入svg圖形
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// //建立y軸比例尺
// const y = d3.scaleLinear()
//     //原始的資料範圍-填入資料的最小數字雨最大數字
//     .domain([0, 21000])//最小值是資料的最小值還是0?
//     //圖表顯示的大小範圍
//     .range([0, height])


// 在svg放入一個group
// g就是group
const group = svg.append('g')

// 讀取csv
const csv = d3
    .csv('source.csv')
// console.log(csv);//javascript Promise物件 還在執行中還沒有給你回覆，是一個非同步的行為
    //當成功讀取檔案之後
    .then(function(data) {
        // console.log(data)
        data.forEach(function(d) {
            //把sale的值轉為數字
            d.sale = parseFloat(d.sale)//parse成浮點數
        });
        // console.log(data);

        //計算出最高的sale
        const maxSale = d3.max(data, function(d) {
            //回傳需要比對大小的屬性
            return d.sale;
        });
        // console.log('maxSale', maxSale);

        //建立y軸比例尺
        const y = d3.scaleLinear()
            //傳入原始資料最小值與最大值
            .domain([0, maxSale])
            //定義顯示時最小與最大的像素
            .range([0, height]);

        // console.log(y(21000))
        // console.log(y(10000))
        // console.log(y(10500))
        // console.log(y(5000))

        //定義長條的群組，並且傳遞資料  rect是標籤
        const bars = group
            .selectAll('rect')
            .data(data)

        //繪製長條的圖形
        bars.enter()
            .append('rect')
            .attr('x', function(d, i) {
                return i * 30;
            })
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', function(d) {
                // console.log(d)//d是物件
                return d.sale;
            })

    });

//         // 定義長條的群組，並且傳遞資料
//         const bars = group.selectAll('rect').data(data);

//         //產生labels，以資料的name作為labels
//         const labels = data.map(function(d) {
//             return d.name;
//         })
//         console.log(labels)

//         //建立x軸的資料對應
//         const x = d3.scaleBand()
//             .domain(labels)
//             .range([0, width])

//         //繪製長條的圖形
//         bars.enter()
//             .append('rect')
//             .attr('x', function(d) {
//                 return x(d.name);
//             }
//             .attr('y', 0)
//             // .attr('width', 20)
//             .attr('width', x.bandwidth)
//             // .attr('height', function(d) {
//             //     return d.sale;
//             .attr('height', function(d) {
//                 // 顯示在畫面的高度將依據比例而決定
//                 return y(d.sale);
//             })


//     });
// console.log(csv);



/*
const data = [10, 5, 6, 7, 15];
//將group內的rect標籤對應到data內的資料
//如果現在想要將group放入一推圖形
const bars = group.selectAll('rect').data(data);
bars.enter()
    .append('rect')
    .attr('width', 10)
    .attr('height', function(d) {
        return d * 10;
    })
    .attr('y', 20)
    .attr('x', function(d, i) {
        return i * 20
    })
*/


