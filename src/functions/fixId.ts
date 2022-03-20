export function fixId(s) {
    let t = s.split("-"), out = "";
    for (let i = 0; i < t.length - 1; i++) {
        out += t[i] + "-"
    }
    out = out.slice(0, -1)
    return out
}