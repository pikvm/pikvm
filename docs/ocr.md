# OCR

This feature allows you to select a screen region, recognize it as text and copy this text to the clipboard.
Recognition works locally on your PiKVM and does not use any cloud services. It uses the [Tesseract OCR library](https://github.com/tesseract-ocr/tesseract).
Tesseract does not see your image until you explicitly give the recognition command. The evil AI is not watching your screen.

## Language support

For any language, you will have to install its support. It is very easy to do this (English language for example):
```
# rw
# pacman --assume-installed tessdata -S tesseract-data-eng
# ro
```

List all available languages in the repository:
```
# pacman -Ss tesseract-data
```

## Disabling OCR

If you want to get rid of this feature completely, you need to delete Tesseract and all its data:

```
# rw
# pacman -R tesseract
# reboot
```
