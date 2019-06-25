//svg的大小
const svgWidth = 500,
    svgHeight = 500;

//svg對圖表的留白
const padding = {
    top: 20,
    bottom: 20,
    left: 60,
    right: 20
}

//圖表的大小
const width = svgWidth - padding.left - padding.right,
    height = svgHeight - padding.top - padding.bottom;

// 在圖表容器裡面放入svg
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// 在svg放入一個group
const group = svg.append('g')
    //讓圖表區位移
    .attr('transform', `translate(${padding.left}, ${padding.top})`);

// 讀取csv檔案
const csv = d3
    .csv('source.csv')
    // 當成功讀取檔案之後
    .then(function (data) {
        data.forEach(function (d) {
            // 把sale值轉為數字
            d.sale = parseFloat(d.sale);
        });

        // 計算平均sale
        const avgSale = data.reduce(function (num, d) {
            // console.log('num', num);
            // console.log('d', d);
            return num + d.sale;
        }, 0) / data.length;

        // 計算出最高的sale
        const maxSale = d3.max(data, function (d) {
            // 回傳需要比對大小的屬性
            return d.sale;
        });

        // 整理Labels
        const labels = data.map(function (d) {
            return d.name;
        });

        // 建立x軸的對應
        const x = d3.scaleBand()
            // 傳入原始資料需要對照的key
            .domain(labels)
            // 顯示時最小與最大的值
            .range([0, width])
            // 每一個bar之間的留白比例
            .paddingInner(0.1)
            // bars左右留白的比例
            .paddingOuter(0.1);

        // 顯示寬度 / 資料的長度 - 留白
        // console.log(x.bandwidth());
        // console.log({
        //     // Linda長條圖x的位移
        //     Linda: x('Linda'),
        //     David: x('David'),
        //     Andrew: x('Andrew'),
        //     Josh: x('Josh')
        // });

        //描述需要顯示x軸
        const xAxis = d3.axisBottom(x);
        //把x軸放到svg
        // svg.append('g')
        //     .call(xAxis)
        //     .attr('transform', `translate(${padding.left}, ${height + padding.top})`)

        group.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${height})`);

        // 建立y軸的比例尺
        const y = d3.scaleLinear()
            // 傳入原始資料最小與最大值
            .domain([0, maxSale])
            // 定義顯示時，最小與最大的像素
            .range([0, height]);

        // console.log(y(0))
        // console.log(y(5000))
        // console.log(y(10000))
        // console.log(y(21000))

        //定義要顯示的y軸
        const yAxis = d3.axisLeft(y);
        // 把y軸放置到畫面上
        group.append('g')
            .call(yAxis);

        // 定義長條的群組，並傳遞資料
        const bars = group
            .selectAll('rect')
            .data(data);

        // 長條徒不透明度
        const normalOpacity = 0.7,
            hoverOpacity = 1;

        // 繪製長條圖形
        bars.enter()
            .append('rect')
            .attr('x', function (d, i) {
                return x(d.name)
            })
            .attr('y', function(d) {
                return y(d.sale);
            })
            .attr('width', x.bandwidth())
            .attr('height', function (d) {
                return height - y(d.sale);
            })
            .attr('fill', function (d) {
                if (d.sale >= avgSale) {
                    return '#30c39e'
                } else {
                    return '#fd5c63'
                }
            })
            .attr('opacity', normalOpacity)
            // .on('事件名稱', function(d){})
            .on('mousemove', function(d) {
                // console.log('mouseenter');
                // console.log(d);
                // console.log(this);
                //d3.event
                console.log(d3.event);
                //選到被接觸的矩形
                d3.select(this)
                    .attr('opacity', hoverOpacity);
                //選到tooltip
                d3.select('#tooltip')
                    //改變文字
                    // .text(d.name)//text只能放文字，這方法不太好
                    //改變html
                    .html(`<p>${d.name}</p><p>$ ${d.sale}</p>`)
                    // 改變此元素css設定
                    .style('opacity', 1)
                    .style('left', `${d3.event.pageX}px`)
                    .style('top', `${d3.event.pageY - 40}px`)

            })
            .on('mouseleave', function (d) {
                //把離開的矩形不透明度恢復成正常
                d3.select(this)
                    .attr('opacity', normalOpacity);
                d3.select('#tooltip')
                    .style('opacity', 0);
            })
    });

// console.log(csv);

/*
const data = [10, 5, 6, 7, 15];
// 將group內的rect標籤對應到data內的資料
const bars = group.selectAll('rect').data(data);
bars.enter()
    .append('rect')
    .attr('width', 10)
    .attr('height', function (d) {
        return d * 10;
    })
    .attr('y', 20)
    .attr('x', function (d, i) {
        return i * 20
    })
*/