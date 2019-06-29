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
                        title: '住宅用電',
                        value: d['服務業部門售電量(度)']
                    },
                    {
                        title: '住宅用電',
                        value: d['機關用電售電量(度)']
                    },
                    {
                        title: '住宅用電',
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
            .attr('class', 'text-center text-primary')
            .text(function (d) {
                return d.city;
            });

        //定義尺寸
        const width = 400,
            height = 400,
            radius = width / 2;

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
            .attr('width', width)
            .attr('height', height)

        /*
            {
                title: 'xxx',
                data: [{}, {}, {}]
            }
        */
        const arcs = svg
            .selectAll('.arc')
            .data(function(d) {
                return pie(d.data);
            })
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('transform', `translate(${radius}, ${radius})`);

        const colors = d3.schemeCategory10;
        arcs.append('path')
            .attr('d', function(d) {
                // console.log(d);
                // console.log(arc(d));
                return arc(d)
            })
            .attr('fill', function(d, i) {
                return colors[i];
            })

        // arcs.attr('test', function (d) {
        //     console.log(d);
        // });
    });