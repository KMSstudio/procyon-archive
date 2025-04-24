"""
==========================================
WebP Converter (conv2webp.py)
==========================================

Purpose
- A script to convert PNG, JPG, and JPEG images to WebP format
  to reduce image file size and improve web performance.
- WebP provides superior lossless and lossy compression for images on the web.

How it works
- Accepts either a single image file or a directory path.
- If a directory is given, it asks for user confirmation before converting all supported images inside.
- Processes only files with .png, .jpg, or .jpeg extensions and saves them with a .webp extension.

Usage
python conv2webp.py <path>

Examples
- Convert a single image:
    python conv2webp.py ./logo.png

- Convert all supported images in a folder:
    python conv2webp.py ./images/

Supported Formats
- Input: .png, .jpg, .jpeg
- Output: .webp

Notes
- No emojis are used in output messages to ensure console compatibility.
- WebP is widely supported by modern browsers, but fallback formats may still be necessary in some environments.
"""

"""
==========================================
WebP変換ツール (conv2webp.py)
==========================================

目的
- PNG、JPG、JPEG形式の画像をWebP形式に変換し、
  画像ファイルサイズを削減してWebパフォーマンスを向上させるためのスクリプトです。
- WebPは、Web向けに優れた可逆圧縮および非可逆圧縮を提供する画像フォーマットです。

動作概要
- 単一の画像ファイルまたはディレクトリパスを受け付けます。
- ディレクトリが指定された場合は、対象画像を一括変換する前にユーザーの確認を求めます。
- .png、.jpg、.jpeg拡張子のファイルのみを処理し、同名で拡張子を .webp に変更して保存します。

使い方
python conv2webp.py <パス>

使用例
- 単一画像の変換:
    python conv2webp.py ./logo.png

- フォルダ内の画像を一括変換:
    python conv2webp.py ./images/

対応フォーマット
- 入力: .png, .jpg, .jpeg
- 出力: .webp

備考
- 出力メッセージには絵文字を使用しておらず、コンソール互換性を重視しています。
- WebPは多くのモダンブラウザに対応していますが、古い環境ではフォールバック画像が必要になる場合があります。
"""

import os
import sys
from PIL import Image

SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg"]

def convert_to_webp(image_path):
    ext = os.path.splitext(image_path)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        print(f"Unsupported extension: {ext} - Skipping")
        return

    try:
        img = Image.open(image_path).convert("RGBA" if ext == ".png" else "RGB")
        output_path = os.path.splitext(image_path)[0] + ".webp"
        img.save(output_path, "WEBP")
        print(f"Converted: {image_path} -> {output_path}")
    except Exception as e:
        print(f"Failed to convert {image_path}: {e}")

def process_directory(directory_path):
    files = [f for f in os.listdir(directory_path)
             if os.path.isfile(os.path.join(directory_path, f)) and
             os.path.splitext(f)[1].lower() in SUPPORTED_EXTENSIONS]

    if not files:
        print("No supported image files found in the directory.")
        return

    print(f"{len(files)} files will be converted. Proceed? [Y/n]", end=" ")
    response = input().strip().lower()
    if response not in ["", "y", "yes"]:
        print("Operation cancelled.")
        return

    for filename in files:
        file_path = os.path.join(directory_path, filename)
        convert_to_webp(file_path)

def main():
    if len(sys.argv) > 1:
        path = sys.argv[1]
    else:
        path = input("Enter the file or directory path: ").strip()

    if not os.path.exists(path):
        print("Invalid path.")
        return

    if os.path.isdir(path):
        process_directory(path)
    elif os.path.isfile(path):
        convert_to_webp(path)
    else:
        print("Input must be a valid file or directory path.")

if __name__ == "__main__":
    main()