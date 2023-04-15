# Recommendation Alignment (RecAlign)

- [Installation.](./docs/get_started/install_chrome_extension_en.md)
- [Chrome Web Store Page.](https://chrome.google.com/webstore/detail/recalign/eedopfonifglenhkedconaljmbnaimej?hl=en-GB)

Recommendation systems (e.g., Twitter) optimize for your attention and spoil you to the detriment of your own well-being. Their objective is fundamentally misaligned with yours.

We are starting an open source initiative RecAlign (short for Recommendation Alignment) to address this misalignment. We use large language models (LLMs) to vet and remove recommendations according to your explicitly stated preference in a transparent and editable way.

# Setting Up:
- Pin the extension on the toolbar.
- Click on the extension icon.
- Fill in your preference as well as your OpenAI API Key, which you can find [here](https://platform.openai.com/account/api-keys).

# Dev build:
- Run `npm install`.
- Run `npm run build`.
- Compiled chrome extension now exsits at the `chrome-extension` folder.
- Load the `chrome-extension` folder as unpacked extension.
