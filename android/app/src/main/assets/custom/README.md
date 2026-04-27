# Sequel Sans Fonts – Setup Guide

## Required Files

Place the following **5 TTF font files** in this directory (`src/assets/fonts/`):

| File Name                        | Used For                                      |
|----------------------------------|-----------------------------------------------|
| `SequelSans-SemiBoldHead.ttf`    | Navigation Title (28pt)                       |
| `SequelSans-MediumBody.ttf`      | Page Title (22pt), Section Header (17pt), Button Text (15pt) |
| `SequelSans-BookBody.ttf`        | Primary Body (15pt), Caption (12pt), Small Label (11pt) |
| `SequelSans-LightBody.ttf`       | Secondary Body (13pt)                         |
| `SequelSans-SemiBoldBody.ttf`    | Section Label (13pt)                          |

## After Adding Font Files

Run the asset linker to copy fonts into native layers:

```bash
npx react-native-asset
```

Then rebuild the app:

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## Font Registration

- **iOS**: Fonts are pre-registered in `ios/OSPLCommunityApp/Info.plist` under `UIAppFonts`.
- **Android**: The `react-native.config.js` points to `./src/assets/fonts/`. Running `npx react-native-asset` copies them automatically to `android/app/src/main/assets/fonts/`.
