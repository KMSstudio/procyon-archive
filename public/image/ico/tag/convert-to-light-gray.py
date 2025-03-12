from PIL import Image

def process_png(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    
    width, height = img.size

    # グレー (#bbb) の設定
    gray_color = (187, 187, 187, 255)  

    # 透明度に応じてピクセルを変更
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > 0:  # 不透明なピクセルのみ変更
                pixels[x, y] = gray_color  

    img.save(output_path, "PNG")

# 実行例
process_png("tag.png", "tag.png")