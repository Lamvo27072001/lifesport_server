const convertIntoSnake = (string:string) => {
    const new_string = string.toLowerCase().replaceAll(' ', '_');
    return new_string
}
const reverseFromSnake = (string: string) => {
    const new_string = string.toUpperCase().replaceAll("_", " ");
    return new_string;
}
export{convertIntoSnake,reverseFromSnake}