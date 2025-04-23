"""
This script converts image files (.png, .jpg, .jpeg) to .webp format.
If a directory is provided, it asks for confirmation before processing all image files in that directory (Y/n).
If no argument is provided, it asks the user to input the path.
Output files are saved with the same base name and a .webp extension.
Emoji is not used in the console output.
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