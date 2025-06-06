from PIL import Image

def invert_grayscale(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()

    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a != 0:
                grayscale = int(0.299 * r + 0.587 * g + 0.114 * b)
                inverted = 255 - grayscale
                # invert

                # pixels[x, y] = (inverted, inverted, inverted, a)
                # pixels[x, y] = (255, 255, 255, 255)
                pixels[x, y] = (247, 143, 30, 255)

    img.save(output_path)

invert_grayscale(r'src\public\image\ico\admin.png', r'src\public\image\ico\admin-hover.png')