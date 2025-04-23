import sys
import os
from PIL import Image, ImageEnhance

def quantize_to_three_colors(image):
    """Convert image to 3 colors: white, black, red."""
    pixels = image.load()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y][:3]
            
            if (r > 200 and g > 200 and b > 200):
                pixels[x, y] = (255, 255, 255)  # white
            elif (r > 150 and g < 50 and b < 50):
                pixels[x, y] = (255, 0, 0)      # red
            else:
                pixels[x, y] = (0, 0, 0)        # black
    return image

def convert_image(input_path):
    if not os.path.exists(input_path):
        print("File not found.")
        return

    ext = os.path.splitext(input_path)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg"]:
        print("Unsupported file type.")
        return

    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        # Transparent pixels to black
        new_img = Image.new("RGBA", (width, height), (0, 0, 0, 255))
        new_img.paste(img, mask=img.split()[3])  # paste only where alpha > 0
        # Remove alpha and convert to RGB
        new_img = new_img.convert("RGB")
        # Quantize to black, white, red
        new_img = quantize_to_three_colors(new_img)
        # Darken image by 85%
        enhancer = ImageEnhance.Brightness(new_img)
        new_img = enhancer.enhance(0.15)
        # Save as .webp
        output_path = os.path.splitext(input_path)[0] + "_converted.webp"
        new_img.save(output_path, "WEBP")
        print(f"Saved: {output_path}")

    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_to_webp_3color.py <image_path>")
    else:
        convert_image(sys.argv[1])
