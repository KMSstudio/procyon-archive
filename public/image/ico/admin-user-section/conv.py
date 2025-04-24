from PIL import Image
import os

def process_png(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()

    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            else:
                pixels[x, y] = (255, 255, 255, a)

    img.save(output_path, format="PNG")
    print(f"Saved processed image to {output_path}")

input_file = "prestige.png"
output_file = "prestige.png"

process_png(input_file, output_file)
