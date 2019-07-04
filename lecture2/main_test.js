//svg的大小
const svgWidth = 500,
    svgHeight = 500;

//圖表的留白
const padding = {
    top: 20,
    bottom: 20,
    left: 60,
    right: 20
}


//圖表group的大小
const width = svgWidth - padding.left - padding.right,
    height = svgHeight - padding.top - padding.bottom;


// 在圖表容器裡面放入svg圖形
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// 在svg放入一個group
// g就是group
const group = svg.append('g')
    //讓圖表區位移
    .attr('transform', `translate(${padding.left}, ${padding.top})`)

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

        // 描述需要顯示x軸
        const xAxis = d3.axisBottom(x);
        //把x軸放到svg
        // svg.append('g')
        //     //把軸心的內容放上去
        //     .call(xAxis)
        //     .attr('transform', `translate(${padding.left}, ${height + padding.top})`)

        group.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${height})`);

        //建立y軸比例尺
        const y = d3.scaleLinear()
            //傳入原始資料最小值與最大值
            .domain([0, maxSale])
            //定義顯示時最小與最大的像素
            // .range([0, height]);
            .range([height, 0]);

        // console.log(y(21000))
        // console.log(y(10000))
        // console.log(y(10500))
        // console.log(y(5000))

        //定義要顯示的y軸
        const yAxis = d3.axisLeft(y);
        //把y軸放置到畫面上
        group.append('g')
            .call(yAxis);

        //定義長條的群組，並且傳遞資料  rect是標籤
        const bars = group
            .selectAll('rect')
            .data(data)

        //長條圖不透明度
        const normalOpacity = 0.7,
            hoverOpacity = 1;
        
        //繪製長條的圖形
        bars.enter()
            .append('rect')
            .attr('x', function(d, i) {
                // return i * 30;
                return x(d.name);
            })
            .attr('y', function(d) {
                return y(d.sale)
            })
            // .attr('width', 20)
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                // console.log(d)//d是物件
                // return d.sale;
                return height - y(d.sale);
            })
            .attr('fill', function(d) {
                if (d.sale >= avgSale) {
                    return '#30c39e'
                } else {
                    return '#fd5c63'
                }
            })
            .attr('opacity', normalOpacity)
            // .on('事件名稱', function(d){})
            .on('mousemove', function(d){
                // console.log('mouseenter');
                // console.log(d);
                // console.log(this);
                //d3.event
                // console.log(d3.event)
                //選到被接觸的矩形
                d3.select(this)
                    .attr('opacity', hoverOpacity)
                //選到tooltip
                d3.select('#tooltip')
                    //改變文字
                    // .text(`<p>${d.name}</p>`)
                    //改變html
                    .html(`<p>${d.name}</p><p>$ ${d.sale}</p>`)
                    //改變此元素的css
                    .style('opacity', 1)
                    .style('left', `${d3.event.pageX}px`)
                    .style('top', `${d3.event.pageY - 40}px`)
            })
            .on('mouseleave', function (d) {
                // console.log('mouseleave');
                //把離開的矩形不透明度恢復正常
                d3.select(this)
                    .attr('opacity', normalOpacity)
                d3.select('#tooltip')
                    //改變此元素的css
                    .style('opacity', 0);
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


