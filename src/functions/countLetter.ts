export function countLetter(str: string, char: string): number {
    return str.split(char).length - 1
}