# Halt immediately if any command fails:
set -e

# Create a fresh clone of this repository at /tmp:
rm -f /tmp/llm-rec.zip
cd /tmp
git clone git@github.com:tjingrant/llm-rec.git
cd llm-rec
git checkout main

# Compute the sha256 hash of requirements.txt and store it to filename:
filename=$(sha256sum requirements.txt | cut -d' ' -f1)

# Check if a previously packaged version exists based on the sha256 hash of requirements.txt:
if [ -f /tmp/$filename.zip ]; then
    echo "Using previously packaged version."
# If not install and package dependency:
else
    echo "Packaging dependencies."

    # Install dependencies:
    pip install -r requirements.txt --target ./package

    # Zip the package to a file named as the sha256 hash of requirements.txt:
    cd package
    zip -r /tmp/$filename.zip .
    cd ..
    rm -rf package
fi

# Zip the source code:
zip -r /tmp/$filename.zip .

# Clean up:
rm -rf /tmp/llm-rec
mv /tmp/$filename.zip /tmp/llm-rec.zip

echo "Done. The deployment package is at /tmp/llm-rec.zip"