export function numToEmojis(n) {
    let numbers = "" + n, out = "";
    for (let i = 0; i < numbers.length; i++) {
        switch (numbers.charAt(i)) {
            case '0': {
                out += ":zero:"
                break;
            }
            case '1': {
                out += ":one:"
                break;
            }
            case '2': {
                out += ":two:"
                break;
            }
            case '3': {
                out += ":three:"
                break;
            }
            case '4': {
                out += ":four:"
                break;
            }
            case '5': {
                out += ":five:"
                break;
            }
            case '6': {
                out += ":six:"
                break;
            }
            case '7': {
                out += ":seven:"
                break;
            }
            case '8': {
                out += ":eight:"
                break;
            }
            case '9': {
                out += ":nine:"
                break;
            }
            default: {
                break;
            }
        }
    }
    return out;

}