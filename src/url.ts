export function joinUrl(args: string[]) {
    let hasQuery = args?.length > 0 && args[0].indexOf("?") > -1;
    const url = args.reduce((acc, arg) => {
        let res;
        if (hasQuery) {
            if (arg.startsWith("?") || arg.startsWith("&")) {
                res = acc + arg.substring(1);
            } else {
                res = acc + "&" + arg;
            }
        } else if (arg.startsWith("?")) {
            res = acc + arg;
        } else if (acc.endsWith("/") && arg.startsWith("/")) {
            res = acc + arg.substring(1);
        } else if (!acc.endsWith("/") && !arg.startsWith("/")) {
            res = acc + "/" + arg;            
        } else {
            res = acc + arg;
        }        
        hasQuery = hasQuery || res.indexOf("?") > -1;
        return res;
    });
    return url;
}
