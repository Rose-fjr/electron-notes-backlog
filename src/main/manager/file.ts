import path from "path"

export const getImagePath = (img: string): string => {
    return path.join(__dirname, img);
}
