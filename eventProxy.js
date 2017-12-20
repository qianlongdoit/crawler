/**
 * Created by admin on 2017/12/12.
 */
const eventproxy = require("eventproxy");

const ep = new eventproxy();

let count = 0;
ep.after('count', 20, function (list) {
    console.log(list)
});
for (let i = 0; i < 20; i++) {

    ((a)=>{
        setTimeout(()=>{
            ep.emit("count",a)
        },a*500);
    })(i)
}