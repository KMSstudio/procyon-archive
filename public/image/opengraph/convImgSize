from PIL import Image

def resize_image(input_path, output_path, size=(1200, 630)):
    # 画像を開く
    img = Image.open(input_path)
    # サイズを変更する
    resized_img = img.resize(size, Image.LANCZOS)
    # 保存する
    resized_img.save(output_path)

resize_image("erin.png", "erin.png");