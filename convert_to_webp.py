import os
from PIL import Image
import sys

# Configuration
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(PROJECT_ROOT, 'public', 'images')
SEARCH_DIRS = [
    os.path.join(PROJECT_ROOT, 'views'),
    os.path.join(PROJECT_ROOT, 'public', 'css'),
    os.path.join(PROJECT_ROOT, 'public', 'js'),
]
EXTENSIONS_TO_CONVERT = {'.png', '.jpg', '.jpeg', '.JPG', '.PNG'}
TEXT_EXTENSIONS = {'.ejs', '.css', '.js', '.html', '.json'}

def convert_images():
    converted_files = [] # List of (old_name, new_name)

    print(f"Scanning images in {IMAGES_DIR}...")
    for root, dirs, files in os.walk(IMAGES_DIR):
        for file in files:
            file_path = os.path.join(root, file)
            _, ext = os.path.splitext(file)
            
            if ext in EXTENSIONS_TO_CONVERT:
                new_file_path = os.path.splitext(file_path)[0] + '.webp'
                
                # Skip if webp already exists and is newer? No, just overwrite/create.
                try:
                    with Image.open(file_path) as img:
                        print(f"Converting: {file} -> .webp")
                        # Handle RGBA for PNG
                        img = img.convert('RGBA') if ext.lower() == '.png' else img.convert('RGB')
                        img.save(new_file_path, 'WEBP', quality=80)
                    
                    old_filename = file
                    new_filename = os.path.splitext(file)[0] + '.webp'
                    converted_files.append((old_filename, new_filename))
                    
                    # Optional: Delete original? 
                    # User said "convert... and change references", implying replacement.
                    # I'll delete the old file to be clean, as per "convert" usually implies.
                    os.remove(file_path)
                    
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")

    return converted_files

def update_references(converted_files):
    if not converted_files:
        print("No files converted.")
        return

    print(f"Updating references for {len(converted_files)} files...")
    
    for root_dir in SEARCH_DIRS:
        if not os.path.exists(root_dir):
            continue
            
        for root, dirs, files in os.walk(root_dir):
            for file in files:
                if any(file.endswith(ext) for ext in TEXT_EXTENSIONS):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        original_content = content
                        for old_name, new_name in converted_files:
                            if old_name in content:
                                print(f"Updating {old_name} -> {new_name} in {file}")
                                content = content.replace(old_name, new_name)
                        
                        if content != original_content:
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(content)
                                
                    except Exception as e:
                        print(f"Error processing {file}: {e}")

if __name__ == '__main__':
    try:
        import PIL
    except ImportError:
        print("Error: Pillow library not found.")
        print("Please run: pip install Pillow")
        sys.exit(1)

    replacements = convert_images()
    update_references(replacements)
    print("Conversion completed!")
