# Recommendation Alignment (RecAlign)

[<img src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png">](https://chrome.google.com/webstore/detail/recalign/eedopfonifglenhkedconaljmbnaimej)

- [Development Installation.](./docs/get_started/install_chrome_extension_en.md)

Recommendation systems (e.g., Twitter) optimize for your attention and spoil you to the detriment of your own well-being. Their objective is fundamentally misaligned with yours.

We are developing an open source chrome extension RecAlign (short for Recommendation Alignment) to address this misalignment. We use large language models (LLMs) to vet and remove recommendations according to your explicitly stated preference in a transparent and editable way.

![Animation](https://user-images.githubusercontent.com/6410074/232265086-b7832c3a-fff9-4edc-bb4c-c0c4c3faf449.gif)

# Setting Up:
- Pin the extension on the toolbar.
- Click on the extension icon.
- Fill in your preference as well as your OpenAI API Key, which you can find [here](https://platform.openai.com/account/api-keys).

# Dev build:
- Run `npm install`.
- Run `npm run build`.
- Compiled chrome extension now exsits at the `chrome-extension` folder.
- Load the `chrome-extension` folder as unpacked extension.
