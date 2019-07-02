const width = 250,
    height = 400;


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

        //計算平均的sale
        const avgSale = data.reduce(function(num, d){
            console.log('num ', num)
            console.log('d ', d)
            return num + d.sale;
        }, 0) / data.length;
        console.log(avgSale)

        //計算出最高的sale
        const maxSale = d3.max(data, function(d) {
            //回傳需要比對大小的屬性
            return d.sale;
        });
        // console.log('maxSale', maxSale);

        //對應labels
        const labels = data.map(function (d) {
            return d.name;
        });
        // console.log(labels)

        //建立x軸的對應
        const x = d3.scaleBand()
            //傳入原始資料需要對照的key
            .domain(labels)
            //顯示最大與最小的值
            .range([0, width])
            //每一個bar的留白比例多少
            .paddingInner(0.1)
            //bars左右留白比例
            .paddingOuter(0)
        
        // 顯示寬度 width / 資料長度 - 留白
        // console.log(x.bandwidth())

        // console.log({
        //     //Linda長條圖x的位移
        //     Linda: x('Linda'),
        //     David: x('David'),
        //     Andrew: x('Andrew'),
        //     Josh: x('Josh')
        // })



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
                // return i * 30;
                return x(d.name);
            })
            .attr('y', 0)
            // .attr('width', 20)
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                // console.log(d)//d是物件
                // return d.sale;
                return y(d.sale);
            })
            .attr('fill', function(d) {
                if (d.sale >= avgSale) {
                    return '#30c39e'
                } else {
                    return '#fd5c63'
                }
            })

    });

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


