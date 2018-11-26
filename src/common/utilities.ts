export function toGraphCallback(this:any) {
    return JSON.parse(JSON.stringify(this));
}