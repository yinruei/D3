d3.csv('data.csv')
    .then(function (data) {
        // console.log(data);
        //篩選出2019年5月的資料
        data = data.filter(d => {
            return d['日期'] === '2019年05月'
        });
        /*
            {
                city:'新北市',
                data: [{
                    title: '住宅用電',
                    value: xxx,
                }, {}, {}, {}]
            }
        */

        data = data.map(d => {
            for (let p in d) {
                // console.log(p);
                //檢查這筆資料始不是數字格式
                if ( !isNaN(d[p]) ) {
                    //把這筆資料轉成數字
                    d[p] = +d[p]//前面加個+就是等於parsefloat
                }
            }
            console.log(d);
            return {
                city: d['縣市'],
                data: [
                    {
                        title: '住宅用電',
                        value: d['住宅部門售電量(度)']
                    },
                    {
                        title: '服務業部門',
                        value: d['服務業部門售電量(度)']
                    },
                    {
                        title: '機關用電',
                        value: d['機關用電售電量(度)']
                    },
                    {
                        title: '農林漁牧',
                        value: d['農林漁牧售電量(度)']
                    },
                ]
            };
        })
        // console.log(data);

        // 選擇row
        const row =d3.select('#row');
        //定義一個欄
        const column = row
            .selectAll('.column')
            .data(data)
            .enter()
            .append('div')
            .attr('class', 'col-md-4')
            .append('div')
            .attr('class', 'column');

        //放置標題
        column.append('h1')
            .attr('class', 'text-center text-primary mb-5 mt-5')
            .text(function (d) {
                return d.city;
            });

        //定義尺寸
        const width = d3.select('.column').node().clientWidth,//400,
            height = width + 200,
            radius = width / 2;

        //取得.column的寬度
        // console.log('column: ', d3.select('.column').node().clientWidth);

        //定義顏色
        // const colors = d3.schemeCategory10;
        // console.log('colors: ', colors[10]);

        //顏色列表
        const colors = d3.scaleOrdinal()
            .range(d3.schemeCategory10)
            // .range(['red', 'orange', 'green'])
        // console.log(colors(0))
        // console.log(colors(1))
        // console.log(colors(2))
        // console.log(colors(3))
        // console.log(colors(10))
        // console.log(colors(11))


        // 定義形狀產生器
        const arc = d3.arc()
            .innerRadius(radius - 100)
            .outerRadius(radius)

        const pie = d3.pie()
            .value(function(d) {
                return d.value;
            });

        //放置svg
        const svg = column.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)//縮放，這邊是100%的縮放
        /*
            {
                title: 'xxx',
                data: [{}, {}, {}]
            }
        */

        //在每個svg裡放入一個g.label-container
        const labelContainer = svg.append('g')
            .attr('class', 'label-container')
            .attr('transform', `translate(0, ${(radius * 2) + 15})`)

        const labelGroup = labelContainer
            .selectAll('.label-group')
            .data(function(d) {
                // console.log(d.data);
                return d.data;
            })
            .enter()
            .append('g')
            .attr('class', 'label-group')
            //照資料順序位移y
            .attr('transform', function(d, i) {
                return `translate(0, ${16 * i})`
            })

        labelGroup.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', function(d, i) {
                return colors(i);
            });

        labelGroup.append('text')
            .text(function (d) {
                return `${d.title}:${d.value}`
            })
            .attr('font-size', 10)
            .attr('y', 8)
            .attr('x', 15)

        const arcs = svg
            .selectAll('.arc')
            .data(function(d) {
                return pie(d.data);
            })
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('transform', `translate(${radius}, ${radius})`);

        arcs.append('path')
            .attr('d', function(d) {
                // console.log(d);
                // console.log(arc(d));
                return arc(d)
            })
            .attr('fill', function(d, i) {
                return colors(i);
            })

        // arcs.attr('test', function (d) {
        //     console.log(d);
        // });
    });