/**
 * Created by Administrator on 2017/12/19.
 */
function log() {
    console.log(arguments)
    let args = Array.prototype.slice.apply(arguments,[0,2]);
    console.log(args)
    args.unshift("(app)");
    console.log.apply(console,args);
}

log("a","b")