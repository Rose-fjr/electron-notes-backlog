import path from "path"

export const getImagePath = (img: string): string => {
    return path.resolve(__dirname, img);
}
