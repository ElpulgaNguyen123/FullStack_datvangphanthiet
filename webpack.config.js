var path = require ('path');
const config = {
    entry : './app.js', // file chạy chính
    output : { // chỉ định chính xác đường dẫn và filename cho webpack sau khi đóng gói
        filename : "bundel.js",
        path:path.resolve(__dirname,'build')
    },
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : '/node_modules'
            }
        ]
    },
    mode: 'development'                                                       
}                   

module.exports = config